import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Alexandria, Archivo } from "next/font/google";
import { Toaster } from "sonner";
import { I18nProvider } from "@/i18n";
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, type Locale } from "@/i18n/config";
import { ThemeProvider } from "@/theme";
import { DEFAULT_THEME, THEME_COOKIE_NAME, type Theme } from "@/theme/config";
import { getAppName } from "@/lib/env";
import "./globals.css";

/* The lettering of the drawing: Arabic and Latin from one geometric hand. */
const alexandria = Alexandria({
  variable: "--font-alexandria",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

/* The dimension figures: a grotesque with true tabular numerals. */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "لوحة إعلانات الجمعيات | مؤسسة الشرق الذكي التجارية",
  description: "لوحة إدارة إعلانات الجمعيات والميديا باير والإحصائيات",
};

const CONTRACT = `<!--
IMPECCABLE DIRECTION CONTRACT — المسقط / The Elevation — seed 07224488

THESIS: The company mark is a building drawn in elevation; this app is the rest of
that sheet. Budget is mass, spend is the hatched cut through it, zero is a green
datum every figure is measured from. Refuses the SaaS card grid, where eight equal
white boxes make eight unequal numbers look identical.

OWN-WORLD: Warm drafting paper (#F7F3EC) or blueprint ink (#0E1216). Three hairline
weights, never a fourth. 45-degree hatch for consumed quantity. A 2px green datum
(#1F7A4D) that is zero everywhere. Amber (#E59731) owns whole regions — the full
height nav rail, the section band, the login's start half — never scattered accents.
Alexandria for lettering, Archivo tabular for every figure. Sheets are hairline
rectangles with title blocks; nothing is a rounded card.

STORY: A media buyer lands mid-task, reads spend against budget in one glance at the
section band, and logs a period. An admin reads the whole portfolio off one datum.

FIRST VIEWPORT: Amber rail down the start edge carrying the mark. Sheet header as a
drawing title block (sheet name / period / revision). Below it one wide SECTION band:
budget as a drawn mass, spent solid from the start edge, remaining open and hatched,
green datum beneath, dimension string above. Then a hairline-ruled row of dimension
cells, then the chart sharing that same datum. Primary action sits in the title block.

FORM: Candidate 4 of 7 on the grounded list (measured architectural elevation),
assigned by concept-seed key 07224488. Raised by four declined challengers: total
colour commitment (ye-ye sleeve), nothing labelled twice (Factory catalog), quantity
as mass with a cut face (cloud quarry), state prints itself in the content plane
(phosphor terminal).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
-->`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get(LOCALE_COOKIE_NAME)?.value as Locale) || DEFAULT_LOCALE;
  const theme = (cookieStore.get(THEME_COOKIE_NAME)?.value as Theme) || DEFAULT_THEME;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      data-theme={theme}
      className={`${alexandria.variable} ${archivo.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <div hidden dangerouslySetInnerHTML={{ __html: CONTRACT }} />
        <ThemeProvider initialTheme={theme}>
          <I18nProvider initialLocale={locale}>
            {children}
            <Toaster
              position="top-center"
              dir={dir}
              toastOptions={{
                style: {
                  background: "var(--paper-raised)",
                  color: "var(--ink)",
                  border: "1px solid var(--line-2)",
                  borderRadius: "2px",
                  fontFamily: "var(--font-alexandria)",
                },
              }}
            />
          </I18nProvider>
        </ThemeProvider>
        <noscript>{getAppName()}</noscript>
      </body>
    </html>
  );
}
