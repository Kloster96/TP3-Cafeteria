import type { Cafe, Pedido, Producto } from '../api/schemas'

// Copia fiel del catálogo de la API (mismos ids, precios y descripciones).
// Si la API cambia, se actualiza acá; los tests nunca le pegan a la API real.

const DESCRIPCIONES = {
  Brasil: 'Acidez baja, cuerpo intenso y notas de chocolate y frutos secos',
  Colombia: 'Acidez media, cuerpo equilibrado y notas cítricas y florales',
  Etiopía: 'Acidez alta, cuerpo ligero y notas frutales y de jazmín',
} as const

type Origen = keyof typeof DESCRIPCIONES

function cafe(
  id: number,
  tipo: Cafe['tipo'],
  tamanio: string,
  origen: Origen,
  precio: number,
): Cafe {
  return {
    id,
    tipo,
    nombre: tipo === 'expreso' ? 'Expreso' : 'Filtrado',
    precio,
    tamanio,
    variedad: { nombre: origen, descripcion: DESCRIPCIONES[origen] },
  }
}

export const productos: Producto[] = [
  cafe(1, 'expreso', 'Pocillo', 'Brasil', 5020),
  cafe(2, 'filtrado', 'Pocillo', 'Brasil', 4040),
  cafe(3, 'expreso', 'Pocillo', 'Colombia', 5740),
  cafe(4, 'filtrado', 'Pocillo', 'Colombia', 4280),
  cafe(5, 'expreso', 'Pocillo', 'Etiopía', 6820),
  cafe(6, 'filtrado', 'Pocillo', 'Etiopía', 4640),
  cafe(7, 'expreso', 'Mediano', 'Brasil', 6280),
  cafe(8, 'filtrado', 'Mediano', 'Brasil', 5300),
  cafe(9, 'expreso', 'Mediano', 'Colombia', 7360),
  cafe(10, 'filtrado', 'Mediano', 'Colombia', 5900),
  cafe(11, 'expreso', 'Mediano', 'Etiopía', 8980),
  cafe(12, 'filtrado', 'Mediano', 'Etiopía', 6800),
  cafe(13, 'expreso', 'Taza grande', 'Brasil', 7540),
  cafe(14, 'filtrado', 'Taza grande', 'Brasil', 6700),
  cafe(15, 'expreso', 'Taza grande', 'Colombia', 8980),
  cafe(16, 'filtrado', 'Taza grande', 'Colombia', 7700),
  cafe(17, 'expreso', 'Taza grande', 'Etiopía', 11140),
  cafe(18, 'filtrado', 'Taza grande', 'Etiopía', 9200),
  { id: 19, tipo: 'pasteleria', nombre: 'Muffin de chocolate', precio: 2500 },
  { id: 20, tipo: 'pasteleria', nombre: 'Torta selva negra', precio: 4200 },
]

// Pedido de ejemplo del plan: 2 × id 9 + 1 × id 19, mesa 4.
export const pedidoDeEjemplo: Pedido = {
  id: 1,
  mesaId: 4,
  estado: 'pendiente',
  items: [
    { productoId: 9, cantidad: 2 },
    { productoId: 19, cantidad: 1 },
  ],
  total: 17220,
}