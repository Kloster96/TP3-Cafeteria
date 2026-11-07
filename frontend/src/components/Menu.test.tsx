import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { productos } from '../mocks/datos'
import { server } from '../mocks/server'
import { Menu } from './Menu'

describe('Menu', () => {
  it('mientras carga muestra "Cargando menú…"', async () => {
    render(<Menu />)

    expect(screen.getByRole('status')).toHaveTextContent('Cargando menú…')
    await screen.findByText('Muffin de chocolate')
  })

  it('cuando la API responde muestra los productos', async () => {
    render(<Menu />)

    expect(await screen.findByText('Muffin de chocolate')).toBeInTheDocument()
    expect(screen.getByText('Torta selva negra')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Café' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Pastelería' })).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('con 500 muestra el mensaje de la API y al reintentar carga el menú', async () => {
    server.use(
      http.get('/api/productos', () =>
        HttpResponse.json({ error: 'Error interno del servidor' }, { status: 500 }),
      ),
    )
    const usuario = userEvent.setup()
    render(<Menu />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Error interno del servidor')

    server.use(http.get('/api/productos', () => HttpResponse.json(productos)))
    await usuario.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(await screen.findByText('Muffin de chocolate')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('con la API caída muestra un mensaje claro y el botón "Reintentar"', async () => {
    server.use(http.get('/api/productos', () => HttpResponse.error()))
    render(<Menu />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se pudo conectar con la cafetería',
    )
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument()
  })

  it('si la respuesta no cumple el contrato muestra un error', async () => {
    server.use(
      http.get('/api/productos', () => HttpResponse.json([{ id: 19, precio: '2500' }])),
    )
    render(<Menu />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Respuesta inválida de la API')
    expect(screen.queryByText('Muffin de chocolate')).not.toBeInTheDocument()
  })
})