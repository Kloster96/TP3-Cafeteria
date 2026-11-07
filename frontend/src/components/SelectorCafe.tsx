import { useId, useState } from 'react'
import type { Cafe } from '../api/schemas'
import { useCarrito } from '../context/CarritoContext'
import { buscarCafe } from '../domain/buscarCafe'
import { formatoPrecio } from '../domain/formatoPrecio'

interface SelectorCafeProps {
  productos: Cafe[]
}

export function SelectorCafe({ productos }: SelectorCafeProps) {
  const id = useId()
  const { dispatch } = useCarrito()
  const [bebida, setBebida] = useState<Cafe['tipo']>()
  const [tamanio, setTamanio] = useState<string>()
  const [origen, setOrigen] = useState<string>()

  const bebidas = Array.from(new Set(productos.map((producto) => producto.tipo)))
  const tamanios = Array.from(
    new Set(productos.map((producto) => producto.tamanio)),
  )
  const origenes = Array.from(
    new Map(
      productos.map((producto) => [
        producto.variedad.nombre,
        producto.variedad,
      ]),
    ).values(),
  )
  const cafeSeleccionado = buscarCafe(productos, { bebida, tamanio, origen })

  function agregarCafe() {
    if (!cafeSeleccionado) return
    dispatch({ tipo: 'agregar', producto: cafeSeleccionado })
  }

  return (
    <section aria-labelledby={`${id}-titulo`} className="card h-100">
      <div className="card-body">
        <h2 id={`${id}-titulo`} className="h4 card-title">
          Café
        </h2>

        <fieldset
          role="radiogroup"
          aria-labelledby={`${id}-bebida`}
          className="border-0 p-0 mb-3"
        >
          <legend id={`${id}-bebida`} className="h6">
            Bebida
          </legend>
          {bebidas.map((opcion) => {
            const opcionId = `${id}-bebida-${opcion}`
            const etiqueta = opcion === 'expreso' ? 'Expreso' : 'Filtrado'

            return (
              <div key={opcion} className="form-check form-check-inline">
                <input
                  id={opcionId}
                  className="form-check-input"
                  type="radio"
                  name={`${id}-bebida`}
                  value={opcion}
                  checked={bebida === opcion}
                  onChange={() => setBebida(opcion)}
                />
                <label className="form-check-label" htmlFor={opcionId}>
                  {etiqueta}
                </label>
              </div>
            )
          })}
        </fieldset>

        <fieldset
          role="radiogroup"
          aria-labelledby={`${id}-tamanio`}
          className="border-0 p-0 mb-3"
        >
          <legend id={`${id}-tamanio`} className="h6">
            Tamaño
          </legend>
          {tamanios.map((opcion) => {
            const opcionId = `${id}-tamanio-${opcion}`

            return (
              <div key={opcion} className="form-check">
                <input
                  id={opcionId}
                  className="form-check-input"
                  type="radio"
                  name={`${id}-tamanio`}
                  value={opcion}
                  checked={tamanio === opcion}
                  onChange={() => setTamanio(opcion)}
                />
                <label className="form-check-label" htmlFor={opcionId}>
                  {opcion}
                </label>
              </div>
            )
          })}
        </fieldset>

        <fieldset
          role="radiogroup"
          aria-labelledby={`${id}-origen`}
          className="border-0 p-0 mb-3"
        >
          <legend id={`${id}-origen`} className="h6">
            Origen
          </legend>
          <div className="d-grid gap-2">
            {origenes.map((opcion) => {
              const opcionId = `${id}-origen-${opcion.nombre}`
              const descripcionId = `${opcionId}-descripcion`
              const productoDelOrigen =
                bebida && tamanio
                  ? buscarCafe(productos, {
                      bebida,
                      tamanio,
                      origen: opcion.nombre,
                    })
                  : undefined

              return (
                <div key={opcion.nombre} className="border rounded p-2">
                  <div className="form-check">
                    <input
                      id={opcionId}
                      className="form-check-input"
                      type="radio"
                      name={`${id}-origen`}
                      value={opcion.nombre}
                      checked={origen === opcion.nombre}
                      aria-describedby={descripcionId}
                      onChange={() => setOrigen(opcion.nombre)}
                    />
                    <label
                      className="form-check-label fw-semibold"
                      htmlFor={opcionId}
                    >
                      {opcion.nombre}
                    </label>
                    {productoDelOrigen && (
                      <span className="float-end fw-semibold">
                        {formatoPrecio(productoDelOrigen.precio)}
                      </span>
                    )}
                  </div>
                  <p id={descripcionId} className="small text-muted mb-0">
                    {opcion.descripcion}
                  </p>
                </div>
              )
            })}
          </div>
        </fieldset>

        <button
          type="button"
          className="btn btn-primary w-100"
          disabled={!cafeSeleccionado}
          onClick={agregarCafe}
        >
          Agregar café
        </button>
      </div>
    </section>
  )
}
