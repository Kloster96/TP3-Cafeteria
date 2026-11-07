import { describe, expect, it } from 'vitest'
import { formatoPrecio } from './formatoPrecio'

describe('formatoPrecio', () => {
  it.each([
    [7360, '$7.360'],
    [17220, '$17.220'],
    [0, '$0'],
    [2500, '$2.500'],
  ])('%i → %s', (precio, esperado) => {
    expect(formatoPrecio(precio)).toBe(esperado)
  })
})