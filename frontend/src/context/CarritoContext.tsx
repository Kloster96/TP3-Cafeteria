import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'
import {
  carritoReducer,
  estadoInicialCarrito,
  type AccionCarrito,
  type EstadoCarrito,
} from '../domain/carritoReducer'

interface ContextoCarrito {
  estado: EstadoCarrito
  dispatch: Dispatch<AccionCarrito>
}

const CarritoContext = createContext<ContextoCarrito | null>(null)

interface CarritoProviderProps {
  children: ReactNode
}

// Cada ítem conserva productoId, nombre, precio y cantidad. Las acciones
// disponibles son agregar, sumar, restar, quitar y vaciar el carrito.
export function CarritoProvider({ children }: CarritoProviderProps) {
  const [estado, dispatch] = useReducer(carritoReducer, estadoInicialCarrito)

  return (
    <CarritoContext.Provider value={{ estado, dispatch }}>
      {children}
    </CarritoContext.Provider>
  )
}

// El hook se mantiene junto al Provider para exponer una única API del contexto.
// eslint-disable-next-line react-refresh/only-export-components
export function useCarrito(): ContextoCarrito {
  const contexto = useContext(CarritoContext)

  if (!contexto) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider')
  }

  return contexto
}
