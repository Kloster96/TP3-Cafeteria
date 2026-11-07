import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import type { Cafe, Producto } from '../api/schemas'
import { CarritoProvider, useCarrito } from '../context/CarritoContext'
import { productos } from '../mocks/datos'
import { SelectorCafe } from './SelectorCafe'

function esCafe(producto: Producto): producto is Cafe {
  return producto.tipo !== 'pasteleria'
}

const cafes = productos.filter(esCafe)

function renderConCarrito(children: ReactNode) {
  return render(<CarritoProvider>{children}</CarritoProvider>)
}

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

describe('SelectorCafe', () => {
  it('presenta los grupos Bebida, Tamaño y Origen', () => {
    renderConCarrito(<SelectorCafe productos={cafes} />)

    expect(
      screen.getByRole('radiogroup', { name: 'Bebida' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('radiogroup', { name: 'Tamaño' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('radiogroup', { name: 'Origen' }),
    ).toBeInTheDocument()
  })

  it('muestra la descripción de cada origen', () => {
    renderConCarrito(<SelectorCafe productos={cafes} />)

    expect(
      screen.getByText(
        'Acidez baja, cuerpo intenso y notas de chocolate y frutos secos',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Acidez media, cuerpo equilibrado y notas cítricas y florales',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Acidez alta, cuerpo ligero y notas frutales y de jazmín',
      ),
    ).toBeInTheDocument()
  })

  it('muestra precios de la API solo al elegir bebida y tamaño', async () => {
    const user = userEvent.setup()
    renderConCarrito(<SelectorCafe productos={cafes} />)

    expect(screen.queryByText('$7.360')).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Expreso' }))
    await user.click(screen.getByRole('radio', { name: 'Mediano' }))

    expect(screen.getByText('$7.360')).toBeInTheDocument()
  })

  it('habilita Agregar café únicamente con las tres elecciones', async () => {
    const user = userEvent.setup()
    renderConCarrito(<SelectorCafe productos={cafes} />)
    const agregar = screen.getByRole('button', { name: 'Agregar café' })

    expect(agregar).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: 'Expreso' }))
    await user.click(screen.getByRole('radio', { name: 'Mediano' }))
    expect(agregar).toBeDisabled()

    const origen = screen.getByRole('radiogroup', { name: 'Origen' })
    await user.click(within(origen).getByRole('radio', { name: 'Colombia' }))

    expect(agregar).toBeEnabled()
  })

  it('agrega al carrito el café elegido', async () => {
    const user = userEvent.setup()
    renderConCarrito(
      <>
        <SelectorCafe productos={cafes} />
        <ResumenCarrito />
      </>,
    )

    await user.click(screen.getByRole('radio', { name: 'Expreso' }))
    await user.click(screen.getByRole('radio', { name: 'Mediano' }))
    await user.click(screen.getByRole('radio', { name: 'Colombia' }))
    await user.click(screen.getByRole('button', { name: 'Agregar café' }))

    expect(screen.getByLabelText('Contenido del carrito')).toHaveTextContent(
      '9:Expreso:1',
    )
  })
})
