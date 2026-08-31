import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, Printer } from "lucide-react";

export const Certificate = ({ unlocked }: { unlocked: boolean }) => {
  const [name, setName] = useState("");
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="p-6 md:p-8">
      {!unlocked && (
        <p className="mb-6 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          Complete the knowledge check and the scenario above to unlock your certificate of
          completion.
        </p>
      )}

      <div className="mb-6 grid gap-3 sm:max-w-md">
        <Label htmlFor="cert-name">Name as it should appear</Label>
        <Input
          id="cert-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          disabled={!unlocked}
        />
      </div>

      <div
        id="certificate"
        className="relative overflow-hidden rounded-xl border-4 border-double border-primary/40 bg-card p-8 text-center md:p-12"
      >
        <div className="pointer-events-none absolute inset-0 bg-[var(--gradient-accent)] opacity-[0.07]" />
        <Award className="mx-auto mb-4 h-12 w-12 text-accent" />
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Certificate of Completion
        </p>
        <h3 className="mt-5 text-2xl font-bold text-primary md:text-4xl">
          {name.trim() || "Your Name Here"}
        </h3>
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-foreground">
          has completed <strong>Caregiver Support Essentials</strong> — an interactive module on
          burnout, boundaries, and trauma-informed communication in home and community-based care.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-6 text-sm text-muted-foreground sm:flex-row sm:gap-12">
          <div>
            <p className="font-semibold text-foreground">1.0 contact hour</p>
            <p>Sample credit value</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">{today}</p>
            <p>Date completed</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Steffannie Roache, MSW</p>
            <p>Instructor</p>
          </div>
        </div>
        <p className="mt-8 text-xs text-muted-foreground">
          Demonstration certificate — sample module, not an accredited award.
        </p>
      </div>

      <Button className="mt-6" disabled={!unlocked} onClick={() => window.print()}>
        <Printer className="mr-2 h-4 w-4" /> Print or save as PDF
      </Button>
    </Card>
  );
};
