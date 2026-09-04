import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthCard } from "@/components/movizo/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your Movizo password" },
      {
        name: "description",
        content:
          "Enter the email on your Movizo account and we'll send a secure link to reset your password.",
      },
      { property: "og:title", content: "Reset your Movizo password" },
      {
        property: "og:description",
        content: "We'll email you a secure password reset link.",
      },
    ],
  }),
  component: ForgotPassword,
});

function ForgotPassword() {
  return (
    <AuthCard
      title="Forgot password"
      subtitle="We'll email you a reset link."
      footer={
        <Link to="/login" className="text-primary hover:underline">
          Back to login
        </Link>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Reset link sent (demo)");
        }}
      >
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" placeholder="you@example.com" className="bg-background" required />
        </div>
        <Button type="submit" className="w-full rounded-full">
          Send reset link
        </Button>
      </form>
    </AuthCard>
  );
}
