import { test, expect } from '@playwright/test'

test.describe('Password reset UX', () => {
  test('reset page waits for recovery session and disables submit', async ({ page }) => {
    await page.goto('http://localhost:3000/reset-password')
    await expect(page.getByRole('heading', { name: 'Set a new password' })).toBeVisible()
    await expect(page.getByText('Waiting for recovery session')).toBeVisible()
    const submit = page.getByRole('button', { name: 'Update password' })
    await expect(submit).toBeDisabled()
  })

  test('forgot page shows config error without env', async ({ page }) => {
    await page.goto('http://localhost:3000/forgot-password')
    const submit = page.getByRole('button', { name: 'Send reset link' })

    // valid email but missing env shows helpful server message
    await page.getByRole('textbox', { name: 'Email Address' }).fill('user@example.com')
    const [resp] = await Promise.all([
      page.waitForResponse(
        r => r.url().includes('/api/auth/password/reset') && r.request().method() === 'POST',
      ),
      submit.click(),
    ])
    expect([401, 422, 500]).toContain(resp.status())
    const json = await resp.json()
    const msg = String(json.error || '')
    expect(/Supabase|Unauthorized/i.test(msg)).toBeTruthy()
  })
})
