import { useState } from "react";
import { Link, Outlet } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  ChevronLeft,
  Film,
  FileClock,
  Flag,
  LayoutDashboard,
  ListTree,
  Settings,
  ShieldCheck,
  Users,
  UserCog,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { profile } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/content", label: "Content", icon: Film },
  { to: "/admin/genres", label: "Genres", icon: ListTree },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/reports", label: "Reports", icon: Flag },
] as const;

const SUPER_NAV = [
  { to: "/super-admin/dashboard", label: "Overview", icon: BarChart3 },
  { to: "/super-admin/admins", label: "Admins", icon: UserCog },
  { to: "/super-admin/settings", label: "Site settings", icon: Settings },
  { to: "/super-admin/audit-logs", label: "Audit logs", icon: FileClock },
] as const;

export function AdminShell() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 md:flex",
          collapsed ? "w-16" : "w-60",
        )}
      >
        <div className="flex h-16 items-center gap-2 px-4">
          <ShieldCheck className="size-5 shrink-0 text-primary" />
          {!collapsed && (
            <span className="font-display text-sm font-bold tracking-wide">
              MOVIZO <span className="text-primary">ADMIN</span>
            </span>
          )}
        </div>

        <NavSection label="Management" items={ADMIN_NAV} collapsed={collapsed} />
        <NavSection label="Super admin" items={SUPER_NAV} collapsed={collapsed} />

        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="mt-auto flex items-center gap-2 border-t border-sidebar-border px-4 py-3 text-xs text-sidebar-foreground hover:text-primary"
        >
          <ChevronLeft
            className={cn("size-4 transition-transform", collapsed && "rotate-180")}
          />
          {!collapsed && "Collapse"}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
          <Link to="/" className="font-display text-sm font-bold">
            MOV<span className="text-primary">IZO</span>
          </Link>
          <span className="hidden text-xs text-muted-foreground sm:block">
            Control panel
          </span>
          <div className="ml-auto flex items-center gap-3">
            <button
              aria-label="Notifications"
              className="relative flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"
            >
              <Bell className="size-4" />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-flame" />
            </button>
            <Avatar className="size-9 border border-primary/40">
              <AvatarImage src={profile.avatar} alt="Admin avatar" />
              <AvatarFallback>RK</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex gap-2 overflow-x-auto border-b border-border px-4 py-2 md:hidden">
          {[...ADMIN_NAV, ...SUPER_NAV].map((i) => (
            <Link
              key={i.to}
              to={i.to}
              activeProps={{ className: "text-primary border-primary" }}
              className="shrink-0 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
            >
              {i.label}
            </Link>
          ))}
        </div>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavSection({
  label,
  items,
  collapsed,
}: {
  label: string;
  items: readonly { to: string; label: string; icon: React.ElementType }[];
  collapsed: boolean;
}) {
  return (
    <div className="px-2 py-3">
      {!collapsed && (
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
      )}
      <div className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeProps={{
              className: "bg-sidebar-accent text-sidebar-accent-foreground",
            }}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            title={item.label}
          >
            <item.icon className="size-4 shrink-0" />
            {!collapsed && item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 transition-shadow hover:glow-primary">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {delta && <p className="mt-1 text-xs text-primary">{delta}</p>}
    </div>
  );
}
