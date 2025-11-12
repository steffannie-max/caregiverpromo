import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Video, Square, Trash2, LogOut } from "lucide-react";

type Section = "section1" | "section2" | "section3";

const UploadVideos = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlobs, setRecordedBlobs] = useState<{ [key in Section]?: Blob }>({});
  const [uploading, setUploading] = useState(false);
  const [existingVideos, setExistingVideos] = useState<{ [key in Section]?: any }>({});
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [currentSection, setCurrentSection] = useState<Section>("section1");
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const sectionTitles = {
    section1: "Section 1: Your Research Journey",
    section2: "Section 2: Theoretical Frameworks",
    section3: "Section 3: Practical Application"
  };

  useEffect(() => {
    checkAuth();
    fetchExistingVideos();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchExistingVideos = async () => {
    const { data, error } = await supabase
      .from("interview_videos")
      .select("*");
    
    if (error) {
      console.error("Error fetching videos:", error);
      return;
    }

    const videoMap: { [key in Section]?: any } = {};
    data?.forEach(video => {
      videoMap[video.section as Section] = video;
    });
    setExistingVideos(videoMap);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }

      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus',
        audioBitsPerSecond: 128000
      });
      
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedBlobs(prev => ({ ...prev, [currentSection]: blob }));
        stream.getTracks().forEach(track => track.stop());
        
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = null;
          videoPreviewRef.current.src = URL.createObjectURL(blob);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Error",
        description: "Could not access camera/microphone",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 500 * 1024 * 1024; // 500MB
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `Your file (${fileSizeMB}MB) exceeds the 500MB limit. Please compress the video or split it into smaller parts.`,
          variant: "destructive"
        });
        return;
      }
      
      setRecordedBlobs(prev => ({ ...prev, [currentSection]: file }));
      if (videoPreviewRef.current) {
        videoPreviewRef.current.src = URL.createObjectURL(file);
      }
      
      toast({
        title: "File ready",
        description: `Video loaded (${fileSizeMB}MB). Click "Save Video" to upload.`
      });
    }
  };

  const uploadVideo = async () => {
    const blob = recordedBlobs[currentSection];
    if (!blob) {
      toast({
        title: "No video",
        description: "Please record or select a video first",
        variant: "destructive"
      });
      return;
    }

    const maxSize = 500 * 1024 * 1024; // 500MB
    if (blob.size > maxSize) {
      const fileSizeMB = (blob.size / (1024 * 1024)).toFixed(2);
      toast({
        title: "File too large",
        description: `Your video (${fileSizeMB}MB) exceeds the 500MB limit. Please record a shorter video.`,
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // Delete existing video if any
      if (existingVideos[currentSection]) {
        await supabase.storage
          .from('interview-videos')
          .remove([existingVideos[currentSection].file_path]);
        
        await supabase
          .from('interview_videos')
          .delete()
          .eq('id', existingVideos[currentSection].id);
      }

      // Upload new video
      const fileName = `${currentSection}-${Date.now()}.webm`;
      const { error: uploadError } = await supabase.storage
        .from('interview-videos')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      // Save metadata
      const { error: dbError } = await supabase
        .from('interview_videos')
        .insert({
          section: currentSection,
          title: sectionTitles[currentSection],
          file_path: fileName,
          file_size: blob.size
        });

      if (dbError) throw dbError;

      toast({
        title: "Success!",
        description: "Video uploaded successfully"
      });

      // Clear recorded blob and refresh
      setRecordedBlobs(prev => {
        const updated = { ...prev };
        delete updated[currentSection];
        return updated;
      });
      fetchExistingVideos();
    } catch (error: any) {
      const errorMessage = error.message?.includes("exceeded the maximum")
        ? "File size exceeds storage limit. The maximum file size is 500MB."
        : error.message;
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteVideo = async () => {
    const video = existingVideos[currentSection];
    if (!video) return;

    try {
      await supabase.storage
        .from('interview-videos')
        .remove([video.file_path]);
      
      await supabase
        .from('interview_videos')
        .delete()
        .eq('id', video.id);

      toast({ title: "Video deleted" });
      fetchExistingVideos();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Upload Interview Videos</h1>
            <p className="text-muted-foreground">Record or upload videos for each section</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs value={currentSection} onValueChange={(v) => setCurrentSection(v as Section)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="section1">Section 1</TabsTrigger>
            <TabsTrigger value="section2">Section 2</TabsTrigger>
            <TabsTrigger value="section3">Section 3</TabsTrigger>
          </TabsList>

          {(["section1", "section2", "section3"] as Section[]).map((section) => (
            <TabsContent key={section} value={section}>
              <Card>
                <CardHeader>
                  <CardTitle>{sectionTitles[section]}</CardTitle>
                  <CardDescription>
                    {existingVideos[section]
                      ? "Video uploaded. You can replace it below."
                      : "No video uploaded yet"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Video Preview */}
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <video
                      ref={section === currentSection ? videoPreviewRef : null}
                      controls
                      autoPlay={isRecording}
                      muted={isRecording}
                      className="w-full h-full object-cover"
                      src={existingVideos[section] ? 
                        `${supabase.storage.from('interview-videos').getPublicUrl(existingVideos[section].file_path).data.publicUrl}` 
                        : undefined
                      }
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex gap-3">
                    {!isRecording ? (
                      <>
                        <Button onClick={startRecording} className="flex-1">
                          <Video className="h-4 w-4 mr-2" />
                          Record Video
                        </Button>
                        <Button variant="outline" className="flex-1" asChild>
                          <label>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload File
                            <input
                              type="file"
                              accept="video/*"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                        </Button>
                      </>
                    ) : (
                      <Button onClick={stopRecording} variant="destructive" className="flex-1">
                        <Square className="h-4 w-4 mr-2" />
                        Stop Recording
                      </Button>
                    )}
                  </div>

                  {recordedBlobs[section] && (
                    <Button onClick={uploadVideo} disabled={uploading} className="w-full">
                      {uploading ? "Uploading..." : "Save Video"}
                    </Button>
                  )}

                  {existingVideos[section] && (
                    <Button onClick={deleteVideo} variant="outline" className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Current Video
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <Button onClick={() => navigate("/")} variant="outline" className="mt-6">
          Back to Presentation
        </Button>
      </div>
    </div>
  );
};

export default UploadVideos;
