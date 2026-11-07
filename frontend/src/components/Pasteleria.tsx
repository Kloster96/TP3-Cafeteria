import { useId } from 'react'
import type { ProductoPasteleria } from '../api/schemas'
import { useCarrito } from '../context/CarritoContext'
import { formatoPrecio } from '../domain/formatoPrecio'

interface PasteleriaProps {
  productos: ProductoPasteleria[]
}

export function Pasteleria({ productos }: PasteleriaProps) {
  const id = useId()
  const { dispatch } = useCarrito()

  return (
    <section aria-labelledby={`${id}-titulo`} className="card h-100">
      <div className="card-body">
        <h2 id={`${id}-titulo`} className="h4 card-title">
          Pastelería
        </h2>
        <ul className="list-unstyled d-grid gap-3 mb-0">
          {productos.map((producto) => (
            <li key={producto.id} className="border rounded p-3">
              <div className="d-flex justify-content-between gap-2 mb-3">
                <span className="fw-semibold">{producto.nombre}</span>
                <span>{formatoPrecio(producto.precio)}</span>
              </div>
              <button
                type="button"
                className="btn btn-outline-primary w-100"
                onClick={() => dispatch({ tipo: 'agregar', producto })}
              >
                Agregar {producto.nombre}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
