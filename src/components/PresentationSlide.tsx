import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PresentationSlideProps {
  id?: string;
  title: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "accent" | "gradient";
}

export const PresentationSlide = ({ 
  id,
  title, 
  children, 
  className,
  variant = "default" 
}: PresentationSlideProps) => {
  const variantStyles = {
    default: "bg-background",
    accent: "bg-accent/10",
    gradient: "bg-gradient-to-br from-primary/5 to-accent/5"
  };

  return (
    <section id={id} className={cn(
      "min-h-screen flex flex-col justify-center py-16 px-6 md:px-12",
      variantStyles[variant],
      className
    )}>
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8">
          {title}
        </h2>
        <div className="text-lg md:text-xl text-foreground leading-relaxed">
          {children}
        </div>
      </div>
    </section>
  );
};
