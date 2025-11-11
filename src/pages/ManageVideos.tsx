import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Check, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlideVideo {
  id: string;
  slide_number: number;
  video_url: string;
  is_active: boolean;
  created_at: string;
}

const ManageVideos = () => {
  const [videos, setVideos] = useState<SlideVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("slide_videos")
      .select("*")
      .order("slide_number", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load videos",
        variant: "destructive",
      });
    } else {
      setVideos(data || []);
    }
    setLoading(false);
  };

  const setActiveVideo = async (videoId: string, slideNumber: number) => {
    // Deactivate all videos for this slide
    await supabase
      .from("slide_videos")
      .update({ is_active: false })
      .eq("slide_number", slideNumber);

    // Activate selected video
    const { error } = await supabase
      .from("slide_videos")
      .update({ is_active: true })
      .eq("id", videoId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to activate video",
        variant: "destructive",
      });
    } else {
      toast({ title: "Video activated" });
      fetchVideos();
    }
  };

  const deleteVideo = async (videoId: string, videoUrl: string) => {
    // Extract file path from URL
    const urlParts = videoUrl.split("/presenter-videos/");
    const filePath = urlParts[1];

    // Delete from storage
    if (filePath) {
      await supabase.storage.from("presenter-videos").remove([filePath]);
    }

    // Delete from database
    const { error } = await supabase
      .from("slide_videos")
      .delete()
      .eq("id", videoId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete video",
        variant: "destructive",
      });
    } else {
      toast({ title: "Video deleted" });
      fetchVideos();
    }
  };

  // Group videos by slide
  const videosBySlide = videos.reduce((acc, video) => {
    if (!acc[video.slide_number]) {
      acc[video.slide_number] = [];
    }
    acc[video.slide_number].push(video);
    return acc;
  }, {} as Record<number, SlideVideo[]>);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate("/presenter")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary">Manage Videos</h1>
            <p className="text-muted-foreground">Select which video to use for each slide</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading videos...</div>
        ) : (
          <div className="space-y-6">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((slideNum) => {
              const slideVideos = videosBySlide[slideNum] || [];
              return (
                <Card key={slideNum}>
                  <CardHeader>
                    <CardTitle>Slide {slideNum + 1}</CardTitle>
                    <CardDescription>
                      {slideVideos.length === 0
                        ? "No videos recorded yet"
                        : `${slideVideos.length} recording${slideVideos.length > 1 ? "s" : ""}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {slideVideos.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No recordings for this slide yet
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {slideVideos.map((video) => (
                          <div
                            key={video.id}
                            className={cn(
                              "relative border rounded-lg overflow-hidden",
                              video.is_active && "ring-2 ring-primary"
                            )}
                          >
                            <video
                              src={video.video_url}
                              controls
                              className="w-full aspect-video bg-black"
                            />
                            <div className="p-3 bg-card space-y-2">
                              <div className="text-xs text-muted-foreground">
                                {new Date(video.created_at).toLocaleString()}
                              </div>
                              <div className="flex gap-2">
                                {!video.is_active && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setActiveVideo(video.id, video.slide_number)}
                                    className="flex-1"
                                  >
                                    <Check className="h-4 w-4 mr-2" />
                                    Use This
                                  </Button>
                                )}
                                {video.is_active && (
                                  <div className="flex-1 text-sm font-medium text-primary text-center py-2">
                                    Active ✓
                                  </div>
                                )}
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteVideo(video.id, video.video_url)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageVideos;
