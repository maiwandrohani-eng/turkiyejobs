import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { RESOURCE_ARTICLES, getResourceArticle } from "@/lib/resources-articles";
import { resourceArticleAuthor, resourceReadTimeMinutes } from "@/lib/resources-read-time";
import { absoluteUrl } from "@/lib/site-url";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return RESOURCE_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getResourceArticle(slug);
  if (!article) {
    return { title: "Resource | TürkiyeJobs.org" };
  }
  const title = `${article.title} | TürkiyeJobs.org`;
  const description = article.excerpt;
  const url = absoluteUrl(`/resources/${article.slug}`);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
  };
}

export default async function ResourceArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getResourceArticle(slug);
  if (!article) notFound();

  const published = new Date(article.publishedAt + "T12:00:00").toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "long", year: "numeric" },
  );
  const author = resourceArticleAuthor(article);
  const readMins = resourceReadTimeMinutes(article);

  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell className="max-w-3xl">
        <nav className="mb-6 text-sm text-foreground/65">
          <Link href="/resources" className="hover:text-brand-navy">
            Resources
          </Link>
          <span className="mx-2">/</span>
          <span className="text-brand-navy">{article.title}</span>
        </nav>

        <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
          {article.category}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-navy md:text-4xl">
          {article.title}
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          {author} · {readMins} min read · Published {published}
        </p>
        <p className="mt-6 text-base leading-relaxed text-foreground/80">{article.excerpt}</p>

        <div className="mt-10 space-y-10">
          {article.sections.map((section, i) => (
            <section key={i}>
              {section.heading ? (
                <h2 className="text-lg font-bold text-brand-navy">{section.heading}</h2>
              ) : null}
              <div className={section.heading ? "mt-3" : ""}>
                {section.paragraphs.map((p, j) => (
                  <p
                    key={j}
                    className="text-sm leading-relaxed text-foreground/80 md:text-base [&:not(:first-child)]:mt-4"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3 border-t border-brand-border pt-8">
          <Link
            href="/resources"
            className="rounded-xl border border-brand-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-muted"
          >
            All resources
          </Link>
          <Link
            href="/opportunities"
            className="btn-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Browse opportunities
          </Link>
        </div>
      </PageShell>
    </div>
  );
}
