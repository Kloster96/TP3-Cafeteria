export interface ItemCarrito {
  productoId: number
  nombre: string
  precio: number
  cantidad: number
}

export interface EstadoCarrito {
  items: ItemCarrito[]
}

export interface ProductoParaCarrito {
  id: number
  nombre: string
  precio: number
}

export type AccionCarrito =
  | { tipo: 'agregar'; producto: ProductoParaCarrito }
  | { tipo: 'sumar'; productoId: number }
  | { tipo: 'restar'; productoId: number }
  | { tipo: 'quitar'; productoId: number }
  | { tipo: 'vaciar' }

export const estadoInicialCarrito: EstadoCarrito = { items: [] }

export function carritoReducer(
  estado: EstadoCarrito,
  accion: AccionCarrito,
): EstadoCarrito {
  switch (accion.tipo) {
    case 'agregar': {
      const existente = estado.items.find(
        (item) => item.productoId === accion.producto.id,
      )

      if (existente) {
        return {
          items: estado.items.map((item) =>
            item.productoId === accion.producto.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item,
          ),
        }
      }

      return {
        items: [
          ...estado.items,
          {
            productoId: accion.producto.id,
            nombre: accion.producto.nombre,
            precio: accion.producto.precio,
            cantidad: 1,
          },
        ],
      }
    }

    case 'sumar':
      return {
        items: estado.items.map((item) =>
          item.productoId === accion.productoId
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        ),
      }

    case 'restar':
      return {
        items: estado.items.flatMap((item) => {
          if (item.productoId !== accion.productoId) return [item]
          if (item.cantidad === 1) return []
          return [{ ...item, cantidad: item.cantidad - 1 }]
        }),
      }

    case 'quitar':
      return {
        items: estado.items.filter(
          (item) => item.productoId !== accion.productoId,
        ),
      }

    case 'vaciar':
      return estadoInicialCarrito
  }
}

export function subtotalCarrito(estado: EstadoCarrito): number {
  return estado.items.reduce(
    (subtotal, item) => subtotal + item.precio * item.cantidad,
    0,
  )
}
