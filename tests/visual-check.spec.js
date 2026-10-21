import { test, expect } from "@playwright/test";
test("desktop motion, 3D view and screenshots", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator(".preloader")).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: ".local/desktop-hero.png" });
  await page.getByRole("button", { name: "ORBIT", exact: true }).click();
  await expect(page.locator(".project-globe canvas")).toBeVisible();
  await page
    .locator(".project-globe")
    .screenshot({ path: ".local/project-orbit.png" });
  await page.locator(".globe-links button").first().click();
  await expect(
    page.getByRole("heading", {
      name: "Guru International School",
      exact: true,
    }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.locator("#stack").scrollIntoViewIfNeeded();
  await page.locator("#stack").screenshot({ path: ".local/toolkit.png" });
  expect(errors).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".preloader")).toHaveCount(0);
  await page.screenshot({ path: ".local/mobile-hero.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBeTruthy();
});
