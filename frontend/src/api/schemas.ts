import { z } from 'zod'

// Contrato de la API de Cafetería Origen.

const idSchema = z.number().int().positive()
const precioSchema = z.number().int().nonnegative()

const variedadSchema = z.object({
  nombre: z.string(),
  descripcion: z.string(),
})

const datosDeCafe = {
  id: idSchema,
  nombre: z.string(),
  precio: precioSchema,
  tamanio: z.string(),
  variedad: variedadSchema,
}

const expresoSchema = z.object({ tipo: z.literal('expreso'), ...datosDeCafe })
const filtradoSchema = z.object({ tipo: z.literal('filtrado'), ...datosDeCafe })

const pasteleriaSchema = z.object({
  tipo: z.literal('pasteleria'),
  id: idSchema,
  nombre: z.string(),
  precio: precioSchema,
})

export const productoSchema = z.discriminatedUnion('tipo', [
  expresoSchema,
  filtradoSchema,
  pasteleriaSchema,
])
export const productosSchema = z.array(productoSchema)

const itemPedidoSchema = z.object({
  productoId: idSchema,
  cantidad: z.number().int().positive(),
})

export const nuevoPedidoSchema = z.object({
  mesaId: z.number().int().positive().nullable().optional(),
  items: z.array(itemPedidoSchema).min(1),
})

export const pedidoSchema = z.object({
  id: idSchema,
  mesaId: z.number().int().positive().nullable(),
  estado: z.string(),
  items: z.array(itemPedidoSchema),
  total: precioSchema,
})

export const errorSchema = z.object({
  error: z.string(),
})

export type Producto = z.infer<typeof productoSchema>
export type Cafe = Extract<Producto, { tipo: 'expreso' | 'filtrado' }>
export type ProductoPasteleria = Extract<Producto, { tipo: 'pasteleria' }>
export type ItemPedido = z.infer<typeof itemPedidoSchema>
export type NuevoPedido = z.infer<typeof nuevoPedidoSchema>
export type Pedido = z.infer<typeof pedidoSchema>
export type ErrorApi = z.infer<typeof errorSchema>