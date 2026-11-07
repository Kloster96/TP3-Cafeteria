import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { Producto, ProductoPasteleria } from '../api/schemas'
import { CarritoProvider, useCarrito } from '../context/CarritoContext'
import { productos } from '../mocks/datos'
import { Pasteleria } from './Pasteleria'

function esPasteleria(producto: Producto): producto is ProductoPasteleria {
  return producto.tipo === 'pasteleria'
}

const productosDePasteleria = productos.filter(esPasteleria)

function ResumenCarrito() {
  const { estado } = useCarrito()

  return (
    <output aria-label="Contenido del carrito">
      {estado.items.map(
        (item) => `${item.productoId}:${item.nombre}:${item.cantidad}`,
      )}
    </output>
  )
}

function renderPasteleria(conResumen = false) {
  return render(
    <CarritoProvider>
      <Pasteleria productos={productosDePasteleria} />
      {conResumen && <ResumenCarrito />}
    </CarritoProvider>,
  )
}

describe('Pasteleria', () => {
  it('muestra productos, precios de la API y botones accesibles', () => {
    renderPasteleria()

    expect(screen.getByText('Muffin de chocolate')).toBeInTheDocument()
    expect(screen.getByText('$2.500')).toBeInTheDocument()
    expect(screen.getByText('Torta selva negra')).toBeInTheDocument()
    expect(screen.getByText('$4.200')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Agregar Muffin de chocolate' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Agregar Torta selva negra' }),
    ).toBeInTheDocument()
  })

  it('agrega cada producto elegido al carrito', async () => {
    const user = userEvent.setup()
    renderPasteleria(true)

    await user.click(
      screen.getByRole('button', { name: 'Agregar Muffin de chocolate' }),
    )
    await user.click(
      screen.getByRole('button', { name: 'Agregar Torta selva negra' }),
    )

    const carrito = screen.getByLabelText('Contenido del carrito')
    expect(carrito).toHaveTextContent('19:Muffin de chocolate:1')
    expect(carrito).toHaveTextContent('20:Torta selva negra:1')
  })
})
