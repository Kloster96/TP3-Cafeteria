interface EncabezadoProps {
  mesa: number | null
}

export function Encabezado({ mesa }: EncabezadoProps) {
  return (
    <header className="d-flex flex-wrap align-items-center justify-content-between gap-2 py-3 border-bottom">
      <h1 className="h3 m-0 text-primary">Cafetería Origen</h1>
      <span className="badge bg-secondary fs-6">
        {mesa === null ? 'Retiro en barra' : `Mesa ${mesa}`}
      </span>
    </header>
  )
}