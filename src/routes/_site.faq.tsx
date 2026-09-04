import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_site/faq")({
  head: () => ({
    meta: [
      { title: "Help Center & FAQ — Movizo" },
      {
        name: "description",
        content:
          "Answers to common Movizo questions about plans, downloads, subtitles, device limits, playback quality and cancellation.",
      },
      { property: "og:title", content: "Help Center & FAQ — Movizo" },
      {
        property: "og:description",
        content: "Plans, downloads, subtitles, devices and playback answers.",
      },
    ],
  }),
  component: Faq,
});

const QA = [
  {
    q: "What's included in a Movizo plan?",
    a: "Every plan includes the full catalogue with no ad breaks. Standard streams at 1080p on two devices; Premium adds 4K, downloads and four simultaneous streams.",
  },
  {
    q: "Can I download episodes for offline viewing?",
    a: "Premium members can download up to 100 episodes at a time on mobile. Downloads stay available for 30 days, or 48 hours once you start watching.",
  },
  {
    q: "Which subtitle languages are available?",
    a: "Most titles ship with English, Spanish, Japanese and Hindi subtitles. Simulcast episodes get subtitles within an hour of the Japanese broadcast.",
  },
  {
    q: "How many devices can I use?",
    a: "You can register up to six devices per account. Simultaneous streams depend on your tier — one on Free, two on Standard, four on Premium.",
  },
  {
    q: "Why does playback drop to a lower quality?",
    a: "Our player adapts to your connection to avoid buffering. You can pin a fixed quality from the player controls or in Settings → Playback.",
  },
  {
    q: "How do I cancel?",
    a: "Settings → Account → Manage plan → Cancel. It takes two clicks, there's no retention maze, and you keep access until the end of the billing period.",
  },
];

function Faq() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-24 sm:px-6">
      <h1 className="text-3xl font-bold sm:text-4xl">Help center</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The questions we get most often.
      </p>

      <Accordion type="single" collapsible className="mt-8">
        {QA.map((item) => (
          <AccordionItem key={item.q} value={item.q} className="border-border">
            <AccordionTrigger className="text-left text-sm hover:text-primary">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-10 rounded-xl border border-border bg-surface p-6 text-center">
        <p className="text-sm text-muted-foreground">Still stuck?</p>
        <Button asChild className="mt-4 rounded-full">
          <Link to="/contact">Contact support</Link>
        </Button>
      </div>
    </div>
  );
}
