import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { GENRES, TITLES, type Title, type TitleKind } from "@/lib/mock-data";
import { PosterCard, PosterSkeleton } from "./PosterCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019];
const STATUSES = ["Ongoing", "Completed"] as const;

export function BrowseView({
  kind,
  heading,
  description,
}: {
  kind?: TitleKind;
  heading: string;
  description: string;
}) {
  const [genres, setGenres] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(7);
  const [openFilters, setOpenFilters] = useState(false);

  const pool = useMemo(
    () => (kind ? TITLES.filter((t) => t.kind === kind) : TITLES),
    [kind],
  );

  const results = useMemo(
    () =>
      pool.filter(
        (t) =>
          (genres.length === 0 || t.genres.some((g) => genres.includes(g))) &&
          (years.length === 0 || years.includes(t.year)) &&
          (statuses.length === 0 || statuses.includes(t.status)) &&
          t.rating >= minRating,
      ),
    [pool, genres, years, statuses, minRating],
  );

  const toggle = <T,>(list: T[], set: (v: T[]) => void, value: T) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const reset = () => {
    setGenres([]);
    setYears([]);
    setStatuses([]);
    setMinRating(7);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold sm:text-4xl">{heading}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
      </header>

      <Button
        variant="outline"
        className="mb-4 lg:hidden"
        onClick={() => setOpenFilters((v) => !v)}
      >
        <SlidersHorizontal /> Filters
      </Button>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside
          className={cn(
            "h-max space-y-6 rounded-xl border border-border bg-surface/70 p-5 lg:sticky lg:top-24 lg:block",
            openFilters ? "block" : "hidden",
          )}
        >
          <FilterGroup label="Genre">
            {GENRES.map((g) => (
              <CheckRow
                key={g}
                label={g}
                checked={genres.includes(g)}
                onChange={() => toggle(genres, setGenres, g)}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="Year">
            {YEARS.map((y) => (
              <CheckRow
                key={y}
                label={String(y)}
                checked={years.includes(y)}
                onChange={() => toggle(years, setYears, y)}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="Status">
            {STATUSES.map((s) => (
              <CheckRow
                key={s}
                label={s}
                checked={statuses.includes(s)}
                onChange={() => toggle(statuses, setStatuses, s)}
              />
            ))}
          </FilterGroup>

          <div className="space-y-3">
            <p className="text-sm font-semibold">
              Minimum rating <span className="text-primary">{minRating.toFixed(1)}</span>
            </p>
            <Slider
              value={[minRating]}
              min={5}
              max={9.5}
              step={0.1}
              onValueChange={([v]) => setMinRating(v)}
            />
          </div>

          <Button variant="ghost" className="w-full" onClick={reset}>
            Reset filters
          </Button>
        </aside>

        <section>
          <p className="mb-4 text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? "title" : "titles"}
          </p>
          {results.length === 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
              {Array.from({ length: 5 }, (_, i) => (
                <PosterSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
              {results.map((t: Title) => (
                <PosterCard key={t.id} title={t} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{label}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      {label}
    </label>
  );
}
