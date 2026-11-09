import { getPedido } from '../api/client'
import type { Pedido } from '../api/schemas'
import { formatoPrecio } from '../domain/formatoPrecio'

interface ConfirmacionProps {
  pedido: Pedido
}

export function Confirmacion({ pedido }: ConfirmacionProps) {
  return (
    <section aria-labelledby="confirmacion-titulo" className="card mt-4">
      <div className="card-body">
        <h2 id="confirmacion-titulo" className="h4 card-title">
          Pedido confirmado
        </h2>
        <p className="fw-semibold mb-1">Pedido #{pedido.id}</p>
        <p className="mb-1">
          Estado: <span>{pedido.estado}</span>
        </p>
        <p className="mb-3">
          Total: <span>{formatoPrecio(pedido.total)}</span>
        </p>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => void getPedido(pedido.id)}
        >
          Actualizar estado
        </button>
      </div>
    </section>
  )
}
