import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DefinitionCardProps {
  term: string;
  definition: string;
  example?: string;
  variant?: "primary" | "secondary" | "accent";
}

export const DefinitionCard = ({ 
  term, 
  definition, 
  example,
  variant = "primary" 
}: DefinitionCardProps) => {
  const variants = {
    primary: "border-l-4 border-l-primary bg-card hover:shadow-lg",
    secondary: "border-l-4 border-l-secondary bg-card hover:shadow-lg",
    accent: "border-l-4 border-l-accent bg-card hover:shadow-lg"
  };

  return (
    <Card className={cn("p-6 transition-all duration-300", variants[variant])}>
      <h3 className="text-2xl font-bold text-primary mb-3">{term}</h3>
      <p className="text-foreground mb-4 leading-relaxed">{definition}</p>
      {example && (
        <div className="mt-4 p-4 bg-muted rounded-md">
          <p className="text-sm font-semibold text-muted-foreground mb-2">Example:</p>
          <p className="text-sm text-foreground italic">{example}</p>
        </div>
      )}
    </Card>
  );
};
