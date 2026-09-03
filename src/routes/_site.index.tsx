import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/movizo/Hero";
import { Row } from "@/components/movizo/Row";
import {
  continueWatching,
  newReleases,
  topRated,
  trending,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "Movizo — Stream Anime Series & Movies" },
      {
        name: "description",
        content:
          "Watch trending anime, new releases and top rated movies on Movizo. Curated rows, watchlists and continue watching.",
      },
      { property: "og:title", content: "Movizo — Stream Anime Series & Movies" },
      {
        property: "og:description",
        content: "Trending anime, new releases and top rated movies, all in one place.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <h1 className="sr-only">Movizo — stream anime series and movies</h1>
      <Hero slides={trending} />
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6">
        <Row heading="Trending Anime" titles={trending} />
        <Row heading="Continue Watching" titles={continueWatching} showProgress />
        <Row heading="New Releases" titles={newReleases} />
        <Row heading="Top Rated" titles={topRated} />
      </div>
    </>
  );
}
