import { useId } from 'react'
import { useCarrito } from '../context/CarritoContext'
import { subtotalCarrito } from '../domain/carritoReducer'
import { formatoPrecio } from '../domain/formatoPrecio'

interface CarritoProps {
  onConfirmar: () => void
}

export function Carrito({ onConfirmar }: CarritoProps) {
  const id = useId()
  const { estado, dispatch } = useCarrito()
  const estaVacio = estado.items.length === 0

  return (
    <section aria-labelledby={`${id}-titulo`} className="card mt-4">
      <div className="card-body">
        <h2 id={`${id}-titulo`} className="h4 card-title">
          Carrito
        </h2>

        {estaVacio ? (
          <p className="text-muted">Tu carrito está vacío</p>
        ) : (
          <>
            <ul className="list-group list-group-flush mb-3">
              {estado.items.map((item) => (
                <li key={item.productoId} className="list-group-item px-0">
                  <div className="d-flex justify-content-between gap-3 mb-2">
                    <span className="fw-semibold">{item.nombre}</span>
                    <span aria-label={`Subtotal de ${item.nombre}`}>
                      {formatoPrecio(item.precio * item.cantidad)}
                    </span>
                  </div>
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      aria-label={`Restar uno a ${item.nombre}`}
                      onClick={() =>
                        dispatch({ tipo: 'restar', productoId: item.productoId })
                      }
                    >
                      −
                    </button>
                    <span
                      className="px-1"
                      aria-label={`Cantidad de ${item.nombre}`}
                    >
                      {item.cantidad}
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      aria-label={`Sumar uno a ${item.nombre}`}
                      onClick={() =>
                        dispatch({ tipo: 'sumar', productoId: item.productoId })
                      }
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger ms-auto"
                      aria-label={`Quitar ${item.nombre}`}
                      onClick={() =>
                        dispatch({ tipo: 'quitar', productoId: item.productoId })
                      }
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <span>Subtotal orientativo</span>
              <output aria-label="Subtotal orientativo" className="fw-bold">
                {formatoPrecio(subtotalCarrito(estado))}
              </output>
            </div>
          </>
        )}

        <button
          type="button"
          className="btn btn-success w-100"
          disabled={estaVacio}
          onClick={onConfirmar}
        >
          Confirmar pedido
        </button>
      </div>
    </section>
  )
}
