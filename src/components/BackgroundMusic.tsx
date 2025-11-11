import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Music } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface BackgroundMusicProps {
  currentSlide: number;
}

export const BackgroundMusic = ({ currentSlide }: BackgroundMusicProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Music URLs for different sections
  const musicMap: { [key: number]: string } = {
    0: "", // Intro - add your intro music URL here
    5: "", // Between sections - add transition music URL here
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  useEffect(() => {
    // Play music for specific slides if available
    const musicUrl = musicMap[currentSlide];
    if (musicUrl && audioRef.current) {
      audioRef.current.src = musicUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentSlide]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
      <div className="flex items-center gap-3">
        <Music className="h-4 w-4 text-muted-foreground" />
        
        <Slider
          value={volume}
          onValueChange={setVolume}
          min={0}
          max={100}
          step={1}
          className="w-24"
        />
        
        <Button
          size="sm"
          variant="ghost"
          onClick={toggleMute}
          className="h-8 w-8 p-0"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <audio ref={audioRef} loop />
      
      <div className="text-xs text-muted-foreground mt-2 text-center">
        {isPlaying ? "Music Playing" : "No music for this slide"}
      </div>
    </div>
  );
};
