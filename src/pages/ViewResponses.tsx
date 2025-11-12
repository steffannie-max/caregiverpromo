import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface Response {
  id: string;
  question_text: string;
  lens: string;
  response_text: string;
  respondent_name: string | null;
  video_title: string;
  created_at: string;
}

export default function ViewResponses() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('video_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResponses(data || []);
    } catch (error) {
      console.error('Error fetching responses:', error);
      toast({
        title: "Error loading responses",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Video', 'Name', 'Lens', 'Question', 'Response'],
      ...responses.map(r => [
        new Date(r.created_at).toLocaleString(),
        r.video_title,
        r.respondent_name || 'Anonymous',
        r.lens,
        r.question_text,
        r.response_text.replace(/"/g, '""')
      ])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `video-responses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Responses downloaded as CSV file.",
    });
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to delete ALL responses? This cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('video_responses')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) throw error;

      toast({
        title: "All responses deleted",
        description: "All responses have been cleared.",
      });
      
      fetchResponses();
    } catch (error) {
      console.error('Error deleting responses:', error);
      toast({
        title: "Error deleting responses",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const groupedByVideo = responses.reduce((acc, response) => {
    if (!acc[response.video_title]) {
      acc[response.video_title] = [];
    }
    acc[response.video_title].push(response);
    return acc;
  }, {} as Record<string, Response[]>);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading responses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Student Responses</h1>
            <p className="text-muted-foreground">Total responses: {responses.length}</p>
          </div>
          <div className="flex gap-3">
            <Link to="/">
              <Button variant="outline">Back to Presentation</Button>
            </Link>
            <Button onClick={handleExport} disabled={responses.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button 
              onClick={handleClearAll} 
              variant="destructive"
              disabled={responses.length === 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>

        {responses.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-lg text-muted-foreground">No responses yet.</p>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedByVideo).map(([videoTitle, videoResponses]) => (
              <div key={videoTitle}>
                <h2 className="text-2xl font-bold text-primary mb-4">{videoTitle}</h2>
                <div className="grid gap-4">
                  {videoResponses.map((response) => (
                    <Card key={response.id} className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                            {response.lens}
                          </span>
                          <span className="ml-3 text-sm text-muted-foreground">
                            {response.respondent_name || 'Anonymous'} • {new Date(response.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="font-semibold text-foreground mb-2">{response.question_text}</p>
                      <p className="text-foreground/90 whitespace-pre-wrap">{response.response_text}</p>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}