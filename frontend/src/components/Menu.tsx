import type { Cafe, Producto, ProductoPasteleria } from '../api/schemas'
import { useMenu } from '../hooks/useMenu'
import { Pasteleria } from './Pasteleria'
import { SelectorCafe } from './SelectorCafe'

function esCafe(producto: Producto): producto is Cafe {
  return producto.tipo !== 'pasteleria'
}

function esPasteleria(producto: Producto): producto is ProductoPasteleria {
  return producto.tipo === 'pasteleria'
}

export function Menu() {
  const { estado, reintentar } = useMenu()

  switch (estado.tipo) {
    case 'cargando':
      return (
        <p role="status" className="text-muted my-4">
          Cargando menú…
        </p>
      )

    case 'error':
      return (
        <div role="alert" className="alert alert-danger my-4">
          <p>{estado.mensaje}</p>
          <button type="button" className="btn btn-outline-danger" onClick={reintentar}>
            Reintentar
          </button>
        </div>
      )

    case 'listo':
      return (
        <div className="row g-4 my-2">
          <div className="col-12 col-md-7">
            <SelectorCafe productos={estado.productos.filter(esCafe)} />
          </div>
          <div className="col-12 col-md-5">
            <Pasteleria productos={estado.productos.filter(esPasteleria)} />
          </div>
        </div>
      )
  }
}