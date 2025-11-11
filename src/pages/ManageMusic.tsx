import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Music, Upload, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ManageMusic = () => {
  const { toast } = useToast();
  const [musicFiles, setMusicFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMusic();
  }, []);

  const fetchMusic = async () => {
    const { data, error } = await supabase
      .from("background_music")
      .select("*")
      .order("slide_number");
    
    if (error) {
      console.error("Error fetching music:", error);
      return;
    }
    
    setMusicFiles(data || []);
  };

  const uploadMusic = async (slideNumber: number, file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      // Upload to storage
      const fileName = `slide-${slideNumber}-${Date.now()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage
        .from('music')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('music')
        .getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase
        .from("background_music")
        .upsert({
          slide_number: slideNumber,
          music_url: publicUrl,
          is_active: true
        });

      if (dbError) throw dbError;

      toast({
        title: "Music Uploaded",
        description: `Music for slide ${slideNumber + 1} uploaded successfully!`,
      });

      fetchMusic();
    } catch (error) {
      console.error("Error uploading music:", error);
      toast({
        title: "Upload Failed",
        description: "Could not upload music. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteMusic = async (id: string) => {
    try {
      const { error } = await supabase
        .from("background_music")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Music Deleted",
        description: "Music removed successfully!",
      });

      fetchMusic();
    } catch (error) {
      console.error("Error deleting music:", error);
      toast({
        title: "Delete Failed",
        description: "Could not delete music.",
        variant: "destructive",
      });
    }
  };

  const musicSlides = [
    { number: 0, label: "Slide 1 - Intro Music" },
    { number: 5, label: "Slide 6 - Transition to Dr. Bryson" },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Manage Background Music</h1>
            <p className="text-muted-foreground">Upload music for intro and transitions</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Presentation
            </Link>
          </Button>
        </div>

        <div className="space-y-6">
          {musicSlides.map((slide) => {
            const existingMusic = musicFiles.find(m => m.slide_number === slide.number);
            
            return (
              <Card key={slide.number} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Music className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="text-lg font-semibold">{slide.label}</h3>
                      {existingMusic && (
                        <p className="text-sm text-muted-foreground">Music uploaded</p>
                      )}
                    </div>
                  </div>
                  
                  {existingMusic && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMusic(existingMusic.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`music-${slide.number}`}>
                    Upload Music File (MP3, WAV, OGG)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={`music-${slide.number}`}
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadMusic(slide.number, file);
                      }}
                      disabled={uploading}
                    />
                  </div>
                </div>

                {existingMusic && (
                  <div className="mt-4">
                    <audio controls className="w-full">
                      <source src={existingMusic.music_url} />
                      Your browser does not support audio playback.
                    </audio>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Tips for Background Music:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Use instrumental music to avoid distracting from speech</li>
            <li>• Keep volume low (around 20-30%) so it doesn't overpower the presenter</li>
            <li>• Choose music that matches the mood of each section</li>
            <li>• MP3 format is recommended for best compatibility</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageMusic;
