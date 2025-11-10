import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Question {
  id: string;
  text: string;
  lens: string;
}

interface VideoSectionProps {
  title: string;
  videoUrl: string;
  timestamp?: string;
  questions: Question[];
}

export const VideoSection = ({ title, videoUrl, timestamp, questions }: VideoSectionProps) => {
  const [responses, setResponses] = useState<Record<string, string>>({});

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  return (
    <section className="min-h-screen py-16 px-6 md:px-12 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{title}</h2>
        {timestamp && (
          <p className="text-muted-foreground mb-6">
            Start at: <span className="font-semibold text-accent">{timestamp}</span>
          </p>
        )}
        
        <div className="aspect-video bg-black rounded-lg mb-8 flex items-center justify-center text-muted-foreground">
          <div className="text-center p-8">
            <p className="mb-2">Video: {title}</p>
            <a 
              href={videoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline font-semibold"
            >
              Open video in new tab
            </a>
          </div>
        </div>

        <div className="grid gap-6">
          <h3 className="text-2xl font-semibold text-foreground">Reflection Questions</h3>
          {questions.map((question) => (
            <Card key={question.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-2">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-3">
                  {question.lens}
                </span>
              </div>
              <Label htmlFor={question.id} className="text-lg font-semibold mb-3 block">
                {question.text}
              </Label>
              <Textarea
                id={question.id}
                placeholder="Type your response here..."
                className="min-h-[120px] mt-2"
                value={responses[question.id] || ""}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
              />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
