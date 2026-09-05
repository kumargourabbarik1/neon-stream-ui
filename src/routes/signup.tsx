import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthCard, SocialRow } from "@/components/movizo/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your Movizo account" },
      {
        name: "description",
        content:
          "Join Movizo for ad-free anime and film streaming, personalised rows and a watchlist that follows you.",
      },
      { property: "og:title", content: "Create your Movizo account" },
      {
        property: "og:description",
        content: "Ad-free anime and film streaming, personalised to you.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  return (
    <AuthCard
      title="Create your account"
      subtitle="Two minutes and you're watching."
      footer={
        <span className="text-muted-foreground">
          Already a member?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </span>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Account created (demo)");
          navigate({ to: "/" });
        }}
      >
        <div className="space-y-2">
          <Label>Full name</Label>
          <Input placeholder="Your name" className="bg-background" required />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" placeholder="you@example.com" className="bg-background" required />
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input type="password" placeholder="••••••••" className="bg-background" required />
        </div>
        <div className="space-y-2">
          <Label>Confirm password</Label>
          <Input type="password" placeholder="••••••••" className="bg-background" required />
        </div>
        <Button type="submit" className="w-full rounded-full">
          Create account
        </Button>
      </form>
      <SocialRow />
    </AuthCard>
  );
}
