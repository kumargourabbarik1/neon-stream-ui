import { createFileRoute } from "@tanstack/react-router";
import { BrowseView } from "@/components/movizo/BrowseView";

export const Route = createFileRoute("/_site/movies")({
  head: () => ({
    meta: [
      { title: "Anime Movies on Movizo" },
      {
        name: "description",
        content:
          "Feature-length anime films on Movizo — festival favourites, studio epics and one-night watches.",
      },
      { property: "og:title", content: "Anime Movies on Movizo" },
      {
        property: "og:description",
        content: "Feature-length films for a single-sitting watch.",
      },
    ],
  }),
  component: () => (
    <BrowseView
      kind="movie"
      heading="Movies"
      description="Feature-length films for when you have one sitting and want the whole story."
    />
  ),
});
