"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function BackToHomeBar() {
  const pathname = usePathname();
  const { t, locale } = useLanguage();

  if (!pathname || pathname === "/" || pathname.startsWith("/dashboard")) {
    return null;
  }

  const isRtl = false;

  return (
    <nav className="mb-6" aria-label="Site">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold text-brand-gold decoration-brand-gold/50 underline-offset-4 hover:text-brand-navy hover:underline"
      >
        {isRtl ? (
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
        ) : (
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
        )}
        {t("backToHome")}
      </Link>
    </nav>
  );
}
