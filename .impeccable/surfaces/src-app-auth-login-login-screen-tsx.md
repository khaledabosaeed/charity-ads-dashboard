---
version: 1
slug: "src-app-auth-login-login-screen-tsx"
primary_target: "src/app/(auth)/login/login-screen.tsx"
related_targets: ["src/app/(auth)/login/page.tsx","src/app/forbidden/page.tsx"]
---

## Scope

The unauthenticated entry: `/login` and the `/forbidden` refusal screen. The only surfaces a signed-out person sees.

## Visitor mode

Operate. This is a staff door, not a pitch — but it is also the one screen that carries the company's identity at full scale, so it earns more expression than any screen behind it.

## Audience and task

Admins and media buyers at مؤسسة الشرق الذكي التجارية, signing in to a tool they use every week. The task is two fields and a button; they know their credentials. Nothing here should slow that down.

## Content and constraints

- Arabic-first, RTL default, English/LTR toggle available before sign-in.
- Theme toggle available before sign-in, since the sheet the user prefers should survive the login round-trip.
- Email and password only. No sign-up, no password reset, no SSO — those do not exist in this product, and none may be implied.
- The company name and the logo are binding assets. The product line (لوحة إعلانات الجمعيات) reads beneath the company mark, never instead of it.
- Three real error states: invalid credentials, disabled account, unexpected failure. Each names the problem and the recovery.

## Chosen direction

المسقط / The Elevation (seed 07224488). The screen splits: an amber field owning the whole start half, and drafting paper on the end half carrying the sign-in sheet.

## Memorable moment

The company mark blown up as a watermark bleeding off the amber panel's start edge, with the green datum ruled across the panel's foot and labelled `0` — the same datum every figure inside the app is measured from, stated before the user has seen a single figure. Beside the headline, a vertical dimension ladder whose four ticks name the product's actual measures (budget, spent, remaining, advertising return), so the brand panel is made of product truth rather than ornament.

## Unresolved

- No password-reset path exists in the product. If one is ever added, it belongs under the submit button, not in the amber panel.
- The supplied logo is a low-resolution JPEG on a white matte. It has been vectorised into `src/components/brand/mark.tsx`; a supplied original vector would still be better and should replace the trace when available.
