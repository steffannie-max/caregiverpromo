import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipForward, SkipBack, Video, Mic, Square, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const PresenterView = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState([2]);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const notesRef = useRef<HTMLDivElement>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const speakerNotes = {
    0: `Welcome everyone to Week 7. Today we're diving into Interpretivism and Constructivism – two research approaches that fundamentally change how we understand social work research.

The big idea here is this: different perspectives literally change what we see, what we notice, and what we understand. We're going to explore how the lens we use shapes everything – from what counts as 'data' to what we consider a 'problem' to what solutions we imagine.

And we're going to practice. We'll watch some film clips together and practice looking through different lenses to see how the same scene reveals completely different insights.`,
    1: `Let's start by level-setting with some key terms. I know definitions can feel dry, but these are actually really important because they shape how we think about research itself.

First, Interpretivism. This is the approach that says: if we want to understand social action, we have to understand the meaning that people attach to their behavior. It's not enough to just observe what someone does – we need to understand what it means to them.

So instead of just counting how many times a social worker visits a family, interpretivism asks: What does this visit mean to the family? What does it mean to the worker? How do their cultural contexts shape how they experience this interaction?

Next, Constructivism. This takes it a step further. Constructivism says that all knowledge – and therefore all meaningful reality – is constructed through human practices and social interaction. Nothing is just objectively 'out there' waiting to be discovered. We create meaning together, through our interactions and our social contexts.

Here's a concrete example: 'Messy home' isn't an objective fact. It's constructed through social norms, class expectations, and cultural values. What one person sees as 'messy,' another might see as 'lived-in' or perfectly normal. The meaning is constructed, not inherent.

Finally, let's contrast this with Positivism – which many of us were trained in. Positivism says that objective truth and reality can be observed and measured through empirical, scientific methods. It focuses on observable facts and quantifiable data.

So a positivist approach would record: number of dirty dishes, presence of cockroaches, times child was observed outside after 10pm. These are treated as objective, measurable facts. You can see how different that is from asking what 'messy' means in different contexts.`,
    2: `Now I want to introduce two concepts from Dr. Bryson's research that we'll be discussing more in a moment.

Care Capital – this is Dr. Bryson's extension of Bourdieu's social capital. She argues that mothers, especially low-income Black mothers, must accumulate specific resources – both material and symbolic – to be deemed 'good enough' by child welfare systems.

It's not enough to love your children. You have to demonstrate that you have the right kind of house, the right kind of job, the right kind of appearance, the right emotional responses, the right social connections – all matching middle-class professional expectations.

Think about that. Parenting competence gets judged not just on care, but on capital.

Poverty Governance – this concept examines how systems of rules, policies, and institutional practices regulate, monitor, and control poor families. It looks at how poverty itself becomes a target of state intervention and surveillance.

Here's what this looks like in practice: When a family's poverty – say, a messy home because mom is working 30 hours a week at minimum wage and can't keep up – when that poverty is treated as a parenting failure requiring child removal, rather than as a systemic issue requiring support... that's poverty governance.

The system governs poverty by punishing poor families rather than addressing structural inequality.`,
    3: `Alright, here's where it gets really interesting. The same 'data' – the same scene, the same interaction – produces completely different insights depending on which lens you use.

With a Positivist lens, you ask: What are the observable facts? What can be measured or counted? What behaviors can be documented?

With a Capital lens, you ask: What resources does this family have or lack? How do advantages and disadvantages shape these interactions? What capital is required to be seen as 'good enough'?

With a Poverty Governance lens, you ask: What systems and policies shape this situation? How are rules applied differently by class? What's outside the family's control?

Same situation. Three completely different sets of questions. Three completely different understandings of what's happening and what should be done about it.

And this is why our theoretical frameworks matter so much. They're not just academic exercises – they literally determine what we see and what we miss.`,
    4: `Now I'm really excited because Dr. Bryson has generously agreed to talk with us about these concepts and about her research.

What's particularly fascinating about Dr. Bryson's work is that she analyzed the same dataset twice – once in 2016 and again in 2025 – using different interpretive frameworks. And she saw completely different things.

This is interpretivism and constructivism in action: same data, different lens, different insights.

Dr. Bryson, thank you so much for joining us.

[PLAY DR. BRYSON INTERVIEW VIDEOS]

Thank you so much, Dr. Bryson. That was incredibly helpful for understanding how our interpretive frameworks shape what we can see and understand.

Now, let's practice. We're going to watch three short film clips, and for each one, we're going to practice looking through these different lenses.`,
    5: `Okay, let's watch this clip from Maid. I'm going to play it, and then we'll pause and think through it using our different lenses.

[PLAY VIDEO]

Alright, let's pause here. Take a moment to reflect on what you just saw.

Now, I want you to work through the questions on the screen. Think about:
- What would you notice with an interpretivist lens? How would your own perspective shape what you see?
- How does meaning change with a constructivist lens? What's being socially constructed here?
- What are the observable facts from a positivist perspective?
- Through a capital lens – what resources and advantages are at play?
- And through a poverty governance lens – what systems and rules are shaping this interaction?

Take a few minutes to jot down your thoughts. There are no right or wrong answers here – the goal is to practice noticing how different lenses reveal different things.`,
    6: `Let's watch our second clip from Claudine. Remember to skip to 1:26 for the welfare/social worker home visit scene.

[PLAY VIDEO - Skip to 1:26]

Now let's work through our different lenses again. What do you notice this time? How do the questions change what you see in this scene?`,
    7: `And now our final clip from The Florida Project. Skip to 1:43 for the social worker visit to Halley in the motel.

[PLAY VIDEO - Skip to 1:43]

Take your time with the analysis questions. Notice how each lens brings different aspects into focus.`,
    8: `And that's it for today. I've included all our references here, including the three films we watched.

The key takeaway: Your theoretical lens isn't just an academic choice – it fundamentally shapes what you can see, what you consider important, and what interventions you imagine.

Thank you, and see you next week!`
  };

  // Sync with main window
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'currentSlide') {
        setCurrentSlide(parseInt(e.newValue || '0'));
      }
    };

    window.addEventListener('storage', handleStorage);
    
    // Load initial slide
    const slide = localStorage.getItem('currentSlide');
    if (slide) setCurrentSlide(parseInt(slide));

    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling || !notesRef.current) return;

    const scrollInterval = setInterval(() => {
      if (notesRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = notesRef.current;
        
        if (scrollTop + clientHeight >= scrollHeight - 10) {
          setIsAutoScrolling(false);
          return;
        }
        
        notesRef.current.scrollTop += scrollSpeed[0] * 0.5;
      }
    }, 30);

    return () => clearInterval(scrollInterval);
  }, [isAutoScrolling, scrollSpeed]);

  // Recording timer
  useEffect(() => {
    if (isRecordingAudio || isRecordingVideo) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecordingAudio, isRecordingVideo]);

  const changeSlide = (newSlide: number) => {
    const slide = Math.max(0, Math.min(8, newSlide));
    setCurrentSlide(slide);
    localStorage.setItem('currentSlide', slide.toString());
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'currentSlide',
      newValue: slide.toString()
    }));
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audio-recording-${Date.now()}.webm`;
        a.click();
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      audioRecorderRef.current = recorder;
      setIsRecordingAudio(true);
    } catch (error) {
      console.error('Error starting audio recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopAudioRecording = () => {
    if (audioRecorderRef.current && isRecordingAudio) {
      audioRecorderRef.current.stop();
      audioRecorderRef.current = null;
      setIsRecordingAudio(false);
    }
  };

  const startVideoRecording = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true,
        audio: true 
      });
      
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Combine display and audio
      const tracks = [
        ...displayStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
      ];
      
      const combinedStream = new MediaStream(tracks);
      const recorder = new MediaRecorder(combinedStream, { 
        mimeType: 'video/webm;codecs=vp9' 
      });
      
      videoChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          videoChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `video-recording-${Date.now()}.webm`;
        a.click();
        
        displayStream.getTracks().forEach(track => track.stop());
        audioStream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      videoRecorderRef.current = recorder;
      setIsRecordingVideo(true);
    } catch (error) {
      console.error('Error starting video recording:', error);
      alert('Could not start screen recording. Please check permissions.');
    }
  };

  const stopVideoRecording = () => {
    if (videoRecorderRef.current && isRecordingVideo) {
      videoRecorderRef.current.stop();
      videoRecorderRef.current = null;
      setIsRecordingVideo(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 pb-4 border-b border-border">
          <h1 className="text-2xl font-bold text-primary mb-2">Presenter View</h1>
          <p className="text-sm text-muted-foreground">Control your presentation from here</p>
        </header>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Slide Navigation */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Slide Navigation</h2>
            <div className="flex items-center gap-3 mb-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => changeSlide(currentSlide - 1)}
                disabled={currentSlide === 0}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <div className="text-center flex-1">
                <div className="text-3xl font-bold text-primary">{currentSlide + 1}</div>
                <div className="text-xs text-muted-foreground">of 9</div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => changeSlide(currentSlide + 1)}
                disabled={currentSlide === 8}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Slide Grid */}
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                <Button
                  key={idx}
                  size="sm"
                  variant={currentSlide === idx ? "default" : "outline"}
                  onClick={() => changeSlide(idx)}
                  className="w-full"
                >
                  {idx + 1}
                </Button>
              ))}
            </div>
          </div>

          {/* Recording Controls */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Recording</h2>
            <div className="space-y-3">
              {(isRecordingAudio || isRecordingVideo) && (
                <div className="text-center py-2 bg-destructive/10 rounded-lg">
                  <div className="text-2xl font-mono font-bold text-destructive">
                    {formatTime(recordingTime)}
                  </div>
                  <div className="text-xs text-muted-foreground">Recording in progress</div>
                </div>
              )}
              
              <Button
                className="w-full"
                variant={isRecordingAudio ? "destructive" : "outline"}
                onClick={isRecordingAudio ? stopAudioRecording : startAudioRecording}
                disabled={isRecordingVideo}
              >
                {isRecordingAudio ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Stop Audio
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Record Audio
                  </>
                )}
              </Button>

              <Button
                className="w-full"
                variant={isRecordingVideo ? "destructive" : "outline"}
                onClick={isRecordingVideo ? stopVideoRecording : startVideoRecording}
                disabled={isRecordingAudio}
              >
                {isRecordingVideo ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Stop Video
                  </>
                ) : (
                  <>
                    <Video className="h-4 w-4 mr-2" />
                    Record Screen
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Speaker Notes */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Speaker Notes</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">Speed:</span>
              <Slider
                value={scrollSpeed}
                onValueChange={setScrollSpeed}
                min={1}
                max={5}
                step={0.5}
                className="w-24"
              />
              <span className="text-xs text-muted-foreground w-8">{scrollSpeed[0]}x</span>
              <Button
                size="sm"
                variant={isAutoScrolling ? "default" : "outline"}
                onClick={() => setIsAutoScrolling(!isAutoScrolling)}
              >
                {isAutoScrolling ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              </Button>
            </div>
          </div>
          
          <div
            ref={notesRef}
            className="max-h-[400px] overflow-y-auto bg-muted/30 rounded-lg p-4"
          >
            <p className="text-base leading-relaxed whitespace-pre-line">
              {speakerNotes[currentSlide as keyof typeof speakerNotes]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresenterView;
