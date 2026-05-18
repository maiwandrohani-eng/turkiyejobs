"use client";

import Link from "next/link";
import { ViewModeToggle } from "@/components/ViewModeToggle";
import { usePersistedViewMode } from "@/hooks/usePersistedViewMode";
import { cn } from "@/lib/cn";

export type ResourceArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  readTimeMinutes: number;
};

function ReadMoreLink({ slug, articleTitle }: { slug: string; articleTitle: string }) {
  return (
    <Link
      href={`/resources/${slug}`}
      className="inline-flex min-h-[2.75rem] items-center justify-center rounded-lg border border-brand-border bg-white px-4 py-2 text-xs font-semibold text-brand-navy hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 sm:min-h-0"
      aria-label={`Read more: ${articleTitle}`}
    >
      Read more
    </Link>
  );
}

export function ResourcesArticles({ articles }: { articles: ResourceArticle[] }) {
  const { mode, setMode } = usePersistedViewMode("turkiyejobs:v1:viewResourcesArticles");

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-foreground/70">
          <span className="font-semibold text-brand-navy">{articles.length}</span> articles
        </p>
        <ViewModeToggle
          value={mode}
          onChange={setMode}
          groupAriaLabel="Resources article layout"
          className="self-stretch sm:self-auto"
        />
      </div>

      {mode === "card" ? (
        <div className="grid gap-5 md:grid-cols-2">
          {articles.map((a) => (
            <article
              key={a.slug}
              className="flex h-full flex-col rounded-2xl border border-brand-border bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                {a.category}
              </p>
              <h2 className="mt-1 text-lg font-bold text-brand-navy">{a.title}</h2>
              <p className="mt-2 text-xs text-foreground/55">
                {a.author} · {a.readTimeMinutes} min read
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/75">{a.excerpt}</p>
              <div className="mt-5">
                <ReadMoreLink slug={a.slug} articleTitle={a.title} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <ul className="divide-y divide-brand-border rounded-2xl border border-brand-border bg-white shadow-sm">
          {articles.map((a) => (
            <li
              key={a.slug}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                  {a.category}
                </p>
                <h2 className="mt-0.5 text-base font-bold text-brand-navy">{a.title}</h2>
                <p className="mt-1 text-xs text-foreground/55">
                  {a.author} · {a.readTimeMinutes} min read
                </p>
                <p className="mt-1 text-sm text-foreground/75">{a.excerpt}</p>
              </div>
              <div className={cn("flex shrink-0 sm:items-center")}>
                <ReadMoreLink slug={a.slug} articleTitle={a.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
