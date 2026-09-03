import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { profile } from "@/lib/mock-data";

export const Route = createFileRoute("/_site/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Movizo" },
      {
        name: "description",
        content:
          "Manage your Movizo account details, notifications, playback quality, subtitle language and theme.",
      },
      { property: "og:title", content: "Settings — Movizo" },
      {
        property: "og:description",
        content: "Account, notifications, playback and appearance preferences.",
      },
    ],
  }),
  component: Settings,
});

function Settings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);
  const [newEpisodes, setNewEpisodes] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [darkTheme, setDarkTheme] = useState(true);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-24 sm:px-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Preferences are stored locally in this demo.
      </p>

      <form
        className="mt-8 space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Settings saved");
        }}
      >
        <Section title="Account">
          <Field label="Display name" defaultValue={profile.name} />
          <Field label="Email" type="email" defaultValue={profile.email} />
          <Field label="Password" type="password" defaultValue="••••••••••" />
        </Section>

        <Section title="Notifications">
          <Toggle
            label="Email alerts"
            hint="Weekly digest of new titles"
            checked={emailAlerts}
            onChange={setEmailAlerts}
          />
          <Toggle
            label="Push notifications"
            hint="Alerts on this device"
            checked={pushAlerts}
            onChange={setPushAlerts}
          />
          <Toggle
            label="New episode reminders"
            hint="For series in My List"
            checked={newEpisodes}
            onChange={setNewEpisodes}
          />
        </Section>

        <Section title="Playback">
          <Picker
            label="Default quality"
            options={["Auto", "480p", "720p", "1080p", "4K"]}
            defaultValue="1080p"
          />
          <Picker
            label="Subtitle language"
            options={["Off", "English", "Español", "日本語", "हिन्दी"]}
            defaultValue="English"
          />
          <Toggle
            label="Autoplay next episode"
            hint="Starts the next episode automatically"
            checked={autoplay}
            onChange={setAutoplay}
          />
        </Section>

        <Section title="Appearance">
          <Toggle
            label="Dark theme"
            hint="Movizo is designed dark-first"
            checked={darkTheme}
            onChange={(v) => {
              setDarkTheme(v);
              if (!v) toast("Light theme isn't part of this demo");
            }}
          />
        </Section>

        <div className="flex gap-3">
          <Button type="submit" className="rounded-full">
            Save changes
          </Button>
          <Button type="button" variant="ghost" className="rounded-full">
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="ml-auto rounded-full"
            onClick={() => toast.error("Account deletion is disabled in this demo")}
          >
            Delete account
          </Button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-surface p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  type = "text",
  defaultValue,
}: {
  label: string;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type={type} defaultValue={defaultValue} className="bg-background" />
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function Picker({
  label,
  options,
  defaultValue,
}: {
  label: string;
  options: string[];
  defaultValue: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select defaultValue={defaultValue}>
        <SelectTrigger className="bg-background">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
