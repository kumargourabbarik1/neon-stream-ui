import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Play, Plus, Share2 } from "lucide-react";
import { toast } from "sonner";
import { byId, episodesFor, TITLES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Chip, EpisodeBadge, RatingBadge, TrendingBadge } from "@/components/movizo/badges";
import { Row } from "@/components/movizo/Row";

export const Route = createFileRoute("/_site/title/$id")({
  loader: ({ params }) => {
    const title = byId(params.id);
    if (!title) throw notFound();
    return { title };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Title unavailable — Movizo" }, { name: "robots", content: "noindex" }],
      };
    }
    const t = loaderData.title;
    return {
      meta: [
        { title: `${t.name} — Watch on Movizo` },
        { name: "description", content: t.synopsis.slice(0, 155) },
        { property: "og:title", content: `${t.name} — Watch on Movizo` },
        { property: "og:description", content: t.synopsis.slice(0, 155) },
        { property: "og:image", content: t.banner },
        { name: "twitter:image", content: t.banner },
      ],
    };
  },
  component: Detail,
});

function Detail() {
  const { title } = Route.useLoaderData();
  const episodes = episodesFor(title);
  const similar = TITLES.filter(
    (t) => t.id !== title.id && t.genres.some((g) => title.genres.includes(g)),
  ).slice(0, 12);

  return (
    <>
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <img
          src={title.banner}
          alt={`${title.name} banner artwork`}
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-background/20" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto flex max-w-7xl gap-6 px-4 pb-10 sm:px-6">
            <img
              src={title.poster}
              alt={`${title.name} poster`}
              className="hidden w-40 rounded-xl border border-border object-cover sm:block"
            />
            <div className="animate-rise space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {title.trending && <TrendingBadge />}
                <RatingBadge value={title.rating} />
                <EpisodeBadge count={title.episodes} kind={title.kind} />
              </div>
              <h1 className="text-3xl font-bold sm:text-5xl">{title.name}</h1>
              <div className="flex flex-wrap gap-2">
                {title.genres.map((g) => (
                  <Chip key={g}>{g}</Chip>
                ))}
                <Chip>{title.year}</Chip>
                <Chip>
                  {title.kind === "movie"
                    ? "Film"
                    : `${title.seasons} season${title.seasons > 1 ? "s" : ""}`}
                </Chip>
                <Chip>{title.status}</Chip>
                <Chip>{title.studio}</Chip>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="rounded-full">
                  <Link to="/watch/$id" params={{ id: title.id }}>
                    <Play className="fill-current" /> Watch Now
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-primary/60 text-primary hover:bg-primary/10 hover:text-primary"
                  onClick={() => toast.success(`${title.name} added to My List`)}
                >
                  <Plus /> Add to My List
                </Button>
                <Button
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => toast("Link copied to clipboard")}
                >
                  <Share2 /> Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6">
        <section className="space-y-3">
          <h2 className="text-xl font-bold">Synopsis</h2>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {title.synopsis}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">
            {title.kind === "movie" ? "Chapters" : "Episodes"}
          </h2>
          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
            {episodes.map((ep) => (
              <Link
                key={ep.id}
                to="/watch/$id"
                params={{ id: title.id }}
                className="group flex items-center gap-4 p-3 transition-colors hover:bg-surface-2"
              >
                <div className="relative w-32 shrink-0 overflow-hidden rounded-md sm:w-40">
                  <img
                    src={ep.thumb}
                    alt={`Episode ${ep.number} thumbnail`}
                    loading="lazy"
                    className="aspect-video w-full object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Play className="size-6 fill-primary text-primary" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {ep.number}. {ep.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {ep.synopsis}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {ep.duration}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <Row heading="Similar Anime" titles={similar} />
      </div>
    </>
  );
}
