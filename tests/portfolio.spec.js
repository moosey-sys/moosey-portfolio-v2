import { test, expect } from "@playwright/test";
test("project exploration, accessible tabs, themes and motion work", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator(".preloader")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Pause animations", exact: true })
    .click();
  await page.getByRole("button", { name: "Systems 01", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await page.locator(".project-card").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Banking infrastructure", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("button", { name: "All 05", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(5);
  await page.locator(".project-card").first().click();
  await page.getByRole("button", { name: "Dark screenshot" }).click();
  await expect(page.locator(".detail-visual img")).toHaveAttribute(
    "src",
    "/assets/home-dark.jpg",
  );
  await page.getByRole("button", { name: "Close preview" }).click();
  await page.getByRole("tab", { name: "02 enquiries" }).click();
  await expect(page.locator("#dashboard-panel")).toContainText("Every conversation");
  await page.getByRole("tab", { name: "02 enquiries" }).press("ArrowRight");
  await expect(page.getByRole("tab", { name: "03 news" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.getByRole("button", { name: "Use sage theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "sage");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "sage");
  expect(errors).toEqual([]);
});
test("mobile layout and menu are usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".preloader")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBeTruthy();
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "02 The human" })
    .click();
  await expect(page.locator(".menu-overlay")).not.toHaveClass(/is-open/);
  await page.getByRole("button", { name: "ENTER THE CANVAS" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Zoom in" }).click();
  await page.getByRole("button", { name: "Reset canvas" }).click();
  await page.getByRole("button", { name: "Close preview" }).click();
  await page.screenshot({ path: ".local/mobile.png", fullPage: true });
});
