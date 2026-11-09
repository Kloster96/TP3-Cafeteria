import { useState } from 'react'
import { crearPedido } from './api/client'
import type { Pedido } from './api/schemas'
import { Carrito } from './components/Carrito'
import { Confirmacion } from './components/Confirmacion'
import { Encabezado } from './components/Encabezado'
import { Menu } from './components/Menu'
import { useCarrito } from './context/CarritoContext'
import { leerMesa } from './domain/leerMesa'

function App() {
  const mesa = leerMesa(window.location.search)
  const { estado, dispatch } = useCarrito()
  const [pedido, setPedido] = useState<Pedido>()

  async function confirmarPedido() {
    const creado = await crearPedido({
      ...(mesa !== null && { mesaId: mesa }),
      items: estado.items.map(({ productoId, cantidad }) => ({
        productoId,
        cantidad,
      })),
    })

    dispatch({ tipo: 'vaciar' })
    setPedido(creado)
  }

  return (
    <main className="container py-4">
      <Encabezado mesa={mesa} />
      <Menu />
      <Carrito onConfirmar={() => void confirmarPedido()} />
      {pedido && <Confirmacion pedido={pedido} />}
    </main>
  )
}

export default App
