import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('muestra el encabezado "Cafetería Origen"', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Cafetería Origen' }),
    ).toBeInTheDocument()
  })

  it('lee la mesa de la URL del QR', () => {
    window.history.pushState({}, '', '/?mesa=4')

    render(<App />)

    expect(screen.getByText('Mesa 4')).toBeInTheDocument()
  })

  it('sin mesa en la URL muestra "Retiro en barra"', () => {
    render(<App />)

    expect(screen.getByText('Retiro en barra')).toBeInTheDocument()
  })
})