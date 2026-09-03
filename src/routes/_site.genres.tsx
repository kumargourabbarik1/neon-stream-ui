import { createFileRoute, Link } from "@tanstack/react-router";
import { genreTiles } from "@/lib/mock-data";

export const Route = createFileRoute("/_site/genres")({
  head: () => ({
    meta: [
      { title: "Browse Anime by Genre — Movizo" },
      {
        name: "description",
        content:
          "Action, romance, fantasy, horror, comedy, drama, sci-fi and slice of life — pick a mood and start watching on Movizo.",
      },
      { property: "og:title", content: "Browse Anime by Genre — Movizo" },
      {
        property: "og:description",
        content: "Pick a mood: action, romance, fantasy, horror, comedy and more.",
      },
    ],
  }),
  component: Genres,
});

function Genres() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold sm:text-4xl">Genres</h1>
        <p className="text-sm text-muted-foreground">
          Pick a mood and we'll do the rest.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {genreTiles.map((g) => (
          <Link
            key={g.name}
            to="/search"
            search={{ q: g.name }}
            className="group relative h-40 overflow-hidden rounded-xl border border-border hover-lift"
          >
            <img
              src={g.art}
              alt={`${g.name} genre art`}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="font-display text-lg font-bold">{g.name}</p>
              <p className="text-xs text-muted-foreground">{g.count} titles</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
