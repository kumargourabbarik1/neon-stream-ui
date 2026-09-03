import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Play, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Title } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Chip, EpisodeBadge, RatingBadge, TrendingBadge } from "./badges";
import { cn } from "@/lib/utils";

export function Hero({ slides }: { slides: Title[] }) {
  const [index, setIndex] = useState(0);
  const active = slides[index];

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(id);
  }, [slides.length]);

  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + slides.length) % slides.length);

  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
      {slides.map((s, i) => (
        <img
          key={s.id}
          src={s.banner}
          alt={`${s.name} key art`}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-700",
            i === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div className="absolute inset-0 bg-linear-to-r from-background via-background/80 to-background/10" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background to-transparent" />

      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center gap-5 px-4 pt-16 sm:px-6">
        <div key={active.id} className="max-w-2xl animate-rise space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <TrendingBadge />
            <RatingBadge value={active.rating} />
            <EpisodeBadge count={active.episodes} kind={active.kind} />
          </div>
          <h1 className="text-4xl font-bold leading-tight sm:text-6xl">{active.name}</h1>
          <div className="flex flex-wrap gap-2">
            <Chip>Season {active.seasons}</Chip>
            {active.genres.map((g) => (
              <Chip key={g}>{g}</Chip>
            ))}
            <Chip>{active.year}</Chip>
            <Chip>{active.status}</Chip>
          </div>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
            {active.synopsis}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/watch/$id" params={{ id: active.id }}>
                <Play className="fill-current" /> Watch Now
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-primary/60 text-primary hover:bg-primary/10 hover:text-primary"
              onClick={() => toast.success(`${active.name} added to My List`)}
            >
              <Plus /> My List
            </Button>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            aria-label="Previous highlight"
            onClick={() => go(-1)}
            className="flex size-10 items-center justify-center rounded-full border border-primary/70 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next highlight"
            onClick={() => go(1)}
            className="flex size-10 items-center justify-center rounded-full border border-primary/70 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="flex gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Show ${s.name}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-8 bg-primary" : "w-4 bg-muted",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
