import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Maximize,
  Pause,
  Play,
  Settings2,
  SkipBack,
  SkipForward,
  Subtitles,
  Volume2,
} from "lucide-react";
import { byId, episodesFor } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/watch/$id")({
  loader: ({ params }) => {
    const title = byId(params.id);
    if (!title) throw notFound();
    return { title };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Player unavailable — Movizo" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const t = loaderData.title;
    return {
      meta: [
        { title: `Watching ${t.name} — Movizo Player` },
        {
          name: "description",
          content: `Stream ${t.name} on Movizo with quality, subtitle and episode controls.`,
        },
        { property: "og:title", content: `Watching ${t.name} — Movizo Player` },
        {
          property: "og:description",
          content: `Stream ${t.name} on Movizo with full playback controls.`,
        },
      ],
    };
  },
  component: Player,
});

function Player() {
  const { title } = Route.useLoaderData();
  const episodes = episodesFor(title);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(34);
  const [quality, setQuality] = useState("1080p");
  const [subs, setSubs] = useState("English");
  const [volume, setVolume] = useState(70);
  const ep = episodes[current];

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-16 items-center gap-4 border-b border-border px-4 sm:px-6">
        <Link
          to="/title/$id"
          params={{ id: title.id }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" /> Back
        </Link>
        <span className="truncate font-display text-sm font-semibold">
          {title.name} · EP {ep.number}
        </span>
        <Link to="/" className="ml-auto font-display text-sm font-bold">
          MOV<span className="text-primary">IZO</span>
        </Link>
      </header>

      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="relative aspect-video">
              <img
                src={title.banner}
                alt={`${title.name} playback still`}
                className="size-full object-cover opacity-70"
              />
              <button
                type="button"
                aria-label={playing ? "Pause" : "Play"}
                onClick={() => setPlaying((p) => !p)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="flex size-16 items-center justify-center rounded-full bg-primary/90 text-primary-foreground transition-transform hover:scale-110">
                  {playing ? (
                    <Pause className="size-7 fill-current" />
                  ) : (
                    <Play className="size-7 fill-current" />
                  )}
                </span>
              </button>
            </div>

            <div className="space-y-3 border-t border-border p-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>12:04</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progress}
                  aria-label="Seek"
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-surface-2 accent-primary"
                  style={{
                    background: `linear-gradient(to right, var(--primary) ${progress}%, var(--surface-2) ${progress}%)`,
                  }}
                />
                <span>{ep.duration}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <ControlButton
                  label="Previous episode"
                  onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                >
                  <SkipBack className="size-4" />
                </ControlButton>
                <ControlButton
                  label={playing ? "Pause" : "Play"}
                  onClick={() => setPlaying((p) => !p)}
                  active
                >
                  {playing ? (
                    <Pause className="size-4 fill-current" />
                  ) : (
                    <Play className="size-4 fill-current" />
                  )}
                </ControlButton>
                <ControlButton
                  label="Next episode"
                  onClick={() =>
                    setCurrent((c) => Math.min(episodes.length - 1, c + 1))
                  }
                >
                  <SkipForward className="size-4" />
                </ControlButton>

                <div className="ml-2 flex items-center gap-2">
                  <Volume2 className="size-4 text-muted-foreground" />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    aria-label="Volume"
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-surface-2 accent-primary"
                  />
                </div>

                <div className="ml-auto flex flex-wrap items-center gap-2">
                  <SelectPill
                    icon={<Settings2 className="size-3.5" />}
                    value={quality}
                    options={["360p", "480p", "720p", "1080p", "4K"]}
                    onChange={setQuality}
                    label="Quality"
                  />
                  <SelectPill
                    icon={<Subtitles className="size-3.5" />}
                    value={subs}
                    options={["Off", "English", "Español", "日本語", "हिन्दी"]}
                    onChange={setSubs}
                    label="Subtitles"
                  />
                  <ControlButton label="Fullscreen">
                    <Maximize className="size-4" />
                  </ControlButton>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-xl font-bold">
              {ep.number}. {ep.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{ep.synopsis}</p>
          </div>
        </div>

        <aside className="h-max rounded-xl border border-border bg-surface">
          <p className="border-b border-border px-4 py-3 text-sm font-semibold">
            Episodes · {episodes.length}
          </p>
          <div className="max-h-[70vh] divide-y divide-border overflow-y-auto">
            {episodes.map((e, i) => (
              <button
                key={e.id}
                type="button"
                onClick={() => setCurrent(i)}
                className={cn(
                  "flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-surface-2",
                  i === current && "bg-surface-2",
                )}
              >
                <img
                  src={e.thumb}
                  alt={`Episode ${e.number} thumbnail`}
                  loading="lazy"
                  className="aspect-video w-24 shrink-0 rounded-md object-cover"
                />
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block truncate text-xs font-semibold",
                      i === current && "text-primary",
                    )}
                  >
                    {e.number}. {e.title}
                  </span>
                  <span className="text-xs text-muted-foreground">{e.duration}</span>
                </span>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function ControlButton({
  children,
  label,
  onClick,
  active,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex size-9 items-center justify-center rounded-full border border-border transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:border-primary hover:text-primary",
      )}
    >
      {children}
    </button>
  );
}

function SelectPill({
  icon,
  value,
  options,
  onChange,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1.5 text-xs text-muted-foreground focus-within:border-primary">
      {icon}
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-xs outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-surface text-foreground">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
