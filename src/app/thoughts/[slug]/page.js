import Link from "next/link";
import { notFound } from "next/navigation";
import { thoughts } from "@/content/thoughts";

function formatDateLong(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export function generateMetadata({ params }) {
  const post = thoughts.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | Thoughts`,
    description: post.excerpt,
  };
}

export default function ThoughtPage({ params }) {
  const post = thoughts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <div className="px-6 md:px-12 py-20">
      <article className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Link
            href="/thoughts"
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            ← Thoughts
          </Link>
          <h1 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight">{post.title}</h1>
          <div className="mt-3 text-sm text-neutral-500 tabular-nums">{formatDateLong(post.date)}</div>
        </div>

        <div className="space-y-6 text-neutral-200 leading-relaxed text-[15px] md:text-base">
          {post.content}
        </div>
      </article>
    </div>
  );
}

