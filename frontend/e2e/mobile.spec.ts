import { expect, test } from '@playwright/test'

const API = 'http://localhost:3000'

test.use({ viewport: { width: 375, height: 667 } })

test.beforeEach(async ({ request }) => {
  await request.post(`${API}/__test__/reset`)
})

test('el menú no genera scroll horizontal en 375 px', async ({ page }) => {
  await page.goto('/?mesa=4')
  await expect(page.getByText('Muffin de chocolate', { exact: true })).toBeVisible()

  const anchoDelContenido = await page.evaluate(
    () => document.documentElement.scrollWidth,
  )

  expect(anchoDelContenido).toBeLessThanOrEqual(375)
})

test('la confirmación del pedido no genera scroll horizontal en 375 px', async ({
  page,
}) => {
  await page.goto('/?mesa=4')
  await page.getByRole('radio', { name: 'Expreso' }).check()
  await page.getByRole('radio', { name: 'Taza grande' }).check()
  await page.getByRole('radio', { name: 'Etiopía' }).check()
  await page.getByRole('button', { name: 'Agregar café' }).click()
  await page
    .getByRole('button', { name: 'Agregar Torta selva negra' })
    .click()
  await page.getByRole('button', { name: 'Confirmar pedido' }).click()
  await expect(page.getByText(/^Pedido #\d+$/)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Actualizar estado' })).toBeVisible()

  const anchoDelContenido = await page.evaluate(
    () => document.documentElement.scrollWidth,
  )

  expect(anchoDelContenido).toBeLessThanOrEqual(375)
})
