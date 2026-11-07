import type { Cafe } from '../api/schemas'

export interface SeleccionCafe {
  bebida?: Cafe['tipo']
  tamanio?: string
  origen?: string
}

export function buscarCafe(
  productos: Cafe[],
  seleccion: SeleccionCafe,
): Cafe | undefined {
  const { bebida, tamanio, origen } = seleccion

  if (!bebida || !tamanio || !origen) return undefined

  return productos.find(
    (producto) =>
      producto.tipo === bebida &&
      producto.tamanio === tamanio &&
      producto.variedad.nombre === origen,
  )
}
