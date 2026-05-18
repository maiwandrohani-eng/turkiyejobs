import {
  getResourceArticle,
  type ResourceArticleBody,
} from "@/lib/resources-articles";

export const RESOURCE_AUTHOR_DEFAULT = "TürkiyeJobs Editorial";

export function resourceArticleAuthor(article: {
  author?: string | null;
}): string {
  const a = article.author?.trim();
  return a || RESOURCE_AUTHOR_DEFAULT;
}

export function resourceReadTimeMinutes(article: ResourceArticleBody): number {
  const parts: string[] = [article.excerpt];
  for (const section of article.sections) {
    if (section.heading) parts.push(section.heading);
    parts.push(...section.paragraphs);
  }
  const words = parts.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function getResourceArticleListMeta(slug: string): {
  author: string;
  readTimeMinutes: number;
} {
  const article = getResourceArticle(slug);
  if (!article) {
    return { author: RESOURCE_AUTHOR_DEFAULT, readTimeMinutes: 1 };
  }
  return {
    author: resourceArticleAuthor(article),
    readTimeMinutes: resourceReadTimeMinutes(article),
  };
}
