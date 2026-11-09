import { crearPedido } from './api/client'
import { Carrito } from './components/Carrito'
import { Encabezado } from './components/Encabezado'
import { Menu } from './components/Menu'
import { useCarrito } from './context/CarritoContext'
import { leerMesa } from './domain/leerMesa'

function App() {
  const mesa = leerMesa(window.location.search)
  const { estado } = useCarrito()

  function confirmarPedido() {
    void crearPedido({
      mesaId: mesa,
      items: estado.items.map(({ productoId, cantidad }) => ({
        productoId,
        cantidad,
      })),
    })
  }

  return (
    <main className="container py-4">
      <Encabezado mesa={mesa} />
      <Menu />
      <Carrito onConfirmar={confirmarPedido} />
    </main>
  )
}

export default App
