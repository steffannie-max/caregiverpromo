import { useState } from "react";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";

interface FlipCardProps {
  term: string;
  definition: string;
}

export const FlipCard = ({ term, definition }: FlipCardProps) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={flipped}
      onClick={() => setFlipped((f) => !f)}
      className="group relative h-44 w-full text-left [perspective:1200px]"
    >
      <div
        className={cn(
          "relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]",
        )}
      >
        <div className="absolute inset-0 flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow group-hover:shadow-lg [backface-visibility:hidden]">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Key term
          </span>
          <span className="text-xl font-bold text-primary">{term}</span>
          <span className="flex items-center gap-2 text-xs font-medium text-accent-foreground/70">
            <RotateCcw className="h-3.5 w-3.5" /> Tap to reveal
          </span>
        </div>
        <div className="absolute inset-0 rounded-xl border border-primary/30 bg-primary p-5 text-primary-foreground shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="text-xs font-semibold uppercase tracking-widest opacity-80">
            {term}
          </span>
          <p className="mt-3 text-sm leading-relaxed">{definition}</p>
        </div>
      </div>
    </button>
  );
};
