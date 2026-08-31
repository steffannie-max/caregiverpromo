import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, RotateCcw } from "lucide-react";

interface Choice {
  label: string;
  next: string;
  tone: "strong" | "okay" | "weak";
}

interface Node {
  id: string;
  situation: string;
  coaching?: string;
  choices?: Choice[];
  ending?: string;
}

const nodes: Record<string, Node> = {
  start: {
    id: "start",
    situation:
      "You arrive for your afternoon shift. Mr. Alvarez, who lives with moderate dementia, is standing at the door with his coat on, insisting his wife is waiting outside. His wife died four years ago.",
    choices: [
      { label: "\"Your wife passed away, remember? Let's sit down.\"", next: "correct_reality", tone: "weak" },
      { label: "\"Tell me about her — where were you two headed today?\"", next: "join_world", tone: "strong" },
      { label: "Quietly take his coat and redirect him to the kitchen.", next: "redirect_only", tone: "okay" },
    ],
  },
  correct_reality: {
    id: "correct_reality",
    situation:
      "Mr. Alvarez becomes tearful and agitated. He tells you that you are lying and tries the door handle again.",
    coaching:
      "Correcting a person's reality re-delivers the loss each time. The distress is real even when the facts are not.",
    choices: [
      { label: "Repeat the facts more firmly.", next: "escalation", tone: "weak" },
      { label: "Apologize, lower your voice, and ask about his wife.", next: "join_world", tone: "strong" },
    ],
  },
  redirect_only: {
    id: "redirect_only",
    situation:
      "He follows you but keeps glancing at the door. Ten minutes later he is at the door again, more anxious than before.",
    coaching:
      "Redirection without acknowledgement can work briefly, but the unmet feeling underneath usually returns.",
    choices: [
      { label: "Redirect again with a snack.", next: "escalation", tone: "okay" },
      { label: "Sit with him and ask about his wife.", next: "join_world", tone: "strong" },
    ],
  },
  join_world: {
    id: "join_world",
    situation:
      "His shoulders drop. He describes Saturday drives to the coast and the sandwiches she packed. After a few minutes he asks if there is coffee.",
    coaching:
      "Validating the emotion — not the fact — met the real need: connection and safety. The behavior resolved on its own.",
    choices: [
      { label: "Make coffee together and note what you learned in the care log.", next: "best_ending", tone: "strong" },
    ],
  },
  escalation: {
    id: "escalation",
    ending:
      "Mr. Alvarez becomes more distressed and refuses care for the rest of the shift. Debrief with your supervisor: what feeling were you responding to?",
    situation: "The moment escalated.",
  },
  best_ending: {
    id: "best_ending",
    ending:
      "You de-escalated without medication or restriction, and you added information the whole care team can use tomorrow. This is trauma-informed, person-centered care in practice.",
    situation: "A calm, connected close to the shift.",
  },
};

const toneStyles: Record<Choice["tone"], string> = {
  strong: "hover:border-primary hover:bg-primary/5",
  okay: "hover:border-accent hover:bg-accent/10",
  weak: "hover:border-destructive/60 hover:bg-destructive/5",
};

export const BranchingScenario = ({ onComplete }: { onComplete?: () => void }) => {
  const [id, setId] = useState("start");
  const [path, setPath] = useState<string[]>(["start"]);
  const node = nodes[id];

  const go = (next: string) => {
    setId(next);
    setPath((p) => [...p, next]);
    if (nodes[next].ending) onComplete?.();
  };

  const reset = () => {
    setId("start");
    setPath(["start"]);
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-border bg-muted/50 px-6 py-4">
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Scenario · Step {path.length}
        </p>
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw className="mr-2 h-4 w-4" /> Restart
        </Button>
      </div>

      <div className="space-y-5 p-6">
        <p className="text-lg leading-relaxed text-foreground">{node.situation}</p>

        {node.coaching && (
          <div className="rounded-lg border-l-4 border-l-accent bg-accent/10 p-4">
            <p className="text-sm font-semibold text-foreground">Coaching note</p>
            <p className="mt-1 text-sm text-muted-foreground">{node.coaching}</p>
          </div>
        )}

        {node.ending ? (
          <div className="rounded-lg border-l-4 border-l-primary bg-primary/5 p-5">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Outcome</p>
            <p className="mt-2 leading-relaxed text-foreground">{node.ending}</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {node.choices?.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => go(c.next)}
                className={cn(
                  "flex items-center justify-between gap-4 rounded-lg border border-border p-4 text-left font-medium text-foreground transition-colors",
                  toneStyles[c.tone],
                )}
              >
                {c.label}
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
