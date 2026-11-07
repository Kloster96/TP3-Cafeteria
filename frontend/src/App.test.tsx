import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { CarritoProvider } from './context/CarritoContext'
import App from './App'

function renderApp() {
  return render(
    <CarritoProvider>
      <App />
    </CarritoProvider>,
  )
}

describe('App', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('muestra el encabezado "Cafetería Origen"', () => {
    renderApp()

    expect(
      screen.getByRole('heading', { name: 'Cafetería Origen' }),
    ).toBeInTheDocument()
  })

  it('lee la mesa de la URL del QR', () => {
    window.history.pushState({}, '', '/?mesa=4')

    renderApp()

    expect(screen.getByText('Mesa 4')).toBeInTheDocument()
  })

  it('sin mesa en la URL muestra "Retiro en barra"', () => {
    renderApp()

    expect(screen.getByText('Retiro en barra')).toBeInTheDocument()
  })

  it('carga el menú desde la API', async () => {
    renderApp()

    expect(await screen.findByText('Muffin de chocolate')).toBeInTheDocument()
  })
})
