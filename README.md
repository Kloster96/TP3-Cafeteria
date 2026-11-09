# Cafetería Origen

API REST desarrollada con TypeScript y Express para administrar el catálogo, los pedidos y los reportes de una cafetería. El proyecto usa Vitest y Supertest para las pruebas unitarias y de integración.

## Requisitos

- Node.js 22.12 o superior. Las pruebas de la API lo exigen; el front por sí solo también funciona con Node 20.19 o superior.
- npm.

## Instalación y ejecución

El proyecto tiene dos partes: la API, en la raíz del repositorio, y el front, en `frontend/`. Para usar la aplicación hay que levantar las dos, cada una en su terminal.

### API

```bash
npm ci
npm start
```

El servidor queda disponible en `http://localhost:3000`. Se puede cambiar el puerto con la variable de entorno `PORT`.

Para los tests E2E, la API se levanta en modo test con `npm run start:test` (ver "Modo test para los E2E").

### Front

```bash
cd frontend
npm ci
npm run dev
```

La aplicación queda en `http://localhost:5173`. La mesa se toma del parámetro `mesa` de la URL, como llega desde el QR de cada mesa: `http://localhost:5173/?mesa=4`. Sin ese parámetro, el pedido es para retirar en la barra.

El front llama a la API a través de `/api`. En desarrollo, Vite redirige esas llamadas a `http://localhost:3000`, por lo que la API tiene que estar corriendo.

## Endpoints

### Productos

- `GET /productos`: lista los 20 productos del catálogo.
- `GET /productos/:id`: devuelve un producto o responde `404` con `{ "error": "..." }`.

Cada producto trae su `precio` final, ya calculado por la API, y un `tipo` (`expreso`, `filtrado` o `pasteleria`) para distinguirlos sin leer el nombre. Los cafés agregan `tamanio` y `variedad` con su descripción.

Café:

```json
{
  "id": 9,
  "tipo": "expreso",
  "nombre": "Expreso",
  "precio": 7360,
  "tamanio": "Mediano",
  "variedad": {
    "nombre": "Colombia",
    "descripcion": "Acidez media, cuerpo equilibrado y notas cítricas y florales"
  }
}
```

Pastelería:

```json
{ "id": 19, "tipo": "pasteleria", "nombre": "Muffin de chocolate", "precio": 2500 }
```

Ids del catálogo:

| id | Tipo | Tamaño | Variedad | Precio |
|---|---|---|---|---|
| 1 | expreso | Pocillo | Brasil | 5020 |
| 2 | filtrado | Pocillo | Brasil | 4040 |
| 3 | expreso | Pocillo | Colombia | 5740 |
| 4 | filtrado | Pocillo | Colombia | 4280 |
| 5 | expreso | Pocillo | Etiopía | 6820 |
| 6 | filtrado | Pocillo | Etiopía | 4640 |
| 7 | expreso | Mediano | Brasil | 6280 |
| 8 | filtrado | Mediano | Brasil | 5300 |
| 9 | expreso | Mediano | Colombia | 7360 |
| 10 | filtrado | Mediano | Colombia | 5900 |
| 11 | expreso | Mediano | Etiopía | 8980 |
| 12 | filtrado | Mediano | Etiopía | 6800 |
| 13 | expreso | Taza grande | Brasil | 7540 |
| 14 | filtrado | Taza grande | Brasil | 6700 |
| 15 | expreso | Taza grande | Colombia | 8980 |
| 16 | filtrado | Taza grande | Colombia | 7700 |
| 17 | expreso | Taza grande | Etiopía | 11140 |
| 18 | filtrado | Taza grande | Etiopía | 9200 |
| 19 | pasteleria | | Muffin de chocolate | 2500 |
| 20 | pasteleria | | Torta selva negra | 4200 |

Los ids difieren del ejemplo del enunciado (ahí el Expreso Mediano Colombia es el 5); los precios coinciden. El front busca cada café por `tipo`, `tamanio` y `variedad.nombre`, nunca por id.

### Pedidos

- `POST /pedidos`: crea un pedido y responde `201`.
- `GET /pedidos`: lista todos los pedidos.
- `GET /pedidos/:id`: devuelve un pedido o responde `404`.

Cuerpo de `POST /pedidos` para la mesa 4, con dos Expreso Mediano Colombia y un Muffin:

```json
{
  "mesaId": 4,
  "items": [
    { "productoId": 9, "cantidad": 2 },
    { "productoId": 19, "cantidad": 1 }
  ]
}
```

Respuesta `201` (la misma forma devuelven `GET /pedidos` y `GET /pedidos/:id`):

```json
{
  "id": 1,
  "mesaId": 4,
  "estado": "pendiente",
  "items": [
    { "productoId": 9, "cantidad": 2 },
    { "productoId": 19, "cantidad": 1 }
  ],
  "total": 17220
}
```

Reglas:

- `mesaId` es opcional. Las mesas válidas van de 1 a 12. Sin `mesaId`, o con `null`, el pedido es para retirar en la barra y se devuelve `"mesaId": null`.
- Cada item necesita un `productoId` existente y una `cantidad` entera positiva.
- El `total` lo calcula la API a partir de los precios del catálogo; el front no lo recalcula.

### Reportes

- `GET /reportes/facturacion`: devuelve `{ "facturacionTotal": número }`.
- `GET /reportes/mas-vendido`: devuelve el producto más vendido, todos los empatados o `null` si todavía no hay ventas.

El conteo de ventas se agrupa por el nombre del producto. Los cafés se agrupan por máquina (`Expreso` o `Filtrado`) y los productos de pastelería por su nombre individual.

## Manejo de errores

Todas las respuestas de error tienen el mismo formato, y el front muestra el mensaje tal cual:

```json
{ "error": "Mesa inexistente: 99" }
```

| Código | Cuándo | Ejemplo de mensaje |
|---|---|---|
| 400 | Items vacíos, producto inexistente, cantidad no entera, mesa fuera de 1 a 12 o JSON mal formado | `Producto inexistente en el catálogo: 999` |
| 404 | Producto, pedido o ruta inexistente | `Pedido no encontrado: abc` |
| 500 | Error inesperado, sin exponer detalles internos | `Error interno del servidor` |

Una mesa o un producto inexistente nunca responde 500. Los errores se procesan en un middleware centralizado (`src/middlewares/errorHandler.ts`).

## Modo test para los E2E

```bash
npm run start:test
```

Levanta la API con `NODE_ENV=test` (usa `cross-env`, así funciona igual en Windows, Mac y Linux). Solo en este modo existen dos rutas para que cada E2E arranque con los mismos datos:

- `POST /__test__/reset`: borra todos los pedidos y reinicia los ids. Responde `204`.
- `POST /__test__/seed`: deja solo el pedido de ejemplo (mesa 4, dos id 9 y un id 19, total 17220). Responde `201`.

Fuera de `NODE_ENV=test`, las dos rutas responden `404`.

## Pruebas y TDD

Los tests unitarios prueban los modelos y servicios de forma aislada. Los tests de integración usan Supertest sobre la aplicación de Express sin levantar un puerto.

`pedidoService.reset()` se ejecuta en cada `beforeEach` de las pruebas que almacenan pedidos para evitar contaminación entre casos y reiniciar los ids.

El historial conserva el ciclo TDD completo: un commit `test:` con el test en rojo, un commit `feat:` con el código mínimo que lo pone en verde y, cuando hace falta, un commit `refactor:` que mejora el código sin cambiar el comportamiento (la suite sigue pasando igual). Los tests de `tests/integration/errores.test.ts` son de caracterización: documentan el formato de errores que la API ya cumplía, por eso no tienen un commit en rojo.

## Demo

El archivo `requests.http` contiene un recorrido completo: listar productos, crear pedidos, consultarlos y obtener ambos reportes. Se puede ejecutar con un cliente compatible con archivos HTTP mientras el servidor está iniciado con `npm start`.
