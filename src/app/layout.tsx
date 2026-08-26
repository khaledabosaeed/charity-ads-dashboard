import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { I18nProvider, type Locale, LOCALE_COOKIE_NAME } from "@/i18n";
import { getAppName } from "@/lib/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "لوحة إعلانات الجمعيات | Charity Ads Dashboard",
  description: "لوحة إدارة إعلانات الجمعيات والميديا باير والإحصائيات",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const locale = ((cookieStore.get(LOCALE_COOKIE_NAME)?.value as Locale) || "ar") as Locale;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <I18nProvider initialLocale={locale}>
          {children}
          <Toaster richColors position="top-center" dir={dir} />
        </I18nProvider>
        <noscript>{getAppName()}</noscript>
      </body>
    </html>
  );
}
