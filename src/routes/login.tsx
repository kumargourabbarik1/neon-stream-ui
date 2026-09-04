import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthCard, SocialRow } from "@/components/movizo/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in to Movizo" },
      {
        name: "description",
        content:
          "Sign in to Movizo to pick up where you left off, sync your list and stream on any device.",
      },
      { property: "og:title", content: "Log in to Movizo" },
      {
        property: "og:description",
        content: "Sign in and pick up where you left off.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to keep watching."
      footer={
        <span className="text-muted-foreground">
          New here?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Create an account
          </Link>
        </span>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Signed in (demo)");
          navigate({ to: "/" });
        }}
      >
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" placeholder="you@example.com" className="bg-background" required />
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input type="password" placeholder="••••••••" className="bg-background" required />
        </div>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full rounded-full">
          Login
        </Button>
      </form>
      <SocialRow />
    </AuthCard>
  );
}
