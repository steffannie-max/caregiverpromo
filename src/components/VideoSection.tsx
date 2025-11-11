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

  // Extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return url;
  };

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <section className="min-h-screen py-16 px-6 md:px-12 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{title}</h2>
        {timestamp && (
          <div className="mb-6 p-4 bg-primary/10 border-2 border-primary rounded-lg">
            <p className="text-lg font-bold text-primary animate-pulse flex items-center gap-2">
              <span>⏩</span>
              <span>Start at: {timestamp}</span>
            </p>
          </div>
        )}
        
        <div className="aspect-video bg-black rounded-lg mb-8 overflow-hidden">
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="grid gap-6">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-semibold text-foreground">Reflection Questions</h3>
            <div className="flex items-center gap-2 text-primary animate-pulse">
              <span className="text-sm font-medium">Scroll down</span>
              <svg 
                className="w-5 h-5 animate-bounce" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
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
