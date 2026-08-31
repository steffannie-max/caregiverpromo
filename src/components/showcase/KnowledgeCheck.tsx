import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, X, HelpCircle } from "lucide-react";

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: { label: string; correct?: boolean; feedback: string }[];
}

interface KnowledgeCheckProps {
  questions: QuizQuestion[];
  onComplete?: () => void;
}

export const KnowledgeCheck = ({ questions, onComplete }: KnowledgeCheckProps) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const select = (qid: string, idx: number) => {
    if (answers[qid] !== undefined) return;
    const next = { ...answers, [qid]: idx };
    setAnswers(next);
    if (Object.keys(next).length === questions.length) onComplete?.();
  };

  const score = questions.filter(
    (q) => answers[q.id] !== undefined && q.options[answers[q.id]].correct,
  ).length;

  return (
    <div className="space-y-6">
      {questions.map((q, qi) => {
        const chosen = answers[q.id];
        return (
          <Card key={q.id} className="p-6">
            <div className="mb-4 flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {qi + 1}
              </span>
              <p className="text-lg font-semibold text-foreground">{q.prompt}</p>
            </div>
            <div className="grid gap-3">
              {q.options.map((opt, oi) => {
                const isChosen = chosen === oi;
                const revealed = chosen !== undefined;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    disabled={revealed}
                    onClick={() => select(q.id, oi)}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-4 text-left transition-colors",
                      !revealed && "border-border hover:border-primary hover:bg-primary/5",
                      revealed && opt.correct && "border-primary bg-primary/10",
                      revealed && isChosen && !opt.correct && "border-destructive bg-destructive/10",
                      revealed && !isChosen && !opt.correct && "border-border opacity-60",
                    )}
                  >
                    <span className="mt-0.5">
                      {revealed && opt.correct ? (
                        <Check className="h-5 w-5 text-primary" />
                      ) : revealed && isChosen ? (
                        <X className="h-5 w-5 text-destructive" />
                      ) : (
                        <HelpCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </span>
                    <span>
                      <span className="block font-medium text-foreground">{opt.label}</span>
                      {revealed && (isChosen || opt.correct) && (
                        <span className="mt-1 block text-sm text-muted-foreground">
                          {opt.feedback}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        );
      })}

      <Card className="flex flex-wrap items-center justify-between gap-4 bg-muted/50 p-5">
        <p className="font-semibold text-foreground">
          Score: {score} of {questions.length} correct
        </p>
        <Button variant="outline" onClick={() => setAnswers({})}>
          Try again
        </Button>
      </Card>
    </div>
  );
};
