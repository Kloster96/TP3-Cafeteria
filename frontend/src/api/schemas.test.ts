import { describe, expect, it } from 'vitest'
import { pedidoSchema, productoSchema } from './schemas'

const expresoColombiaMediano = {
  id: 9,
  tipo: 'expreso',
  nombre: 'Expreso',
  precio: 7360,
  tamanio: 'Mediano',
  variedad: {
    nombre: 'Colombia',
    descripcion: 'Acidez media, cuerpo equilibrado y notas cítricas y florales',
  },
}

const muffin = {
  id: 19,
  tipo: 'pasteleria',
  nombre: 'Muffin de chocolate',
  precio: 2500,
}

const pedidoDeEjemplo = {
  id: 1,
  mesaId: 4,
  estado: 'pendiente',
  items: [
    { productoId: 9, cantidad: 2 },
    { productoId: 19, cantidad: 1 },
  ],
  total: 17220,
}

describe('productoSchema', () => {
  it('acepta un café como el del contrato', () => {
    expect(productoSchema.safeParse(expresoColombiaMediano).success).toBe(true)
  })

  it('acepta un producto de pastelería', () => {
    expect(productoSchema.safeParse(muffin).success).toBe(true)
  })

  it('rechaza un precio que viene como texto', () => {
    const conPrecioTexto = { ...expresoColombiaMediano, precio: '7360' }

    expect(productoSchema.safeParse(conPrecioTexto).success).toBe(false)
  })

  it('rechaza un tipo desconocido', () => {
    expect(productoSchema.safeParse({ ...muffin, tipo: 'bebida' }).success).toBe(false)
  })
})

describe('pedidoSchema', () => {
  it('acepta el pedido de ejemplo', () => {
    expect(pedidoSchema.safeParse(pedidoDeEjemplo).success).toBe(true)
  })

  it('acepta un pedido sin mesa (mesaId null)', () => {
    expect(pedidoSchema.safeParse({ ...pedidoDeEjemplo, mesaId: null }).success).toBe(true)
  })
})