import { expect, test } from "@playwright/test";

const adminEmail = process.env.TEST_ADMIN_EMAIL;
const adminPassword = process.env.TEST_ADMIN_PASSWORD;
const buyerEmail = process.env.TEST_MEDIA_BUYER_EMAIL;
const buyerPassword = process.env.TEST_MEDIA_BUYER_PASSWORD;

test.skip(!adminEmail || !buyerEmail, "Requires a live Supabase instance + seeded test users (see tests/e2e/README.md)");

async function login(page: import("@playwright/test").Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel(/البريد الإلكتروني|Email/).fill(email);
  await page.getByLabel(/كلمة المرور|Password/).fill(password);
  await page.getByRole("button", { name: /دخول|Sign in/ }).click();
}

test("admin can log in and reach the dashboard", async ({ page }) => {
  await login(page, adminEmail!, adminPassword!);
  await expect(page).toHaveURL(/\/dashboard/);
});

test("media buyer is blocked from admin pages", async ({ page }) => {
  await login(page, buyerEmail!, buyerPassword!);
  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto("/admin/associations");
  await expect(page).toHaveURL(/\/forbidden/);
});

test("media buyer can add a statistics entry for an assigned association", async ({ page }) => {
  await login(page, buyerEmail!, buyerPassword!);
  await page.goto("/statistics/new");

  await page.getByLabel(/تاريخ بداية الفترة|Period Start/).fill("2026-01-01");
  await page.getByLabel(/تاريخ نهاية الفترة|Period End/).fill("2026-01-31");
  await page.getByLabel(/الميزانية|Budget/).fill("1000");
  await page.getByLabel(/المبلغ المصروف|Amount Spent/).fill("200");
  await page.getByLabel(/عدد التبرعات|Donation Count/).fill("5");
  await page.getByLabel(/قيمة التبرعات|Donation Value/).fill("500");
  await page.getByLabel(/قيمة العائد الإعلاني|Advertising Return/).fill("300");
  await page.getByLabel(/عائد الجمعية|Association Return/).fill("100");

  await page.getByRole("button", { name: /حفظ|Save/ }).click();
  await expect(page).toHaveURL(/\/statistics$/);
});
