import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Movizo Admin Sign In" },
      {
        name: "description",
        content:
          "Restricted sign-in for Movizo staff managing catalogue content, users and moderation queues.",
      },
      { property: "og:title", content: "Movizo Admin Sign In" },
      {
        property: "og:description",
        content: "Restricted access for Movizo staff.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm animate-rise rounded-2xl border border-border bg-surface p-8">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" />
          <span className="font-display text-sm font-bold tracking-wide">
            MOVIZO <span className="text-primary">ADMIN</span>
          </span>
        </div>
        <h1 className="mt-6 text-xl font-bold">Restricted access</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Staff credentials required. All actions are logged.
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Signed in as admin (demo)");
            navigate({ to: "/admin/dashboard" });
          }}
        >
          <div className="space-y-2">
            <Label>Work email</Label>
            <Input
              type="email"
              placeholder="you@movizo.tv"
              className="bg-background"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" placeholder="••••••••" className="bg-background" required />
          </div>
          <div className="space-y-2">
            <Label>2FA code</Label>
            <Input placeholder="123 456" className="bg-background" inputMode="numeric" />
          </div>
          <Button type="submit" className="w-full rounded-full">
            Sign in
          </Button>
        </form>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Back to Movizo
          </Link>
        </p>
      </div>
    </div>
  );
}
