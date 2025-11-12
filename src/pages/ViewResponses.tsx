import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Download, Trash2 } from "lucide-react";

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
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Video', 'Question', 'Lens', 'Response', 'Name', 'Date'];
    const rows = responses.map(r => [
      r.video_title,
      r.question_text,
      r.lens,
      r.response_text.replace(/"/g, '""'),
      r.respondent_name || 'Anonymous',
      new Date(r.created_at).toLocaleString()
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `responses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast({
      title: "Export successful",
      description: "Responses exported to CSV file."
    });
  };

  const clearAllResponses = async () => {
    if (!confirm('Are you sure you want to delete ALL responses? This cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('video_responses')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) throw error;

      setResponses([]);
      toast({
        title: "All responses deleted",
        description: "The database has been cleared."
      });
    } catch (error) {
      console.error('Error deleting responses:', error);
      toast({
        title: "Error deleting responses",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading responses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Student Responses</h1>
          <div className="flex gap-3">
            <Button onClick={exportToCSV} disabled={responses.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button 
              variant="destructive" 
              onClick={clearAllResponses}
              disabled={responses.length === 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>

        {responses.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-xl text-muted-foreground">
              No responses yet. Responses will appear here as students submit them.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Total responses: {responses.length}
            </p>
            {responses.map((response) => (
              <Card key={response.id} className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      {response.video_title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {response.respondent_name || 'Anonymous'} • {new Date(response.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                    {response.lens}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground mb-2">
                  {response.question_text}
                </p>
                <p className="text-foreground bg-muted/50 p-4 rounded-lg whitespace-pre-wrap">
                  {response.response_text}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
