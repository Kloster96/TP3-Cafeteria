import { useState } from 'react'
import { ApiError, crearPedido } from './api/client'
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
  const [error, setError] = useState<string>()

  async function confirmarPedido() {
    try {
      const creado = await crearPedido({
        ...(mesa !== null && { mesaId: mesa }),
        items: estado.items.map(({ productoId, cantidad }) => ({
          productoId,
          cantidad,
        })),
      })

      dispatch({ tipo: 'vaciar' })
      setPedido(creado)
    } catch (e) {
      if (!(e instanceof ApiError)) throw e
      setError(e.message)
    }
  }

  return (
    <main className="container py-4">
      <Encabezado mesa={mesa} />
      <Menu />
      <Carrito onConfirmar={() => void confirmarPedido()} />
      {error && (
        <div role="alert" className="alert alert-danger mt-3">
          {error}
        </div>
      )}
      {pedido && <Confirmacion pedido={pedido} />}
    </main>
  )
}

export default App
