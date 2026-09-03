import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Title } from "@/lib/mock-data";
import { PosterCard } from "./PosterCard";

export function Row({
  heading,
  titles,
  showProgress,
}: {
  heading: string;
  titles: Title[];
  showProgress?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * 600, behavior: "smooth" });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold sm:text-2xl">{heading}</h2>
        <div className="flex gap-2">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              aria-label={dir === -1 ? `Scroll ${heading} left` : `Scroll ${heading} right`}
              onClick={() => scrollBy(dir)}
              className="flex size-9 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {dir === -1 ? (
                <ChevronLeft className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </button>
          ))}
        </div>
      </div>
      <div
        ref={ref}
        className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {titles.map((t) => (
          <PosterCard
            key={t.id}
            title={t}
            progress={showProgress ? t.progress : undefined}
            className="w-[150px] shrink-0 sm:w-[180px]"
          />
        ))}
      </div>
    </section>
  );
}
