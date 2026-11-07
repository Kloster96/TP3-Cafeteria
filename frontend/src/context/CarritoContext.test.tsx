import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useCarrito } from './CarritoContext'

function ConsumidorSinProvider() {
  useCarrito()
  return null
}

describe('useCarrito', () => {
  it('fuera del CarritoProvider lanza un error claro', () => {
    expect(() => render(<ConsumidorSinProvider />)).toThrowError(
      'useCarrito debe usarse dentro de CarritoProvider',
    )
  })
})
