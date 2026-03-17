import Link from "next/link";
import { thoughts } from "@/content/thoughts";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" });
}

export const metadata = {
  title: "Thoughts | GenZVoter",
  description: "Writing and updates.",
};

export default function ThoughtsIndexPage() {
  return (
    <div className="px-6 md:px-12 py-20">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Thoughts</h1>
          <p className="text-neutral-400 mt-2">Notes, ideas, and updates.</p>
        </header>

        <ul className="divide-y divide-white/10">
          {thoughts
            .slice()
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .map((post) => (
              <li key={post.slug} className="py-5">
                <Link
                  href={`/thoughts/${post.slug}`}
                  className="group flex items-baseline gap-6"
                >
                  <div className="w-24 shrink-0 tabular-nums text-xs text-neutral-500">
                    {formatDate(post.date)}
                  </div>
                  <div className="flex-1">
                    <div className="text-base text-neutral-100 group-hover:text-white transition-colors">
                      {post.title}
                    </div>
                    <div className="text-sm text-neutral-400 mt-1 group-hover:text-neutral-300 transition-colors">
                      {post.excerpt}
                    </div>
                    <div className="mt-2 h-px w-0 bg-white/20 group-hover:w-12 transition-[width] duration-300" />
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

