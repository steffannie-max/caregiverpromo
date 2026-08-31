import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FlipCard } from "@/components/showcase/FlipCard";
import { KnowledgeCheck, QuizQuestion } from "@/components/showcase/KnowledgeCheck";
import { BranchingScenario } from "@/components/showcase/BranchingScenario";
import { Certificate } from "@/components/showcase/Certificate";
import placard from "@/assets/showcase-email-placard.jpg";
import teaser from "@/assets/showcase-teaser.mp4.asset.json";
import {
  HeartHandshake,
  ShieldCheck,
  Users,
  Clipboard,
  Check,
  Play,
  Mail,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const glossary = [
  {
    term: "Compassion fatigue",
    definition:
      "The gradual emotional flattening that comes from absorbing others' distress. It shows up as numbness or irritability long before a caregiver names it as burnout.",
  },
  {
    term: "Person-centered care",
    definition:
      "Care organized around what matters to the individual — routines, relationships, preferences — rather than around task lists and shift efficiency.",
  },
  {
    term: "Validation",
    definition:
      "Responding to the feeling a person is expressing instead of debating the facts. Especially effective with dementia-related distress.",
  },
  {
    term: "Respite",
    definition:
      "Planned, temporary relief for a primary caregiver. Preventive, not a last resort — respite used early reduces crisis placements.",
  },
  {
    term: "Boundary setting",
    definition:
      "Naming clearly what you can and cannot do in a role. Boundaries protect continuity of care; they are not a withdrawal of compassion.",
  },
  {
    term: "Trauma-informed care",
    definition:
      "Practice that assumes a history of trauma may be present and prioritizes safety, choice, collaboration, and trust in every interaction.",
  },
];

const quiz: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "A caregiver says they feel \"nothing at all\" during difficult visits. What is the most likely explanation?",
    options: [
      {
        label: "They have become skilled at staying professional.",
        feedback:
          "Emotional distance can look like professionalism, but a sudden absence of feeling is a warning sign, not a skill.",
      },
      {
        label: "Early compassion fatigue.",
        correct: true,
        feedback:
          "Numbing is one of the earliest and most missed indicators of compassion fatigue. It warrants support, not a performance conversation.",
      },
      {
        label: "They are not suited to caregiving work.",
        feedback:
          "This framing pushes caregivers out of the workforce. Fatigue is an occupational injury, not a character trait.",
      },
    ],
  },
  {
    id: "q2",
    prompt: "Which response best reflects trauma-informed practice when a client refuses a shower?",
    options: [
      {
        label: "Explain that hygiene is required and complete the task.",
        feedback: "Overriding refusal removes choice — the element trauma-informed care protects most carefully.",
      },
      {
        label: "Document the refusal and move on without follow-up.",
        feedback: "Documentation matters, but stopping there leaves an unmet need unexplored.",
      },
      {
        label: "Offer choices about timing, temperature, and who assists.",
        correct: true,
        feedback:
          "Restoring choice and predictability often resolves refusal without any confrontation, and it preserves trust for the next shift.",
      },
    ],
  },
  {
    id: "q3",
    prompt: "When is respite most effective for a family caregiver?",
    options: [
      {
        label: "Scheduled regularly before a crisis appears.",
        correct: true,
        feedback: "Routine respite is preventive care. It measurably delays placement and reduces caregiver illness.",
      },
      {
        label: "After the caregiver reports being unable to continue.",
        feedback: "By that point options have narrowed, and decisions are made under pressure.",
      },
      {
        label: "Only when a medical provider orders it.",
        feedback: "Respite does not require an order; waiting for one delays relief.",
      },
    ],
  },
];

const modules = [
  {
    icon: HeartHandshake,
    title: "Recognizing compassion fatigue",
    minutes: "12 min",
    blurb:
      "The early signals caregivers minimize — numbness, dread before shifts, sleep that does not restore — and what a supervisor can do in the first conversation.",
  },
  {
    icon: ShieldCheck,
    title: "Boundaries that hold",
    minutes: "15 min",
    blurb:
      "Scripts for declining out-of-scope requests, handling family pressure, and documenting limits without damaging the relationship.",
  },
  {
    icon: Users,
    title: "Communication under stress",
    minutes: "18 min",
    blurb:
      "Validation, redirection, and de-escalation practiced against realistic dementia-care moments, with coaching on every choice.",
  },
];

const sections = [
  { id: "overview", label: "Overview" },
  { id: "modules", label: "Modules" },
  { id: "glossary", label: "Key terms" },
  { id: "check", label: "Knowledge check" },
  { id: "scenario", label: "Scenario" },
  { id: "reflect", label: "Reflection" },
  { id: "certificate", label: "Certificate" },
  { id: "assets", label: "Promo kit" },
];

const Showcase = () => {
  const [quizDone, setQuizDone] = useState(false);
  const [scenarioDone, setScenarioDone] = useState(false);
  const [reflection, setReflection] = useState("");
  const [active, setActive] = useState("overview");
  const [copied, setCopied] = useState<string | null>(null);

  const progress = useMemo(() => {
    let done = 1;
    if (quizDone) done += 1;
    if (scenarioDone) done += 1;
    if (reflection.trim().length > 20) done += 1;
    return Math.round((done / 4) * 100);
  }, [quizDone, scenarioDone, reflection]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const embedCode = `<iframe src="${window.location.origin}/showcase" width="100%" height="900" style="border:0" title="Caregiver Support Essentials demo"></iframe>`;
  const emailHtml = `<a href="${window.location.origin}/showcase"><img src="${window.location.origin}${placard}" alt="Caregiver Support Essentials — interactive training demo" width="600" style="max-width:100%;border:0" /></a>`;

  const copy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="showcase-theme min-h-screen bg-background">
      {/* Sticky progress nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-5 py-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-bold tracking-tight text-primary">
              Caregiver Support Essentials
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              {progress}% complete
            </span>
          </div>
          <Progress value={progress} className="mt-2 h-1.5" />
          <nav className="mt-3 flex gap-1 overflow-x-auto pb-1">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active === s.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="overview" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-primary)] opacity-[0.08]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.1fr_1fr] md:items-center md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Sample interactive module
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-primary md:text-6xl">
              Caregiver Support Essentials
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-foreground">
              A working demonstration built for Oregon Care Partners: burnout, boundaries, and
              trauma-informed communication, taught the way adults actually learn — decisions
              first, coaching immediately after.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <a href="#modules">
                  Start the demo <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#assets">
                  <Mail className="mr-2 h-4 w-4" /> Promo kit for email
                </a>
              </Button>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-6">
              {[
                ["45 min", "Full module"],
                ["1.0", "Contact hour"],
                ["4", "Interactive steps"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="text-2xl font-black text-primary">{v}</dt>
                  <dd className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {l}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <Card className="overflow-hidden border-2 border-primary/20 shadow-xl">
            <video
              src={teaser.url}
              className="aspect-video w-full bg-muted object-cover"
              controls
              playsInline
              poster={placard}
            />
            <div className="p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Play className="h-4 w-4 text-accent" /> 10-second course teaser
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Drop this clip or the still placard into an outreach email.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
          What the full course covers
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Three lessons, each ending in a decision the caregiver has to make out loud.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {modules.map((m) => (
            <Card key={m.title} className="flex flex-col p-6 transition-shadow hover:shadow-lg">
              <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <m.icon className="h-5 w-5 text-primary" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-accent-foreground/70">
                {m.minutes}
              </span>
              <h3 className="mt-2 text-xl font-bold text-foreground">{m.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.blurb}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Glossary */}
      <section id="glossary" className="bg-muted/40 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Key terms — tap a card
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Definitions written for direct-care staff, not for a textbook.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {glossary.map((g) => (
              <FlipCard key={g.term} {...g} />
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge check */}
      <section id="check" className="mx-auto max-w-4xl px-5 py-16">
        <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Knowledge check
        </h2>
        <p className="mt-3 text-muted-foreground">
          Every option gives feedback — including the wrong ones.
        </p>
        <div className="mt-10">
          <KnowledgeCheck questions={quiz} onComplete={() => setQuizDone(true)} />
        </div>
      </section>

      {/* Scenario */}
      <section id="scenario" className="bg-muted/40 py-16">
        <div className="mx-auto max-w-4xl px-5">
          <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Branching scenario
          </h2>
          <p className="mt-3 text-muted-foreground">
            One shift, several paths. Choices carry consequences and coaching.
          </p>
          <div className="mt-10">
            <BranchingScenario onComplete={() => setScenarioDone(true)} />
          </div>
        </div>
      </section>

      {/* Reflection */}
      <section id="reflect" className="mx-auto max-w-4xl px-5 py-16">
        <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
          (OPTIONAL) Reflection
        </h2>
        <Card className="mt-8 p-6">
          <Label htmlFor="reflect-input" className="text-base font-semibold">
            Name one boundary you want to hold more firmly this month, and what would make it
            easier.
          </Label>
          <Textarea
            id="reflect-input"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Type your response…"
            className="mt-4 min-h-[140px]"
          />
          <p className="mt-3 text-xs text-muted-foreground">
            Stays on your device in this demo — nothing is submitted.
          </p>
        </Card>
      </section>

      {/* Certificate */}
      <section id="certificate" className="bg-muted/40 py-16">
        <div className="mx-auto max-w-4xl px-5">
          <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Certificate of completion
          </h2>
          <p className="mt-3 text-muted-foreground">
            Unlocks once the knowledge check and scenario are finished.
          </p>
          <div className="mt-10">
            <Certificate unlocked={quizDone && scenarioDone} />
          </div>
        </div>
      </section>

      {/* Promo kit */}
      <section id="assets" className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Promo kit for email
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          A ready placard, a teaser video, and copy-paste snippets for outreach or an LMS page.
        </p>

        <Card className="mt-8 overflow-hidden">
          <img
            src={placard}
            alt="Caregiver Support Essentials email placard with a teal and amber illustration of hands holding a heart"
            width={1600}
            height={848}
            loading="lazy"
            className="w-full"
          />
        </Card>

        <div className="mt-6 grid gap-4">
          {[
            { key: "email", title: "Clickable placard for an email", code: emailHtml },
            { key: "embed", title: "Embed the demo in a page or LMS", code: embedCode },
          ].map((s) => (
            <Card key={s.key} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <p className="font-semibold text-foreground">{s.title}</p>
                <Button size="sm" variant="outline" onClick={() => copy(s.key, s.code)}>
                  {copied === s.key ? (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Copied
                    </>
                  ) : (
                    <>
                      <Clipboard className="mr-2 h-4 w-4" /> Copy
                    </>
                  )}
                </Button>
              </div>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 text-xs leading-relaxed text-muted-foreground">
                <code>{s.code}</code>
              </pre>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 text-sm text-muted-foreground">
          <p>Sample module by Steffannie Roache, MSW — built for Oregon Care Partners review.</p>
          <Link to="/" className="font-semibold text-primary hover:underline">
            Back to the lenses presentation
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Showcase;
