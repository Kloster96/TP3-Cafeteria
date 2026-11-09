import { expect, test } from '@playwright/test'

const API = 'http://localhost:3000'

test.beforeEach(async ({ request }) => {
  await request.post(`${API}/__test__/reset`)
  await request.post(`${API}/__test__/seed`)
})

test('el cliente arma un pedido, lo confirma y consulta su estado', async ({
  page,
  request,
}) => {
  await page.goto('/?mesa=4')
  await expect(page.getByText('Mesa 4')).toBeVisible()

  await page.getByRole('radio', { name: 'Expreso' }).check()
  await page.getByRole('radio', { name: 'Mediano' }).check()
  await page.getByRole('radio', { name: 'Colombia' }).check()
  await page.getByRole('button', { name: 'Agregar café' }).click()
  await page.getByRole('button', { name: 'Agregar café' }).click()
  await page
    .getByRole('button', { name: 'Agregar Muffin de chocolate' })
    .click()
  await page.getByRole('button', { name: 'Confirmar pedido' }).click()

  const numero = page.getByText(/^Pedido #\d+$/)
  await expect(numero).toBeVisible()
  await expect(page.getByText('pendiente', { exact: true })).toBeVisible()
  await expect(page.getByText('$17.220', { exact: true })).toBeVisible()
  await expect(page.getByText('Tu carrito está vacío')).toBeVisible()

  const idPedido = (await numero.innerText()).replace('Pedido #', '')
  const existente = await request.get(`${API}/pedidos/${idPedido}`)
  expect(existente.ok()).toBe(true)

  const consulta = page.waitForResponse(`**/api/pedidos/${idPedido}`)
  await page.getByRole('button', { name: 'Actualizar estado' }).click()

  expect((await consulta).status()).toBe(200)
  await expect(page.getByText('pendiente', { exact: true })).toBeVisible()
})
