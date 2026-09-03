import { createFileRoute } from "@tanstack/react-router";
import { BrowseView } from "@/components/movizo/BrowseView";

export const Route = createFileRoute("/_site/series")({
  head: () => ({
    meta: [
      { title: "Anime Series on Movizo" },
      {
        name: "description",
        content:
          "Binge multi-season anime series on Movizo — ongoing simulcasts and completed classics, filterable by genre and rating.",
      },
      { property: "og:title", content: "Anime Series on Movizo" },
      {
        property: "og:description",
        content: "Ongoing simulcasts and completed classics, season by season.",
      },
    ],
  }),
  component: () => (
    <BrowseView
      kind="series"
      heading="Series"
      description="Ongoing simulcasts and completed classics, season by season."
    />
  ),
});
