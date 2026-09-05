import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_site/contact")({
  head: () => ({
    meta: [
      { title: "Contact Movizo Support" },
      {
        name: "description",
        content:
          "Questions about playback, billing or licensing? Send the Movizo team a message and we'll reply within a day.",
      },
      { property: "og:title", content: "Contact Movizo Support" },
      {
        property: "og:description",
        content: "Reach the Movizo team about playback, billing or licensing.",
      },
    ],
  }),
  component: Contact,
});

const INFO = [
  { icon: Mail, label: "support@movizo.tv", sub: "Replies within 24 hours" },
  { icon: Phone, label: "+1 (555) 018-2244", sub: "Mon–Fri, 9am–6pm" },
  { icon: MapPin, label: "44 Lantern Street, Kyoto", sub: "Studio & offices" },
  { icon: MessageCircle, label: "Live chat", sub: "Premium members only" },
];

function Contact() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-24 sm:px-6">
      <h1 className="text-3xl font-bold sm:text-4xl">Contact us</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Tell us what's going on and we'll get back to you.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <form
          className="space-y-4 rounded-xl border border-border bg-surface p-6"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Message sent — we'll be in touch");
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input placeholder="Your name" className="bg-background" required />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                className="bg-background"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input placeholder="What's this about?" className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea rows={6} placeholder="Tell us more…" className="bg-background" />
          </div>
          <Button type="submit" className="rounded-full">
            Send message
          </Button>
        </form>

        <aside className="h-max space-y-4 rounded-xl border border-border bg-surface p-6">
          {INFO.map((i) => (
            <div key={i.label} className="flex gap-3">
              <i.icon className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium">{i.label}</p>
                <p className="text-xs text-muted-foreground">{i.sub}</p>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
