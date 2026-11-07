import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { pedidoDeEjemplo, productos } from '../mocks/datos'
import { server } from '../mocks/server'
import { ApiError, crearPedido, getPedido, getProductos } from './client'

describe('getProductos', () => {
  it('devuelve los 20 productos validados', async () => {
    const resultado = await getProductos()

    expect(resultado).toHaveLength(20)
    expect(resultado).toEqual(productos)
  })

  it('con 500 y { error } lanza ApiError con el mensaje de la API', async () => {
    server.use(
      http.get('/api/productos', () =>
        HttpResponse.json({ error: 'Error interno del servidor' }, { status: 500 }),
      ),
    )

    const promesa = getProductos()

    await expect(promesa).rejects.toBeInstanceOf(ApiError)
    await expect(promesa).rejects.toThrow('Error interno del servidor')
  })

  it('con la API caída lanza "No se pudo conectar con la cafetería"', async () => {
    server.use(http.get('/api/productos', () => HttpResponse.error()))

    await expect(getProductos()).rejects.toThrow('No se pudo conectar con la cafetería')
  })

  it('si la respuesta no cumple el contrato lanza "Respuesta inválida de la API"', async () => {
    server.use(
      http.get('/api/productos', () =>
        HttpResponse.json([{ id: 9, tipo: 'expreso', nombre: 'Expreso', precio: '7360' }]),
      ),
    )

    await expect(getProductos()).rejects.toThrow('Respuesta inválida de la API')
  })
})

describe('crearPedido', () => {
  it('envía POST /api/pedidos con el body y devuelve el pedido validado', async () => {
    let bodyRecibido: unknown
    server.use(
      http.post('/api/pedidos', async ({ request }) => {
        bodyRecibido = await request.json()
        return HttpResponse.json(pedidoDeEjemplo, { status: 201 })
      }),
    )
    const body = {
      mesaId: 4,
      items: [
        { productoId: 9, cantidad: 2 },
        { productoId: 19, cantidad: 1 },
      ],
    }

    const pedido = await crearPedido(body)

    expect(bodyRecibido).toEqual(body)
    expect(pedido).toEqual(pedidoDeEjemplo)
  })

  it('con 400 lanza ApiError con el mensaje de la API', async () => {
    const promesa = crearPedido({ mesaId: 99, items: [{ productoId: 9, cantidad: 1 }] })

    await expect(promesa).rejects.toThrow('Mesa inexistente: 99')
  })
})

describe('getPedido', () => {
  it('consulta GET /api/pedidos/:id y devuelve el pedido', async () => {
    let idConsultado: unknown
    server.use(
      http.get('/api/pedidos/:id', ({ params }) => {
        idConsultado = params.id
        return HttpResponse.json({ ...pedidoDeEjemplo, estado: 'listo' })
      }),
    )

    const pedido = await getPedido(1)

    expect(idConsultado).toBe('1')
    expect(pedido.estado).toBe('listo')
  })
})