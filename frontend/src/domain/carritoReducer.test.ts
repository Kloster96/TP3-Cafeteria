import { describe, expect, it } from 'vitest'
import {
  carritoReducer,
  estadoInicialCarrito,
  subtotalCarrito,
  type EstadoCarrito,
} from './carritoReducer'

const expresoColombia = {
  id: 9,
  nombre: 'Expreso',
  precio: 7360,
}

const muffin = {
  id: 19,
  nombre: 'Muffin de chocolate',
  precio: 2500,
}

describe('carritoReducer', () => {
  it('agrega un producto nuevo con los datos de la API y cantidad 1', () => {
    const resultado = carritoReducer(estadoInicialCarrito, {
      tipo: 'agregar',
      producto: expresoColombia,
    })

    expect(resultado.items).toEqual([
      {
        productoId: 9,
        nombre: 'Expreso',
        precio: 7360,
        cantidad: 1,
      },
    ])
  })

  it('aumenta la cantidad cuando agrega un producto existente', () => {
    const conUnCafe = carritoReducer(estadoInicialCarrito, {
      tipo: 'agregar',
      producto: expresoColombia,
    })

    const resultado = carritoReducer(conUnCafe, {
      tipo: 'agregar',
      producto: expresoColombia,
    })

    expect(resultado.items).toHaveLength(1)
    expect(resultado.items[0]?.cantidad).toBe(2)
  })

  it('suma y resta unidades de un producto', () => {
    const estado: EstadoCarrito = {
      items: [
        {
          productoId: 9,
          nombre: 'Expreso',
          precio: 7360,
          cantidad: 2,
        },
      ],
    }

    const sumado = carritoReducer(estado, { tipo: 'sumar', productoId: 9 })
    const restado = carritoReducer(sumado, { tipo: 'restar', productoId: 9 })

    expect(sumado.items[0]?.cantidad).toBe(3)
    expect(restado.items[0]?.cantidad).toBe(2)
  })

  it('quita el producto cuando resta su única unidad', () => {
    const estado = carritoReducer(estadoInicialCarrito, {
      tipo: 'agregar',
      producto: expresoColombia,
    })

    const resultado = carritoReducer(estado, { tipo: 'restar', productoId: 9 })

    expect(resultado.items).toEqual([])
  })

  it('quita un producto sin alterar los demás', () => {
    const conCafe = carritoReducer(estadoInicialCarrito, {
      tipo: 'agregar',
      producto: expresoColombia,
    })
    const conDosProductos = carritoReducer(conCafe, {
      tipo: 'agregar',
      producto: muffin,
    })

    const resultado = carritoReducer(conDosProductos, {
      tipo: 'quitar',
      productoId: 9,
    })

    expect(resultado.items).toEqual([
      {
        productoId: 19,
        nombre: 'Muffin de chocolate',
        precio: 2500,
        cantidad: 1,
      },
    ])
  })

  it('vacía todos los productos', () => {
    const estado: EstadoCarrito = {
      items: [
        {
          productoId: 9,
          nombre: 'Expreso',
          precio: 7360,
          cantidad: 2,
        },
      ],
    }

    expect(carritoReducer(estado, { tipo: 'vaciar' })).toEqual(estadoInicialCarrito)
  })

  it('no muta el estado anterior', () => {
    const estado: EstadoCarrito = {
      items: [
        {
          productoId: 9,
          nombre: 'Expreso',
          precio: 7360,
          cantidad: 1,
        },
      ],
    }
    const snapshot: EstadoCarrito = {
      items: estado.items.map((item) => ({ ...item })),
    }

    const resultado = carritoReducer(estado, { tipo: 'sumar', productoId: 9 })

    expect(estado).toEqual(snapshot)
    expect(resultado).not.toBe(estado)
    expect(resultado.items).not.toBe(estado.items)
  })
})

describe('subtotalCarrito', () => {
  it('suma precio por cantidad de todos los productos', () => {
    const estado: EstadoCarrito = {
      items: [
        {
          productoId: 9,
          nombre: 'Expreso',
          precio: 7360,
          cantidad: 2,
        },
        {
          productoId: 19,
          nombre: 'Muffin de chocolate',
          precio: 2500,
          cantidad: 1,
        },
      ],
    }

    expect(subtotalCarrito(estado)).toBe(17220)
    expect(subtotalCarrito(estadoInicialCarrito)).toBe(0)
  })
})
