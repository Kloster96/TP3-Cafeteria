import { describe, expect, it } from 'vitest'
import { leerMesa } from './leerMesa'

describe('leerMesa', () => {
  it('lee la mesa del query string del QR', () => {
    expect(leerMesa('?mesa=4')).toBe(4)
  })

  it('acepta los extremos 1 y 12', () => {
    expect(leerMesa('?mesa=1')).toBe(1)
    expect(leerMesa('?mesa=12')).toBe(12)
  })

  it.each(['', '?mesa=abc', '?mesa=0', '?mesa=-1', '?mesa=2.5', '?mesa=13', '?mesa='])(
    'con "%s" devuelve null (retiro en barra)',
    (search) => {
      expect(leerMesa(search)).toBeNull()
    },
  )
})