import { test, expect } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

const EXPECTED_ORDER_NUMBER = '109623';

test.describe('Конструктор бургера', () => {

  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/api.har', { url: '**/api/**' });

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
      document.cookie = 'accessToken=test-access-token';
    });

    await page.goto('/');
  });

  test('добавление ингредиента в конструктор', async ({ page }) => {
    const bunCard = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });
    await bunCard.locator('button').click();

    const constructor = page.locator('main');

    await expect(constructor.locator('img[alt="Краторная булка N-200i (верх)"]')).toBeVisible();
    await expect(constructor.locator('img[alt="Краторная булка N-200i (низ)"]')).toBeVisible();
  });

  test('открытие и закрытие модального окна ингредиента', async ({ page }) => {
    await page.getByText('Краторная булка N-200i').first().click();

    await expect(page.locator('#modals')).toContainText('Краторная булка N-200i');

    await page.keyboard.press('Escape');
    await expect(page.locator('#modals')).not.toContainText('Краторная булка N-200i');

    await page.getByText('Краторная булка N-200i').first().click();
    await expect(page.locator('#modals')).toContainText('Краторная булка N-200i');

    await page.locator('#modals button').first().click();
    await expect(page.locator('#modals')).not.toContainText('Краторная булка N-200i');

    await page.getByText('Краторная булка N-200i').first().click();
    await expect(page.locator('#modals')).toContainText('Краторная булка N-200i');

    await page.locator('body').click({ position: { x: 10, y: 10 } });
    await expect(page.locator('#modals')).not.toContainText('Краторная булка N-200i');
  });

  test('создание заказа', async ({ page }) => {
    await page.locator('li').filter({ hasText: 'Краторная булка N-200i' }).locator('button').click();

    await page.locator('li').filter({ hasText: 'Биокотлета из марсианской Магнолии' }).locator('button').click();

    await page.getByText('Оформить заказ').click();

    await expect(page.locator('#modals')).toContainText(EXPECTED_ORDER_NUMBER);

    await page.locator('#modals button').first().click();
    await expect(page.locator('#modals')).not.toContainText(EXPECTED_ORDER_NUMBER);

    const constructor = page.locator('main');

    await expect(constructor.getByText('Выберите булки').first()).toBeVisible();
    await expect(constructor.getByText('Выберите начинку')).toBeVisible();

    await expect(constructor.locator('img[alt="Биокотлета из марсианской Магнолии"]')).toHaveCount(0);
  });
});
