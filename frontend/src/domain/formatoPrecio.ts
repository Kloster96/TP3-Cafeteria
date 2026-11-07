// Formatea un precio entero de la API en pesos: 7360 → "$7.360".

const formato = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 })

export function formatoPrecio(precio: number): string {
  return `$${formato.format(precio)}`
}