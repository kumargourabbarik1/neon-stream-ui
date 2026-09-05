import { createFileRoute, Link } from "@tanstack/react-router";
import { profile, continueWatching } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/movizo/badges";
import { Row } from "@/components/movizo/Row";

export const Route = createFileRoute("/_site/profile")({
  head: () => ({
    meta: [
      { title: "Your Movizo Profile" },
      {
        name: "description",
        content:
          "Your Movizo profile: watch stats, favourite genres, membership tier and what you're part-way through.",
      },
      { property: "og:title", content: "Your Movizo Profile" },
      {
        property: "og:description",
        content: "Watch stats, favourite genres and your current progress.",
      },
    ],
  }),
  component: Profile,
});

function Profile() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6">
      <section className="flex flex-col items-start gap-6 rounded-xl border border-border bg-surface p-6 sm:flex-row sm:items-center">
        <Avatar className="size-24 border-2 border-primary/50">
          <AvatarImage src={profile.avatar} alt={`${profile.name} avatar`} />
          <AvatarFallback>SP</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-sm text-muted-foreground">
            {profile.handle} · {profile.email}
          </p>
          <Chip className="border-primary/50 text-primary">{profile.member}</Chip>
        </div>
        <Button asChild variant="outline" className="rounded-full sm:ml-auto">
          <Link to="/settings">Edit profile</Link>
        </Button>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {profile.stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-surface p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-primary">{s.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-bold">Favourite genres</h2>
        <div className="flex flex-wrap gap-2">
          {profile.favouriteGenres.map((g) => (
            <Chip key={g} className="border-primary/40 text-primary">
              {g}
            </Chip>
          ))}
        </div>
      </section>

      <div className="mt-12">
        <Row heading="Continue Watching" titles={continueWatching} showProgress />
      </div>
    </div>
  );
}
