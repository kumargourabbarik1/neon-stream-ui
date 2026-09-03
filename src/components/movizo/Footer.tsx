import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface/50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="space-y-3">
          <span className="font-display text-lg font-bold">
            MOV<span className="text-primary">IZO</span>
          </span>
          <p className="text-sm text-muted-foreground">
            Anime and movies, streamed in one place. A design demo built with mock data.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Browse</p>
          <Link to="/series" className="block text-muted-foreground hover:text-primary">
            Series
          </Link>
          <Link to="/movies" className="block text-muted-foreground hover:text-primary">
            Movies
          </Link>
          <Link to="/genres" className="block text-muted-foreground hover:text-primary">
            Genres
          </Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Company</p>
          <Link to="/about" className="block text-muted-foreground hover:text-primary">
            About us
          </Link>
          <Link to="/contact" className="block text-muted-foreground hover:text-primary">
            Contact
          </Link>
          <Link to="/faq" className="block text-muted-foreground hover:text-primary">
            Help center
          </Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Account</p>
          <Link to="/login" className="block text-muted-foreground hover:text-primary">
            Login
          </Link>
          <Link to="/signup" className="block text-muted-foreground hover:text-primary">
            Sign up
          </Link>
          <Link to="/settings" className="block text-muted-foreground hover:text-primary">
            Settings
          </Link>
        </div>
      </div>
      <div className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground">
        © 2026 Movizo. All artwork is placeholder imagery.
      </div>
    </footer>
  );
}
