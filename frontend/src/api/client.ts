import type { z } from 'zod'
import {
  errorSchema,
  pedidoSchema,
  productosSchema,
  type NuevoPedido,
  type Pedido,
  type Producto,
} from './schemas'

const BASE = '/api'

export class ApiError extends Error {
  // status 0 = no hubo respuesta (API caída o sin red)
  readonly status: number

  constructor(mensaje: string, status: number) {
    super(mensaje)
    this.name = 'ApiError'
    this.status = status
  }
}

async function pedir<T>(ruta: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> {
  let respuesta: Response
  try {
    respuesta = await fetch(`${BASE}${ruta}`, init)
  } catch {
    throw new ApiError('No se pudo conectar con la cafetería', 0)
  }

  const datos: unknown = await respuesta.json().catch(() => null)

  if (!respuesta.ok) {
    const error = errorSchema.safeParse(datos)
    const mensaje = error.success ? error.data.error : `Error ${respuesta.status}`
    throw new ApiError(mensaje, respuesta.status)
  }

  const resultado = schema.safeParse(datos)
  if (!resultado.success) {
    throw new ApiError('Respuesta inválida de la API', respuesta.status)
  }
  return resultado.data
}

export function getProductos(): Promise<Producto[]> {
  return pedir('/productos', productosSchema)
}

export function crearPedido(body: NuevoPedido): Promise<Pedido> {
  return pedir('/pedidos', pedidoSchema, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function getPedido(id: number): Promise<Pedido> {
  return pedir(`/pedidos/${id}`, pedidoSchema)
}