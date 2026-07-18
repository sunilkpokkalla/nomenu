import { test, expect } from '@playwright/test';

test.describe('Customer Checkout Flow', () => {
  const RESTAURANT_URL = '/velvet-fork/tasting-menu';

  test('Customer can add item to cart and review it', async ({ page }) => {
    await page.goto(RESTAURANT_URL);
    await expect(page).toHaveTitle(/Menu|Nomenu|velvet/i);

    // Click "Add to order" (Minimalist Theme) or any Add button
    await page.screenshot({ path: '/Users/sunilkumar/.gemini/antigravity-ide/brain/fb5d77ee-2d0c-4d29-a02a-4fcd402c5060/playwright-screenshot.png' });
    const addButton = page.getByText(/Add to order/i).first();
    await expect(addButton).toBeVisible({ timeout: 15000 });
    await addButton.click();
    
    // Give it a second to animate / state update
    await page.waitForTimeout(1000);

    // Click View Order floating button
    const viewOrderBtn = page.getByText(/View Order/i);
    await expect(viewOrderBtn).toBeVisible({ timeout: 5000 });
    await viewOrderBtn.click();

    // Verify modal appears using our test id
    const cartModal = page.getByTestId('cart-modal');
    await expect(cartModal).toBeVisible({ timeout: 5000 });
    
    // Verify total text exists
    await expect(cartModal.getByText(/Total/i).first()).toBeVisible();
  });
});
