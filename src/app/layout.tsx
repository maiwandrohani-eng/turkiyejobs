import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Providers } from "@/components/Providers";
import { authOptions } from "@/lib/auth-options";
import { LOCALE_COOKIE_KEY, normalizeLocale } from "@/lib/i18n/locale";
import {
  DEFAULT_CONTACT_CARD,
  DEFAULT_SOCIAL_LINKS,
} from "@/lib/site-contact-defaults";
import { getContactPublicData, type ContactPublicData } from "@/lib/site-contact";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://turkiyejobs.org"),
  title: {
    default: "TürkiyeJobs — NGO & Development Sector Jobs in Türkiye",
    template: "%s | TürkiyeJobs",
  },
  description:
    "Verified NGO jobs, consultancies, grants, and opportunities for Türkiye's development and humanitarian sector.",
  openGraph: {
    type: "website",
    siteName: "TürkiyeJobs",
    title: "TürkiyeJobs — NGO & Development Sector Jobs in Türkiye",
    description:
      "Verified NGO jobs, consultancies, grants, and opportunities for Türkiye's development and humanitarian sector.",
    url: "https://turkiyejobs.org",
  },
  twitter: {
    card: "summary_large_image",
    title: "TürkiyeJobs — NGO & Development Sector Jobs in Türkiye",
    description:
      "Verified NGO jobs, consultancies, grants, and opportunities for Türkiye's development and humanitarian sector.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  const contactFallback: ContactPublicData = {
    officeTitle: DEFAULT_CONTACT_CARD.officeTitle,
    body: DEFAULT_CONTACT_CARD.body,
    mapEmbedUrl: DEFAULT_CONTACT_CARD.mapEmbedUrl,
    social: DEFAULT_SOCIAL_LINKS,
  };

  let contact = contactFallback;
  try {
    contact = await getContactPublicData();
  } catch (e) {
    console.error("[layout] getContactPublicData failed:", e);
  }

  let session: Session | null = null;
  try {
    session = await getServerSession(authOptions);
  } catch (e) {
    console.error("[layout] getServerSession failed:", e);
  }

  const htmlLocale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value);

  return (
    <html
      lang={htmlLocale === "tr" ? "tr" : "en"}
      dir="ltr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject body attributes after SSR */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers session={session}>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter social={contact.social} />
        </Providers>
      </body>
    </html>
  );
}
