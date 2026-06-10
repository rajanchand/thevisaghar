import { test, expect } from "@playwright/test";

test.describe("The Visa Ghar E2E Flow", () => {
  test("should load the home page and verify hero section and headings", async ({ page }) => {
    // Navigate to homepage
    await page.goto("/");

    // Verify title
    await expect(page).toHaveTitle(/The Visa Ghar/i);

    // Verify presence of brand/nav elements
    const brandName = page.locator("header");
    await expect(brandName).toBeVisible();

    // Verify service card exists
    const studentVisaCard = page.locator("text=Student Visa").first();
    await expect(studentVisaCard).toBeVisible();
  });

  test("should navigate to the contact page and inspect form presence", async ({ page }) => {
    // Go to contact page
    await page.goto("/contact");

    // Verify main page heading
    const contactHeading = page.locator("h1");
    await expect(contactHeading).toContainText(/Contact/i);

    // Verify contact form inputs exist
    const nameInput = page.locator('input[id="contact-name"]').first();
    const emailInput = page.locator('input[id="contact-email"]').first();
    const messageInput = page.locator('textarea[id="contact-message"]').first();

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageInput).toBeVisible();
  });
});

