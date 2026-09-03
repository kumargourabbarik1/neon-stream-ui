import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SearchX, Search as SearchIcon } from "lucide-react";
import { TITLES } from "@/lib/mock-data";
import { PosterCard } from "@/components/movizo/PosterCard";
import { Chip } from "@/components/movizo/badges";

export const Route = createFileRoute("/_site/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  head: () => ({
    meta: [
      { title: "Search Anime & Movies — Movizo" },
      {
        name: "description",
        content:
          "Search the Movizo catalogue by title, genre or studio and filter results live as you type.",
      },
      { property: "og:title", content: "Search Anime & Movies — Movizo" },
      {
        property: "og:description",
        content: "Find any title, genre or studio in the Movizo catalogue.",
      },
    ],
  }),
  component: SearchPage,
});

const SUGGESTIONS = ["Action", "Fantasy", "2025", "Crimson", "Horror"];

function SearchPage() {
  const { q } = Route.useSearch();
  const [query, setQuery] = useState(q);

  const term = query.trim().toLowerCase();
  const results = term
    ? TITLES.filter(
        (t) =>
          t.name.toLowerCase().includes(term) ||
          t.studio.toLowerCase().includes(term) ||
          String(t.year).includes(term) ||
          t.genres.some((g) => g.toLowerCase().includes(term)),
      )
    : TITLES.slice(0, 10);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6">
      <h1 className="text-3xl font-bold sm:text-4xl">Search</h1>

      <div className="relative mt-6 max-w-2xl">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, genre, studio or year…"
          aria-label="Search the catalogue"
          className="h-12 w-full rounded-full border border-border bg-surface pl-12 pr-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button key={s} type="button" onClick={() => setQuery(s)}>
            <Chip className="transition-colors hover:border-primary hover:text-primary">
              {s}
            </Chip>
          </button>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        {term ? `${results.length} results for “${query}”` : "Popular right now"}
      </p>

      {results.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <SearchX className="size-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">No matches found</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            We couldn't find anything for “{query}”. Try a different spelling, or browse
            by genre instead.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {results.map((t) => (
            <PosterCard key={t.id} title={t} />
          ))}
        </div>
      )}
    </div>
  );
}
