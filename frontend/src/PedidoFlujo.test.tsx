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

describe('Seguimiento del pedido', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('consulta el pedido por su número al actualizar el estado', async () => {
    const idsConsultados: string[] = []
    server.use(
      http.get('/api/pedidos/:id', ({ params }) => {
        idsConsultados.push(String(params.id))
        return HttpResponse.json(pedidoCreado)
      }),
    )
    window.history.pushState({}, '', '/?mesa=4')
    const usuario = userEvent.setup()
    renderApp()

    await armarPedido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }))
    await screen.findByText('Pedido #1')
    await usuario.click(
      screen.getByRole('button', { name: 'Actualizar estado' }),
    )

    await waitFor(() => expect(idsConsultados).toEqual(['1']))
  })

  it('muestra el estado que devuelve la API sin recargar la página', async () => {
    server.use(
      http.get('/api/pedidos/:id', () =>
        HttpResponse.json({ ...pedidoCreado, estado: 'listo' }),
      ),
    )
    window.history.pushState({}, '', '/?mesa=4')
    const usuario = userEvent.setup()
    renderApp()

    await armarPedido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }))
    await screen.findByText('Pedido #1')
    expect(screen.getByText('pendiente')).toBeInTheDocument()
    await usuario.click(
      screen.getByRole('button', { name: 'Actualizar estado' }),
    )

    expect(await screen.findByText('listo')).toBeInTheDocument()
    expect(screen.queryByText('pendiente')).not.toBeInTheDocument()
    expect(screen.getByText('Pedido #1')).toBeInTheDocument()
  })
})

describe('Errores al confirmar el pedido', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('muestra el mensaje de la API y conserva el carrito ante un 400', async () => {
    server.use(
      http.post('/api/pedidos', () =>
        HttpResponse.json({ error: 'Mesa inexistente: 99' }, { status: 400 }),
      ),
    )
    window.history.pushState({}, '', '/?mesa=4')
    const usuario = userEvent.setup()
    renderApp()

    await armarPedido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Mesa inexistente: 99',
    )
    expect(screen.queryByText('Tu carrito está vacío')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Cantidad de Expreso')).toHaveTextContent('2')
    expect(
      screen.getByLabelText('Cantidad de Muffin de chocolate'),
    ).toHaveTextContent('1')
  })
})

describe('Reintento tras un error del servidor', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('permite reintentar tras un 500 y confirma el pedido', async () => {
    server.use(
      http.post('/api/pedidos', () =>
        HttpResponse.json({ error: 'Error interno del servidor' }, { status: 500 }),
        { once: true },
      ),
    )
    window.history.pushState({}, '', '/?mesa=4')
    const usuario = userEvent.setup()
    renderApp()

    await armarPedido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Error interno del servidor',
    )
    expect(screen.getByLabelText('Cantidad de Expreso')).toHaveTextContent('2')

    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(await screen.findByText('Pedido #1')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
  })
})

describe('API caída al confirmar', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('avisa que no hay conexión y conserva el carrito', async () => {
    server.use(http.post('/api/pedidos', () => HttpResponse.error()))
    window.history.pushState({}, '', '/?mesa=4')
    const usuario = userEvent.setup()
    renderApp()

    await armarPedido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se pudo conectar con la cafetería',
    )
    expect(screen.getByLabelText('Cantidad de Expreso')).toHaveTextContent('2')
    expect(
      screen.getByLabelText('Cantidad de Muffin de chocolate'),
    ).toHaveTextContent('1')
  })
})

describe('Respuesta inválida al confirmar', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('muestra el error y conserva el carrito si la respuesta no cumple el contrato', async () => {
    server.use(
      http.post('/api/pedidos', () =>
        HttpResponse.json({ id: 'uno' }, { status: 201 }),
      ),
    )
    window.history.pushState({}, '', '/?mesa=4')
    const usuario = userEvent.setup()
    renderApp()

    await armarPedido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Respuesta inválida de la API',
    )
    expect(screen.getByLabelText('Cantidad de Expreso')).toHaveTextContent('2')
    expect(
      screen.getByLabelText('Cantidad de Muffin de chocolate'),
    ).toHaveTextContent('1')
  })
})

describe('Error al actualizar el estado', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('muestra el error y mantiene el último estado conocido', async () => {
    server.use(
      http.get('/api/pedidos/:id', () =>
        HttpResponse.json({ error: 'Error interno del servidor' }, { status: 500 }),
      ),
    )
    window.history.pushState({}, '', '/?mesa=4')
    const usuario = userEvent.setup()
    renderApp()

    await armarPedido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }))
    await screen.findByText('Pedido #1')
    await usuario.click(
      screen.getByRole('button', { name: 'Actualizar estado' }),
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Error interno del servidor',
    )
    expect(screen.getByText('Pedido #1')).toBeInTheDocument()
    expect(screen.getByText('pendiente')).toBeInTheDocument()
    expect(screen.getByText('$17.220')).toBeInTheDocument()
  })
})
