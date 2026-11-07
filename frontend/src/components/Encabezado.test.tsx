import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Encabezado } from './Encabezado'

describe('Encabezado', () => {
  it('con mesa 4 muestra "Mesa 4"', () => {
    render(<Encabezado mesa={4} />)

    expect(screen.getByText('Mesa 4')).toBeInTheDocument()
    expect(screen.queryByText('Retiro en barra')).not.toBeInTheDocument()
  })

  it('sin mesa muestra "Retiro en barra"', () => {
    render(<Encabezado mesa={null} />)

    expect(screen.getByText('Retiro en barra')).toBeInTheDocument()
  })

  it('muestra el nombre de la cafetería como encabezado', () => {
    render(<Encabezado mesa={null} />)

    expect(screen.getByRole('heading', { name: 'Cafetería Origen' })).toBeInTheDocument()
  })
})