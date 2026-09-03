import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/movizo/Navbar";
import { Footer } from "@/components/movizo/Footer";

export const Route = createFileRoute("/_site")({
  component: SiteLayout,
});

function SiteLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
