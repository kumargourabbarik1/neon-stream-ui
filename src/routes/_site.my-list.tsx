import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { myList } from "@/lib/mock-data";
import { PosterCard } from "@/components/movizo/PosterCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_site/my-list")({
  head: () => ({
    meta: [
      { title: "My List — Saved Anime on Movizo" },
      {
        name: "description",
        content:
          "Everything you saved for later on Movizo, in one grid. Remove titles you're done with in a click.",
      },
      { property: "og:title", content: "My List — Saved Anime on Movizo" },
      {
        property: "og:description",
        content: "Your saved anime and movies, ready when you are.",
      },
    ],
  }),
  component: MyList,
});

function MyList() {
  const [items, setItems] = useState(myList);

  const remove = (id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
    toast("Removed from My List");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold sm:text-4xl">My List</h1>
        <p className="text-sm text-muted-foreground">
          {items.length} saved {items.length === 1 ? "title" : "titles"}
        </p>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <Bookmark className="size-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">Your list is empty</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Save anything you want to watch later and it will show up here.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/browse">Browse the catalogue</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((t) => (
            <PosterCard key={t.id} title={t} onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  );
}
