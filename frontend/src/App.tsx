import { Carrito } from './components/Carrito'
import { Encabezado } from './components/Encabezado'
import { Menu } from './components/Menu'
import { leerMesa } from './domain/leerMesa'

// Punto de integración para la Etapa 4: acá se conectará client.crearPedido.
const confirmarPedido = () => undefined

function App() {
  const mesa = leerMesa(window.location.search)

  return (
    <main className="container py-4">
      <Encabezado mesa={mesa} />
      <Menu />
      <Carrito onConfirmar={confirmarPedido} />
    </main>
  )
}

export default App
