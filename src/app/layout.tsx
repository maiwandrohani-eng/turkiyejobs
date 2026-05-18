import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Providers } from "@/components/Providers";
import { getContactPublicData } from "@/lib/site-contact";

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
  const contact = await getContactPublicData();

  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject body attributes after SSR */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter social={contact.social} />
        </Providers>
      </body>
    </html>
  );
}
