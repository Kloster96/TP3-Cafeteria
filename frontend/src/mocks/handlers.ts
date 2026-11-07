import { http, HttpResponse } from 'msw'
import type { ItemPedido, Pedido } from '../api/schemas'
import { productos } from './datos'

const MESA_MAXIMA = 12

let pedidos: Pedido[] = []

export function reiniciarPedidos(): void {
  pedidos = []
}

function error(status: number, mensaje: string) {
  return HttpResponse.json({ error: mensaje }, { status })
}

function precioDe(productoId: number): number {
  return productos.find((p) => p.id === productoId)?.precio ?? 0
}

function esEnteroPositivo(valor: unknown): valor is number {
  return typeof valor === 'number' && Number.isInteger(valor) && valor > 0
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null
}

export const handlers = [
  http.get('/api/productos', () => HttpResponse.json(productos)),

  http.get('/api/productos/:id', ({ params }) => {
    const producto = productos.find((p) => p.id === Number(params.id))
    return producto
      ? HttpResponse.json(producto)
      : error(404, `Producto no encontrado: ${String(params.id)}`)
  }),

  http.post('/api/pedidos', async ({ request }) => {
    let body: unknown

    try {
      body = await request.json()
    } catch {
      return error(400, 'JSON inválido')
    }

    if (!esObjeto(body) || !Array.isArray(body.items) || body.items.length === 0) {
      return error(400, 'El pedido debe tener al menos un item')
    }

    const items: ItemPedido[] = []

    for (const item of body.items) {
      if (!esObjeto(item) || !esEnteroPositivo(item.productoId)) {
        return error(400, 'El productoId debe ser un número entero positivo')
      }

      if (!esEnteroPositivo(item.cantidad)) {
        return error(400, 'La cantidad debe ser un número entero positivo')
      }

      if (!productos.some((p) => p.id === item.productoId)) {
        return error(400, `Producto inexistente en el catálogo: ${item.productoId}`)
      }

      items.push({
        productoId: item.productoId,
        cantidad: item.cantidad,
      })
    }

    const mesaId = body.mesaId ?? null

    if (mesaId !== null && (!esEnteroPositivo(mesaId) || mesaId > MESA_MAXIMA)) {
      return error(400, `Mesa inexistente: ${String(mesaId)}`)
    }

    const pedido: Pedido = {
      id: pedidos.length + 1,
      mesaId,
      estado: 'pendiente',
      items,
      total: items.reduce(
        (suma, i) => suma + precioDe(i.productoId) * i.cantidad,
        0,
      ),
    }

    pedidos.push(pedido)

    return HttpResponse.json(pedido, { status: 201 })
  }),

  http.get('/api/pedidos', () => HttpResponse.json(pedidos)),

  http.get('/api/pedidos/:id', ({ params }) => {
    const pedido = pedidos.find((p) => p.id === Number(params.id))

    return pedido
      ? HttpResponse.json(pedido)
      : error(404, `Pedido no encontrado: ${String(params.id)}`)
  }),
]