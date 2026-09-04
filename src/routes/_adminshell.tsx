import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/movizo/AdminShell";

export const Route = createFileRoute("/_adminshell")({
  component: AdminShell,
});
