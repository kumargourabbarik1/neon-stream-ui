import { Flame, Layers, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold backdrop-blur";

export function RatingBadge({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn(base, "bg-background/70 text-star", className)}>
      <Star className="size-3 fill-star text-star" />
      {value.toFixed(1)}
    </span>
  );
}

export function EpisodeBadge({
  count,
  kind,
  className,
}: {
  count: number;
  kind?: string;
  className?: string;
}) {
  return (
    <span className={cn(base, "bg-background/70 text-muted-foreground", className)}>
      <Layers className="size-3" />
      {kind === "movie" ? "Movie" : `${count} EP`}
    </span>
  );
}

export function TrendingBadge({ className }: { className?: string }) {
  return (
    <span className={cn(base, "bg-flame text-flame-foreground", className)}>
      <Flame className="size-3" />
      Trending
    </span>
  );
}

export function Chip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface-2/60 px-3 py-1 text-xs text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
