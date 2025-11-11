import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Music } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";

interface BackgroundMusicProps {
  currentSlide: number;
}

export const BackgroundMusic = ({ currentSlide }: BackgroundMusicProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([1.5]); // Start at 1.5% volume
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicMap, setMusicMap] = useState<{ [key: number]: string }>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchMusic();
  }, []);

  const fetchMusic = async () => {
    const { data, error } = await supabase
      .from("background_music")
      .select("*")
      .eq("is_active", true);
    
    if (error) {
      console.error("Error fetching music:", error);
      return;
    }

    const map: { [key: number]: string } = {};
    data?.forEach(music => {
      map[music.slide_number] = music.music_url;
    });
    setMusicMap(map);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  useEffect(() => {
    // Clear any existing fade timeout
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }

    // Play music for specific slides if available
    const musicUrl = musicMap[currentSlide];
    if (musicUrl && audioRef.current) {
      audioRef.current.src = musicUrl;
      audioRef.current.volume = 0.015; // Start at 1.5%
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        
        // Fade out gradually over 20 seconds
        const fadeSteps = 200; // 200 steps
        const fadeInterval = 20000 / fadeSteps; // 20 seconds total
        const volumeDecrement = 0.015 / fadeSteps;
        
        let step = 0;
        const fade = setInterval(() => {
          step++;
          if (audioRef.current && step < fadeSteps) {
            audioRef.current.volume = Math.max(0, 0.015 - (volumeDecrement * step));
          } else {
            clearInterval(fade);
            if (audioRef.current) {
              audioRef.current.pause();
              setIsPlaying(false);
            }
          }
        }, fadeInterval);
        
        fadeTimeoutRef.current = fade as any;
      });
    } else {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }

    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, [currentSlide, musicMap]);

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
