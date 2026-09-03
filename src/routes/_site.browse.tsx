import { createFileRoute } from "@tanstack/react-router";
import { BrowseView } from "@/components/movizo/BrowseView";

export const Route = createFileRoute("/_site/browse")({
  head: () => ({
    meta: [
      { title: "Browse the Movizo Catalogue" },
      {
        name: "description",
        content:
          "Explore every anime series and movie on Movizo with filters for genre, year, rating and airing status.",
      },
      { property: "og:title", content: "Browse the Movizo Catalogue" },
      {
        property: "og:description",
        content: "Filter the full Movizo catalogue by genre, year, rating and status.",
      },
    ],
  }),
  component: () => (
    <BrowseView
      heading="Browse everything"
      description="Filter the full Movizo catalogue by genre, release year, rating and airing status."
    />
  ),
});
