import type { ProductoPasteleria } from '../api/schemas'

interface PasteleriaProps {
  productos: ProductoPasteleria[]
}

// Lugar reservado: lo completa el Integrante 3,
// con precios y botones "Agregar …". Por ahora solo lista los nombres.
export function Pasteleria({ productos }: PasteleriaProps) {
  return (
    <section aria-labelledby="titulo-pasteleria">
      <h2 id="titulo-pasteleria" className="h4">Pastelería</h2>
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>{producto.nombre}</li>
        ))}
      </ul>
    </section>
  )
}