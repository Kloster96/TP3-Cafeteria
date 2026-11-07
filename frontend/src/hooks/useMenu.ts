import { useEffect, useState } from 'react'
import { ApiError, getProductos } from '../api/client'
import type { Producto } from '../api/schemas'

export type EstadoMenu =
  | { tipo: 'cargando' }
  | { tipo: 'error'; mensaje: string }
  | { tipo: 'listo'; productos: Producto[] }

export function useMenu() {
  const [estado, setEstado] = useState<EstadoMenu>({ tipo: 'cargando' })
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let vigente = true

    getProductos()
      .then((productos) => {
        if (vigente) setEstado({ tipo: 'listo', productos })
      })
      .catch((error: unknown) => {
        if (!vigente) return
        const mensaje =
          error instanceof ApiError ? error.message : 'Ocurrió un error inesperado'
        setEstado({ tipo: 'error', mensaje })
      })

    return () => {
      vigente = false
    }
  }, [intento])

  function reintentar() {
    setEstado({ tipo: 'cargando' })
    setIntento((n) => n + 1)
  }

  return { estado, reintentar }
}