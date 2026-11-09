import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 375, height: 667 } })

test('el menú no genera scroll horizontal en 375 px', async ({ page }) => {
  await page.goto('/?mesa=4')
  await expect(page.getByText('Muffin de chocolate', { exact: true })).toBeVisible()

  const anchoDelContenido = await page.evaluate(
    () => document.documentElement.scrollWidth,
  )

  expect(anchoDelContenido).toBeLessThanOrEqual(375)
})
