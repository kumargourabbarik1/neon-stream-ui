import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_site/about")({
  head: () => ({
    meta: [
      { title: "About Movizo — Our Story" },
      {
        name: "description",
        content:
          "Movizo is built by a small crew of animation obsessives who wanted a calmer, faster way to watch anime and films.",
      },
      { property: "og:title", content: "About Movizo — Our Story" },
      {
        property: "og:description",
        content: "Why we built a calmer, faster home for anime and film.",
      },
    ],
  }),
  component: About,
});

const TEAM = [
  { name: "Rin Kobayashi", role: "Founder & Curation" },
  { name: "Daniel Cruz", role: "Head of Engineering" },
  { name: "Mei Watanabe", role: "Design Lead" },
  { name: "Jonas Weber", role: "Licensing" },
];

function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-24 sm:px-6">
      <h1 className="text-3xl font-bold sm:text-5xl">
        We're here for the <span className="text-primary">good stuff</span>
      </h1>
      <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Movizo started as a shared spreadsheet of series worth finishing. It grew into a
        streaming experience built around one belief: finding something great to watch
        should take seconds, not a scroll marathon.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          {
            t: "Our mission",
            d: "Put curation first. Every row on Movizo is picked by people who actually finished the show.",
          },
          {
            t: "Our craft",
            d: "A player that stays out of the way, subtitles that look intentional, and artwork shown at full quality.",
          },
          {
            t: "Our promise",
            d: "No autoplaying trailers, no dark patterns on cancellation, no ads mid-episode. Ever.",
          },
        ].map((c) => (
          <div key={c.t} className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-display text-lg font-semibold text-primary">{c.t}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-14 text-2xl font-bold">The team</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TEAM.map((m, i) => (
          <div
            key={m.name}
            className="overflow-hidden rounded-xl border border-border bg-surface text-center hover-lift"
          >
            <img
              src={`https://picsum.photos/seed/movizo-team-${i}/400/400`}
              alt={`${m.name}, ${m.role}`}
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
            <div className="p-4">
              <p className="text-sm font-semibold">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
