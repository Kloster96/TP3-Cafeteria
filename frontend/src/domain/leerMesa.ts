const MESA_MINIMA = 1
const MESA_MAXIMA = 12 

export function leerMesa(search: string): number | null {
  const valor = new URLSearchParams(search).get('mesa')

  if (valor === null || !/^\d+$/.test(valor)) {
    return null
  }

  const mesa = Number(valor)
  return mesa >= MESA_MINIMA && mesa <= MESA_MAXIMA ? mesa : null
}