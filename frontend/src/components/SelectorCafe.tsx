import type { Cafe } from '../api/schemas'

interface SelectorCafeProps {
  productos: Cafe[]
}

// Lugar reservado: lo completa el Integrante 3.
export function SelectorCafe({ productos }: SelectorCafeProps) {
  return (
    <section aria-labelledby="titulo-cafe">
      <h2 id="titulo-cafe" className="h4">Café</h2>
      <p className="text-muted">{productos.length} opciones de café</p>
    </section>
  )
}