import { Link } from "@tanstack/react-router";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-16">
      <img
        src="https://picsum.photos/seed/movizo-auth/1600/1000"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover opacity-15"
      />
      <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/95 to-background" />
      <div className="relative w-full max-w-md animate-rise rounded-2xl border border-border bg-surface/90 p-8 backdrop-blur">
        <Link to="/" className="font-display text-xl font-bold">
          MOV<span className="text-primary">IZO</span>
        </Link>
        <h1 className="mt-6 text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-6 space-y-4">{children}</div>
        {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
      </div>
    </div>
  );
}

export function SocialRow() {
  return (
    <>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or continue with
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {["Google", "Apple", "X"].map((p) => (
          <button
            key={p}
            type="button"
            className="rounded-lg border border-border bg-background py-2 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {p}
          </button>
        ))}
      </div>
    </>
  );
}
