import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CarritoProvider, useCarrito } from '../context/CarritoContext'
import { Carrito } from './Carrito'

const expresoColombia = {
  id: 9,
  nombre: 'Expreso',
  precio: 7360,
}

const muffin = {
  id: 19,
  nombre: 'Muffin de chocolate',
  precio: 2500,
}

function ControlesDePrueba() {
  const { dispatch } = useCarrito()

  return (
    <div>
      <button
        type="button"
        onClick={() => dispatch({ tipo: 'agregar', producto: expresoColombia })}
      >
        Agregar café de prueba
      </button>
      <button
        type="button"
        onClick={() => dispatch({ tipo: 'agregar', producto: muffin })}
      >
        Agregar muffin de prueba
      </button>
    </div>
  )
}

function renderCarrito(onConfirmar = vi.fn()) {
  return {
    onConfirmar,
    ...render(
      <CarritoProvider>
        <ControlesDePrueba />
        <Carrito onConfirmar={onConfirmar} />
      </CarritoProvider>,
    ),
  }
}

describe('Carrito', () => {
  it('vacío informa su estado y deshabilita Confirmar pedido', () => {
    renderCarrito()

    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Confirmar pedido' }),
    ).toBeDisabled()
  })

  it('muestra nombre, cantidad, subtotal por ítem y subtotal orientativo', async () => {
    const user = userEvent.setup()
    renderCarrito()

    await user.click(
      screen.getByRole('button', { name: 'Agregar café de prueba' }),
    )
    await user.click(
      screen.getByRole('button', { name: 'Agregar café de prueba' }),
    )
    await user.click(
      screen.getByRole('button', { name: 'Agregar muffin de prueba' }),
    )

    expect(screen.getByText('Expreso')).toBeInTheDocument()
    expect(screen.getByLabelText('Cantidad de Expreso')).toHaveTextContent('2')
    expect(screen.getByLabelText('Subtotal de Expreso')).toHaveTextContent(
      '$14.720',
    )
    expect(screen.getByText('Muffin de chocolate')).toBeInTheDocument()
    expect(
      screen.getByLabelText('Cantidad de Muffin de chocolate'),
    ).toHaveTextContent('1')
    expect(
      screen.getByLabelText('Subtotal de Muffin de chocolate'),
    ).toHaveTextContent('$2.500')
    expect(screen.getByText('Subtotal orientativo')).toBeInTheDocument()
    expect(screen.getByLabelText('Subtotal orientativo')).toHaveTextContent(
      '$17.220',
    )
  })

  it('permite sumar, restar y quitar con controles accesibles', async () => {
    const user = userEvent.setup()
    renderCarrito()
    await user.click(
      screen.getByRole('button', { name: 'Agregar café de prueba' }),
    )

    await user.click(screen.getByRole('button', { name: 'Sumar uno a Expreso' }))
    expect(screen.getByLabelText('Cantidad de Expreso')).toHaveTextContent('2')

    await user.click(screen.getByRole('button', { name: 'Restar uno a Expreso' }))
    expect(screen.getByLabelText('Cantidad de Expreso')).toHaveTextContent('1')

    await user.click(screen.getByRole('button', { name: 'Quitar Expreso' }))
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
  })

  it('con ítems habilita Confirmar pedido y llama a onConfirmar', async () => {
    const user = userEvent.setup()
    const onConfirmar = vi.fn()
    renderCarrito(onConfirmar)
    await user.click(
      screen.getByRole('button', { name: 'Agregar café de prueba' }),
    )
    const confirmar = screen.getByRole('button', { name: 'Confirmar pedido' })

    expect(confirmar).toBeEnabled()
    await user.click(confirmar)

    expect(onConfirmar).toHaveBeenCalledOnce()
  })
})
