import { test, expect } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/api.har', { url: '**/api/**' });

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
      document.cookie = 'accessToken=test-access-token';
    });

    await page.goto('http://localhost:4000');
  });

  test('добавление ингредиента в конструктор', async ({ page }) => {
    await page.getByText('Добавить').first().click();
    await expect(page.getByText('Краторная булка N-200i (верх)')).toBeVisible();
  });

  test('открытие и закрытие модального окна ингредиента', async ({ page }) => {
    await page.getByText('Краторная булка N-200i').first().click();

    await expect(page.locator('#modals')).toContainText('Краторная булка N-200i');

    await page.locator('#modals button').first().click();

    await expect(page.locator('#modals')).not.toContainText('Краторная булка N-200i');
  });

  test('создание заказа', async ({ page }) => {
    await page.getByRole('link', { name: 'Личный кабинет' }).click();
    await page.locator('input[name="email"]').fill('krol@kek.ru');
    await page.locator('input[name="password"]').fill('kek123KEK');
    await page.getByRole('button', { name: 'Войти' }).click();

    await page.getByRole('link', { name: 'Конструктор' }).click();

    await page.locator('li').filter({ hasText: 'Краторная булка N-200i' }).locator('button').click();

    await page.locator('li').filter({ hasText: 'Биокотлета из марсианской Магнолии' }).locator('button').click();

    await page.getByText('Оформить заказ').click();

    await expect(page.locator('#modals')).toContainText('109623');

    await page.locator('#modals button').first().click();
    await expect(page.locator('#modals')).not.toContainText('109623');

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
  });
});
