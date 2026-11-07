import { describe, expect, it } from 'vitest'
import type { Cafe, Producto } from '../api/schemas'
import { productos } from '../mocks/datos'
import { buscarCafe } from './buscarCafe'

function esCafe(producto: Producto): producto is Cafe {
  return producto.tipo !== 'pasteleria'
}

const cafes = productos.filter(esCafe)

describe('buscarCafe', () => {
  it('encuentra el expreso mediano de Colombia sin depender de su id', () => {
    const resultado = buscarCafe(cafes, {
      bebida: 'expreso',
      tamanio: 'Mediano',
      origen: 'Colombia',
    })

    expect(resultado?.id).toBe(9)
  })

  it('encuentra el filtrado en taza grande de Brasil', () => {
    const resultado = buscarCafe(cafes, {
      bebida: 'filtrado',
      tamanio: 'Taza grande',
      origen: 'Brasil',
    })

    expect(resultado?.id).toBe(14)
  })

  it('devuelve undefined cuando la elección está incompleta', () => {
    expect(
      buscarCafe(cafes, {
        bebida: 'expreso',
        tamanio: 'Mediano',
      }),
    ).toBeUndefined()
  })
})
