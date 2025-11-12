import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [respondentName, setRespondentName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Load saved responses from localStorage
  useEffect(() => {
    const savedResponses = localStorage.getItem(`responses_${title}`);
    const savedName = localStorage.getItem('respondent_name');
    if (savedResponses) {
      setResponses(JSON.parse(savedResponses));
    }
    if (savedName) {
      setRespondentName(savedName);
    }
  }, [title]);

  const handleResponseChange = (questionId: string, value: string) => {
    const newResponses = { ...responses, [questionId]: value };
    setResponses(newResponses);
    // Auto-save to localStorage
    localStorage.setItem(`responses_${title}`, JSON.stringify(newResponses));
  };

  const handleNameChange = (value: string) => {
    setRespondentName(value);
    localStorage.setItem('respondent_name', value);
  };

  const saveResponses = async () => {
    setIsSaving(true);
    try {
      const responsesToSave = Object.entries(responses)
        .filter(([_, response]) => response.trim())
        .map(([questionId, responseText]) => {
          const question = questions.find(q => q.id === questionId);
          return {
            question_id: questionId,
            question_text: question?.text || '',
            lens: question?.lens || '',
            response_text: responseText,
            respondent_name: respondentName.trim() || null,
            video_title: title
          };
        });

      if (responsesToSave.length === 0) {
        toast({
          title: "No responses to save",
          description: "Please write at least one response before saving.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('video_responses')
        .insert(responsesToSave);

      if (error) throw error;

      toast({
        title: "Responses saved!",
        description: "Your responses have been submitted successfully."
      });
    } catch (error) {
      console.error('Error saving responses:', error);
      toast({
        title: "Error saving responses",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const clearResponses = () => {
    setResponses({});
    localStorage.removeItem(`responses_${title}`);
    toast({
      title: "Responses cleared",
      description: "All your responses have been cleared."
    });
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
          <div className="mb-6 p-4 bg-alert/20 border-4 border-alert rounded-lg shadow-lg">
            <p className="text-xl font-black text-alert animate-pulse flex items-center gap-3">
              <span className="text-2xl">⏩</span>
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
          <div className="mb-6 p-4 bg-card rounded-lg border">
            <Label htmlFor="respondent-name" className="text-sm font-medium mb-2 block">
              Your name (optional - leave blank to stay anonymous)
            </Label>
            <Input
              id="respondent-name"
              placeholder="Enter your name..."
              value={respondentName}
              onChange={(e) => handleNameChange(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-semibold text-foreground">Reflection Questions</h3>
            <div className="flex items-center gap-2 text-alert animate-pulse">
              <span className="text-base font-black">Scroll down</span>
              <svg 
                className="w-6 h-6 animate-bounce" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
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

          <div className="flex gap-4 justify-end mt-6">
            <Button 
              variant="outline" 
              onClick={clearResponses}
              disabled={isSaving}
            >
              Clear All
            </Button>
            <Button 
              onClick={saveResponses}
              disabled={isSaving}
              className="min-w-32"
            >
              {isSaving ? "Saving..." : "Save Responses"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
