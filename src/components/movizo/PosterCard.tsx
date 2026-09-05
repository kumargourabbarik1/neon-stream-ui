import { Link } from "@tanstack/react-router";
import { Play, X } from "lucide-react";
import type { Title } from "@/lib/mock-data";
import { EpisodeBadge, RatingBadge } from "./badges";
import { cn } from "@/lib/utils";

export function PosterCard({
  title,
  progress,
  onRemove,
  className,
}: {
  title: Title;
  progress?: number;
  onRemove?: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("group relative", className)}>
      <Link
        to="/title/$id"
        params={{ id: title.id }}
        className="block overflow-hidden rounded-xl border border-border bg-surface hover-lift"
      >
        <div className="relative aspect-2/3 overflow-hidden">
          <img
            src={title.poster}
            alt={`${title.name} poster art`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/10 to-transparent" />
          <div className="absolute left-2 top-2">
            <RatingBadge value={title.rating} />
          </div>
          <div className="absolute right-2 top-2">
            <EpisodeBadge count={title.episodes} kind={title.kind} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <Play className="size-5 fill-current" />
            </span>
          </div>
          {progress != null && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-surface-2">
              <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
        <div className="space-y-1 p-3">
          <h3 className="truncate text-sm font-semibold text-foreground">{title.name}</h3>
          <p className="truncate text-xs text-muted-foreground">
            {title.year} · {title.genres.join(", ")}
          </p>
        </div>
      </Link>
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove ${title.name} from my list`}
          onClick={() => onRemove(title.id)}
          className="absolute right-2 top-2 z-10 hidden size-7 items-center justify-center rounded-full bg-destructive text-destructive-foreground transition-transform hover:scale-110 group-hover:flex"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

export function PosterSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="aspect-2/3 bg-surface-2 shimmer" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-3/4 rounded bg-surface-2 shimmer" />
        <div className="h-3 w-1/2 rounded bg-surface-2 shimmer" />
      </div>
    </div>
  );
}
