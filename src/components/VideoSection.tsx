import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSaveResponses = async () => {
    const filledResponses = Object.entries(responses).filter(([_, value]) => value.trim());
    
    if (filledResponses.length === 0) {
      toast({
        title: "No responses to save",
        description: "Please answer at least one question before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const responsesToSave = filledResponses.map(([questionId, responseText]) => {
        const question = questions.find(q => q.id === questionId);
        return {
          question_id: questionId,
          question_text: question?.text || "",
          lens: question?.lens || "",
          response_text: responseText,
          respondent_name: respondentName.trim() || null,
          video_title: title,
        };
      });

      const { error } = await supabase
        .from('video_responses')
        .insert(responsesToSave);

      if (error) throw error;

      toast({
        title: "Responses saved!",
        description: `${filledResponses.length} response(s) saved successfully.`,
      });
      
      // Clear the form after successful save
      setResponses({});
      setRespondentName("");
    } catch (error) {
      console.error('Error saving responses:', error);
      toast({
        title: "Error saving responses",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearResponses = () => {
    setResponses({});
    setRespondentName("");
    toast({
      title: "Responses cleared",
      description: "All your responses have been cleared.",
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

          {/* Save Section */}
          <Card className="p-6 bg-accent/5 border-2 border-accent">
            <div className="space-y-4">
              <div>
                <Label htmlFor="respondent-name" className="text-sm font-medium mb-2 block">
                  Your Name (optional - leave blank to submit anonymously)
                </Label>
                <Input
                  id="respondent-name"
                  placeholder="Enter your name or leave blank"
                  value={respondentName}
                  onChange={(e) => setRespondentName(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={handleSaveResponses}
                  disabled={isSaving}
                  size="lg"
                  className="font-semibold"
                >
                  {isSaving ? "Saving..." : "Save Responses"}
                </Button>
                <Button 
                  onClick={handleClearResponses}
                  variant="outline"
                  size="lg"
                >
                  Clear All
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your responses will be saved and can be reviewed by the instructor.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};