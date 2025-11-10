import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface LensCardProps {
  title: string;
  icon: ReactNode;
  questions: string[];
  color: "primary" | "secondary" | "accent";
}

export const LensCard = ({ title, icon, questions, color }: LensCardProps) => {
  const colorClasses = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    accent: "bg-accent text-accent-foreground"
  };

  return (
    <Card className="p-6 hover:shadow-xl transition-shadow">
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${colorClasses[color]}`}>
        {icon}
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <ul className="space-y-3">
        {questions.map((question, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-primary font-bold mt-1">•</span>
            <span className="text-foreground leading-relaxed">{question}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};
