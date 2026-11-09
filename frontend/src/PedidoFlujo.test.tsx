import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it } from 'vitest'
import type { Pedido } from './api/schemas'
import { CarritoProvider } from './context/CarritoContext'
import { server } from './mocks/server'
import App from './App'

const pedidoCreado: Pedido = {
  id: 1,
  mesaId: 4,
  estado: 'pendiente',
  items: [
    { productoId: 9, cantidad: 2 },
    { productoId: 19, cantidad: 1 },
  ],
  total: 17220,
}

function renderApp() {
  return render(
    <CarritoProvider>
      <App />
    </CarritoProvider>,
  )
}

async function armarPedido(usuario: ReturnType<typeof userEvent.setup>) {
  await usuario.click(await screen.findByRole('radio', { name: 'Expreso' }))
  await usuario.click(screen.getByRole('radio', { name: 'Mediano' }))
  await usuario.click(screen.getByRole('radio', { name: 'Colombia' }))
  await usuario.click(screen.getByRole('button', { name: 'Agregar café' }))
  await usuario.click(screen.getByRole('button', { name: 'Agregar café' }))
  await usuario.click(
    screen.getByRole('button', { name: 'Agregar Muffin de chocolate' }),
  )
}

describe('Flujo de confirmación del pedido', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('envía la mesa y los ítems del carrito al confirmar', async () => {
    let cuerpoRecibido: unknown
    server.use(
      http.post('/api/pedidos', async ({ request }) => {
        cuerpoRecibido = await request.json()
        return HttpResponse.json(pedidoCreado, { status: 201 })
      }),
    )
    window.history.pushState({}, '', '/?mesa=4')
    const usuario = userEvent.setup()
    renderApp()

    await armarPedido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    await waitFor(() =>
      expect(cuerpoRecibido).toEqual({
        mesaId: 4,
        items: [
          { productoId: 9, cantidad: 2 },
          { productoId: 19, cantidad: 1 },
        ],
      }),
    )
  })

  it('envía el pedido sin mesaId cuando no hay mesa en la URL', async () => {
    let cuerpoRecibido: unknown
    server.use(
      http.post('/api/pedidos', async ({ request }) => {
        cuerpoRecibido = await request.json()
        return HttpResponse.json(
          { ...pedidoCreado, mesaId: null },
          { status: 201 },
        )
      }),
    )
    const usuario = userEvent.setup()
    renderApp()

    await armarPedido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    await waitFor(() => expect(cuerpoRecibido).not.toBeUndefined())
    expect(cuerpoRecibido).toEqual({
      items: [
        { productoId: 9, cantidad: 2 },
        { productoId: 19, cantidad: 1 },
      ],
    })
    expect(cuerpoRecibido).not.toHaveProperty('mesaId')
  })

  it('muestra el pedido confirmado y vacía el carrito', async () => {
    window.history.pushState({}, '', '/?mesa=4')
    const usuario = userEvent.setup()
    renderApp()

    await armarPedido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(await screen.findByText('Pedido #1')).toBeInTheDocument()
    expect(screen.getByText('pendiente')).toBeInTheDocument()
    expect(screen.getByText('$17.220')).toBeInTheDocument()
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
  })
})
