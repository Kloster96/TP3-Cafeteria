import { Encabezado } from './components/Encabezado'
import { leerMesa } from './domain/leerMesa'

function App() {
  const mesa = leerMesa(window.location.search)

  return (
    <main className="container py-4">
      <Encabezado mesa={mesa} />
    </main>
  )
}

export default App