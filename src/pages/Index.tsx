import { PresentationSlide } from "@/components/PresentationSlide";
import { DefinitionCard } from "@/components/DefinitionCard";
import { VideoSection } from "@/components/VideoSection";
import { LensCard } from "@/components/LensCard";
import { Eye, DollarSign, Scale, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Download, Play, Pause } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-critical-thinking.jpg";

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState([2]);
  const notesRef = useRef<HTMLDivElement>(null);
  const [interviewVideos, setInterviewVideos] = useState<{ [key: string]: any }>({});
  const [slideVideos, setSlideVideos] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    fetchInterviewVideos();
    fetchSlideVideos();
  }, []);

  const fetchInterviewVideos = async () => {
    const { data, error } = await supabase
      .from("interview_videos")
      .select("*");
    
    if (error) {
      console.error("Error fetching videos:", error);
      return;
    }

    const videoMap: { [key: string]: any } = {};
    data?.forEach(video => {
      videoMap[video.section] = video;
    });
    setInterviewVideos(videoMap);
  };

  const fetchSlideVideos = async () => {
    const { data, error } = await supabase
      .from("slide_videos")
      .select("*")
      .eq("is_active", true);
    
    if (error) {
      console.error("Error fetching slide videos:", error);
      return;
    }

    const videoMap: { [key: number]: string } = {};
    data?.forEach(video => {
      videoMap[video.slide_number] = video.video_url;
    });
    setSlideVideos(videoMap);
  };

  const scrollToSlide = (index: number) => {
    setCurrentSlide(index);
    localStorage.setItem('currentSlide', index.toString());
    const element = document.getElementById(`slide-${index}`);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const openPresenterMode = () => {
    const presenterWindow = window.open('/presenter', 'Presenter View', 'width=1200,height=800');
    if (presenterWindow) {
      localStorage.setItem('currentSlide', currentSlide.toString());
    }
  };

  // Sync with presenter view
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'currentSlide') {
        const newSlide = parseInt(e.newValue || '0');
        setCurrentSlide(newSlide);
        const element = document.getElementById(`slide-${newSlide}`);
        element?.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling || !notesRef.current) return;

    const scrollInterval = setInterval(() => {
      if (notesRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = notesRef.current;
        
        // Check if we've reached the end
        if (scrollTop + clientHeight >= scrollHeight - 10) {
          setIsAutoScrolling(false);
          return;
        }
        
        // Scroll by pixels based on speed (1-5 scale)
        notesRef.current.scrollTop += scrollSpeed[0] * 0.5;
      }
    }, 30); // Update every 30ms for smooth scrolling

    return () => clearInterval(scrollInterval);
  }, [isAutoScrolling, scrollSpeed]);

  // Download notes function
  const downloadNotes = () => {
    const allNotes = Object.entries(speakerNotes)
      .map(([slide, notes]) => `SLIDE ${parseInt(slide) + 1}\n${'='.repeat(50)}\n\n${notes}\n\n`)
      .join('\n');
    
    const blob = new Blob([allNotes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'speaker-notes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const speakerNotes = {
    0: `Hi everyone, and welcome to week seven. Today we'll explore Interpretivism and Constructivism; now, these two research approaches seem similar, but we'll discuss some of the nuances between them. We'll also discuss how these two research approaches fundamentally change how we understand social work research.

The big idea here is this: different perspectives literally change what we see, what we notice, and what we understand. We're going to explore how the lens we use shapes everything – from what counts as 'data' to what we consider a 'problem' to what solutions we imagine.

We'll hear from our esteemed Dr. Stephanie Bryson who will bring real-world examples from her groundbreaking research on child welfare systems and help us understand how changing our theoretical lens can reveal entirely different insights from the same data.

And we're going to practice distinguishing between the concepts by viewing some film clips together and practice looking through different lenses to see how the same scene reveals completely different insights.`,
    1: `Let's start by level-setting with some key terms. I know definitions can feel dry, but these are actually really important because they shape how we think about research itself.

First, Interpretivism. This is the approach that says: if we want to understand social action, we have to understand the meaning that people attach to their behavior. It's not enough to just observe what someone does – we need to understand what it means to them.

So instead of just counting how many times a social worker visits a family, interpretivism asks: What does this visit mean to the family? What does it mean to the worker? How do their cultural contexts shape how they experience this interaction?

Next, Constructivism. This takes it a step further. Constructivism says that all knowledge – and therefore all meaningful reality – is constructed through human practices and social interaction. Nothing is just objectively 'out there' waiting to be discovered. We create meaning together, through our interactions and our social contexts.

Here's a concrete example: 'Messy home' isn't an objective fact. It's constructed through social norms, class expectations, and cultural values. What one person sees as 'messy,' another might see as 'lived-in' or perfectly normal. The meaning is constructed, not inherent.

Finally, let's contrast this with Positivism – which many of us were trained in. Positivism says that objective truth and reality can be observed and measured through empirical, scientific methods. It focuses on observable facts and quantifiable data.

So a positivist approach would record: number of dirty dishes, presence of cockroaches, times child was observed outside after 10pm. These are treated as objective, measurable facts. You can see how different that is from asking what 'messy' means in different contexts.`,
    2: `Now let's talk about where these ideas came from – the intellectual history and key thinkers who shaped these paradigms (frameworks for understanding the world).

Positivism emerged first in the 19th century with Auguste Comte (oh-GOOST KOHNT), who coined the term. He believed society could be studied using the same scientific methods as the natural sciences. Later, the Vienna Circle and logical positivists (philosophers who believed only verifiable statements have meaning) pushed this further. The idea was: if we can't measure it, observe it, or verify it empirically (through direct observation), it's not real knowledge.

Interpretivism developed as a response to positivism. Max Weber (VAHKS VAY-ber), in the early 1900s, introduced the concept of Verstehen (understanding from the inside) – understanding the subjective meanings people attach to their actions. He argued you can't study humans the same way you study rocks or chemicals because humans have intentions, meanings, and consciousness.

Alfred Schutz (AL-fred SHOOTS) built on Weber's work, bringing in phenomenology (the study of lived experience and how people make sense of their world). Schutz argued that social reality is intersubjective (meaning it's shared and co-created between people) – it's created through our shared understandings and taken-for-granted assumptions.

Then comes Constructivism, most famously articulated by Peter Berger (BAIR-ger) and Thomas Luckmann (LOOK-mahn) in their 1966 book "The Social Construction of Reality." They showed how reality itself is socially constructed through human interaction, language, and institutions. What we take for granted as "just the way things are" is actually created and maintained through social processes.

Kenneth Gergen (GER-gen) later extended this into social constructionism (the idea that knowledge is created through social processes and language), emphasizing how our conversations and cultural practices create what we know. And thinkers like Michel Foucault (mee-SHELL foo-KOH) showed how power shapes what counts as knowledge and truth.

So these aren't just abstract academic theories – they represent fundamental disagreements about the nature of reality, knowledge, and how we can understand the social world.`,
    3: `Now I want to introduce two concepts from Dr. Bryson's research that we'll be discussing more in a moment.

Care Capital – this is Dr. Bryson's extension of Bourdieu's social capital. She argues that mothers, especially low-income Black mothers, must accumulate specific resources – both material and symbolic – to be deemed 'good enough' by child welfare systems.

It's not enough to love your children. You have to demonstrate that you have the right kind of house, the right kind of job, the right kind of appearance, the right emotional responses, the right social connections – all matching middle-class professional expectations.

Think about that. Parenting competence gets judged not just on care, but on capital.

Poverty Governance – this concept examines how systems of rules, policies, and institutional practices regulate, monitor, and control poor families. It looks at how poverty itself becomes a target of state intervention and surveillance.

Here's what this looks like in practice: When a family's poverty – say, a messy home because mom is working 30 hours a week at minimum wage and can't keep up – when that poverty is treated as a parenting failure requiring child removal, rather than as a systemic issue requiring support... that's poverty governance.

The system governs poverty by punishing poor families rather than addressing structural inequality.`,
    4: `Alright, here's where it gets really interesting. The same 'data' – the same scene, the same interaction – produces completely different insights depending on which lens you use.

With a Positivist lens, you ask: What are the observable facts? What can be measured or counted? What behaviors can be documented?

With a Capital lens, you ask: What resources does this family have or lack? How do advantages and disadvantages shape these interactions? What capital is required to be seen as 'good enough'?

With a Poverty Governance lens, you ask: What systems and policies shape this situation? How are rules applied differently by class? What's outside the family's control?

Same situation. Three completely different sets of questions. Three completely different understandings of what's happening and what should be done about it.

And this is why our theoretical frameworks matter so much. They're not just academic exercises – they literally determine what we see and what we miss.`,
    5: `Now I'm really excited because Dr. Bryson has generously agreed to talk with us about these concepts and about her research.

What's particularly fascinating about Dr. Bryson's work is that she analyzed the same dataset twice – once in 2016 and again in 2025 – using different interpretive frameworks. And she saw completely different things.

This is interpretivism and constructivism in action: same data, different lens, different insights.

Dr. Bryson, thank you so much for joining us.

[PLAY DR. BRYSON INTERVIEW VIDEOS]

Thank you so much, Dr. Bryson. That was incredibly helpful for understanding how our interpretive frameworks shape what we can see and understand.

Now, let's practice. We're going to watch three short film clips, and for each one, we're going to practice looking through these different lenses.`,
    6: `Okay, let's watch this clip from Maid. I'm going to play it, and then we'll pause and think through it using our different lenses.

[PLAY VIDEO]

Alright, let's pause here. Take a moment to reflect on what you just saw.

Now, I want you to work through the questions on the screen. Think about:
- What would you notice with an interpretivist lens? How would your own perspective shape what you see?
- How does meaning change with a constructivist lens? What's being socially constructed here?
- What are the observable facts from a positivist perspective?
- Through a capital lens – what resources and advantages are at play?
- And through a poverty governance lens – what systems and rules are shaping this interaction?

Take a few minutes to jot down your thoughts. There are no right or wrong answers here – the goal is to practice noticing how different lenses reveal different things.`,
    7: `Let's watch our second clip from Claudine. Remember to skip to 1:26 for the welfare/social worker home visit scene.

[PLAY VIDEO - Skip to 1:26]

Now let's work through our different lenses again. What do you notice this time? How do the questions change what you see in this scene?`,
    8: `And now our final clip from The Florida Project. Skip to 1:43 for the social worker visit to Halley in the motel.

[PLAY VIDEO - Skip to 1:43]

Take your time with the analysis questions. Notice how each lens brings different aspects into focus.`,
    9: `And that's it for today. I've included all our references here, including the three films we watched.

The key takeaway: Your theoretical lens isn't just an academic choice – it fundamentally shapes what you can see, what you consider important, and what interventions you imagine.

Thank you, and see you next week!`
  };

  return (
    <div className="relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Week 7: Interpretivism/Constructivism</h1>
          <div className="flex gap-2 items-center">
            <Button variant="outline" size="sm" asChild>
              <Link to="/upload-videos">
                📹 Manage Videos
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openPresenterMode}
              className="mr-2"
            >
              <Presentation className="h-4 w-4 mr-1" />
              Presenter Mode
            </Button>
            <Button
              variant={showNotes ? "default" : "outline"}
              size="sm"
              onClick={() => setShowNotes(!showNotes)}
              className="mr-2"
            >
              📝 {showNotes ? "Hide" : "Show"} Notes
            </Button>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => (
              <Button
                key={idx}
                variant={currentSlide === idx ? "default" : "outline"}
                size="sm"
                onClick={() => scrollToSlide(idx)}
              >
                {idx + 1}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Speaker Notes Panel with Teleprompter */}
      {showNotes && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
          <div className="max-w-7xl mx-auto px-6 py-3">
            {/* Controls */}
            <div className="flex items-center gap-4 mb-3 pb-3 border-b border-border">
              <h3 className="text-sm font-semibold text-primary">Speaker Notes - Slide {currentSlide + 1}</h3>
              
              <div className="flex items-center gap-2 ml-auto">
                {/* Speed Control */}
                <span className="text-xs text-muted-foreground whitespace-nowrap">Speed:</span>
                <Slider
                  value={scrollSpeed}
                  onValueChange={setScrollSpeed}
                  min={1}
                  max={5}
                  step={0.5}
                  className="w-24"
                />
                <span className="text-xs text-muted-foreground w-8">{scrollSpeed[0]}x</span>
                
                {/* Play/Pause Button */}
                <Button
                  size="sm"
                  variant={isAutoScrolling ? "default" : "outline"}
                  onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                  className="gap-1"
                >
                  {isAutoScrolling ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  {isAutoScrolling ? "Pause" : "Auto Scroll"}
                </Button>
                
                {/* Download Button */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={downloadNotes}
                  className="gap-1"
                >
                  <Download className="h-3 w-3" />
                  Download
                </Button>
              </div>
            </div>
            
            {/* Scrollable Notes */}
            <div 
              ref={notesRef}
              className="max-h-48 overflow-y-auto"
            >
              <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                {speakerNotes[currentSlide as keyof typeof speakerNotes]}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="pt-16 relative">
        {/* Corner PIP Video Overlay */}
        {slideVideos[currentSlide] && (
          <div className="fixed bottom-20 right-6 z-50 w-64 h-36 rounded-lg overflow-hidden shadow-2xl border-2 border-primary">
            <video
              src={slideVideos[currentSlide]}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Slide 1: Title */}
        <section id="slide-0" className="min-h-screen relative flex items-center justify-center overflow-hidden">
          {/* Hero Image Background */}
          <div className="absolute inset-0">
            <img 
              src={heroImage} 
              alt="Critical thinking and multiple perspectives" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background/95" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-primary drop-shadow-lg">
              Interpretivism & Constructivism
            </h1>
            <p className="text-3xl md:text-4xl font-semibold text-foreground drop-shadow-md">
              Understanding Research Through Different Lenses
            </p>
            <div className="space-y-4 pt-4">
              <p className="text-2xl text-foreground/90 drop-shadow">
                Week 7, November 11
              </p>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto drop-shadow">
                Exploring how our perspectives shape what we see, interpret, and understand in social research
              </p>
            </div>
          </div>
        </section>

        {/* Slide 2: Key Definitions */}
        <PresentationSlide
          id="slide-1"
          title="Key Definitions & Concepts"
        >
          <div className="grid gap-6">
            <DefinitionCard
              term="Interpretivism"
              definition="A research approach that seeks to understand the subjective meaning of social action. It emphasizes that researchers must understand the meanings that social actors attach to their own behavior and the behavior of others."
              example="Instead of just counting how many times a social worker visits a family, interpretivism asks: What does this visit mean to the family? To the social worker? How do cultural contexts shape these interactions?"
              variant="primary"
            />
            <DefinitionCard
              term="Constructivism"
              definition="The view that all knowledge, and therefore all meaningful reality as such, is contingent upon human practices, being constructed in and out of interaction between human beings and their world, and developed and transmitted within an essentially social context."
              example="'Messy home' isn't an objective fact—it's constructed through social norms, class expectations, and cultural values. What one observer sees as 'messy,' another might see as 'lived-in' or 'normal.'"
              variant="secondary"
            />
            <DefinitionCard
              term="Positivism"
              definition="The philosophical stance that objective truth and reality can be observed and measured through empirical, scientific methods. Focuses on observable facts and quantifiable data."
              example="Recording specific data: number of dirty dishes, presence of cockroaches, times child was observed outside after 10pm. These are treated as objective, measurable facts."
              variant="accent"
            />
          </div>
        </PresentationSlide>

        {/* Slide 3: Historical & Philosophical Foundations */}
        <PresentationSlide
          id="slide-2"
          title="Historical & Philosophical Foundations"
          variant="gradient"
        >
          <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-primary/10 p-6 rounded-lg border-2 border-primary">
                <h3 className="text-xl font-bold text-primary mb-4">Positivism</h3>
                <ul className="space-y-3 text-sm">
                  <li><strong>Auguste Comte</strong> (oh-GOOST KOHNT)<br />1830s: Founder; society studied scientifically</li>
                  <li><strong>Vienna Circle</strong><br />1920s-30s: Only measurable facts matter</li>
                  <li><strong>Key idea:</strong> Objective reality can be measured</li>
                </ul>
              </div>

              <div className="bg-secondary/10 p-6 rounded-lg border-2 border-secondary">
                <h3 className="text-xl font-bold text-secondary mb-4">Interpretivism</h3>
                <ul className="space-y-3 text-sm">
                  <li><strong>Max Weber</strong> (VAHKS VAY-ber)<br />Early 1900s: <em>Verstehen</em> (understanding from within) - grasping subjective meanings</li>
                  <li><strong>Alfred Schutz</strong> (AL-fred SHOOTS)<br />1930s-50s: Lived experience matters</li>
                  <li><strong>Key idea:</strong> Understand subjective meanings</li>
                </ul>
              </div>

              <div className="bg-accent/10 p-6 rounded-lg border-2 border-accent">
                <h3 className="text-xl font-bold text-accent mb-4">Constructivism</h3>
                <ul className="space-y-3 text-sm">
                  <li><strong>Berger & Luckmann</strong> (BAIR-ger / LOOK-mahn)<br />1966: Reality is socially constructed</li>
                  <li><strong>Kenneth Gergen</strong> (GER-gen)<br />1980s-90s: Language creates knowledge</li>
                  <li><strong>Michel Foucault</strong> (mee-SHELL foo-KOH)<br />Power shapes truth</li>
                </ul>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <p className="text-lg text-center italic">
                "These represent fundamental disagreements about the nature of reality and knowledge."
              </p>
            </div>
          </div>
        </PresentationSlide>

        {/* Slide 4: More Definitions */}
        <PresentationSlide
          id="slide-3"
          title="Additional Key Concepts"
        >
          <div className="grid gap-6">
            <DefinitionCard
              term="Care Capital (Bourdieu)"
              definition="A concept extending Bourdieu's notion of social capital. Care capital refers to the private and conspicuous resources—material and symbolic—that parents (especially mothers) must accumulate to be deemed 'good enough' by child welfare systems."
              example="A mother must demonstrate not just that she loves her children, but that she has the right kind of house, job, appearance, emotional responses, and social connections that match middle-class professional expectations."
              variant="primary"
            />
            <DefinitionCard
              term="Poverty Governance"
              definition="The systems of rules, policies, and institutional practices that regulate, monitor, and control poor families. It examines how poverty itself becomes a target of state intervention and surveillance."
              example="When a family's poverty (messy home due to working 30 hours/week at minimum wage) is treated as a parenting failure requiring child removal, rather than as a systemic issue requiring support."
              variant="secondary"
            />
          </div>
        </PresentationSlide>

        {/* Slide 5: How Lenses Change What We See */}
        <PresentationSlide
          id="slide-4"
          title="How Different Lenses Change What We Notice"
          variant="accent"
        >
          <div className="space-y-8">
            <p className="text-xl">
              The same "data" produces completely different insights depending on which lens you use:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <LensCard
                title="Positivist"
                icon={<Eye className="w-5 h-5" />}
                color="primary"
                questions={[
                  "What are the observable facts?",
                  "What can be measured or counted?",
                  "What behaviors can be documented?"
                ]}
              />
              <LensCard
                title="Capital"
                icon={<DollarSign className="w-5 h-5" />}
                color="secondary"
                questions={[
                  "What resources does the family have or lack?",
                  "How do advantages/disadvantages shape interactions?",
                  "What capital is required to be seen as 'good enough'?"
                ]}
              />
              <LensCard
                title="Poverty Governance"
                icon={<Scale className="w-5 h-5" />}
                color="accent"
                questions={[
                  "What systems and policies shape this situation?",
                  "How are rules applied differently by class?",
                  "What's outside the family's control?"
                ]}
              />
            </div>
          </div>
        </PresentationSlide>

        {/* Slide 6: Dr. Bryson Interview */}
        <PresentationSlide
          id="slide-5"
          title="Interview with Dr. Bryson"
          variant="gradient"
        >
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="bg-primary/10 border-2 border-primary rounded-lg p-6 mb-6">
              <p className="text-xl text-center mb-4">
                Dr. Bryson analyzed data collected 20 years ago in two articles published 9 years apart – one in 2016 and another in 2025 – using different interpretive frameworks.
              </p>
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-primary">
                  This interview is divided into 3 sections
                </p>
                <p className="text-base">
                  👉 Start by selecting <strong>Section 1</strong> below, then work through each section in order
                </p>
                <p className="text-sm text-muted-foreground italic">
                  (The specific questions Dr. Bryson answers are listed under each section tab)
                </p>
              </div>
            </div>
            
            <Tabs defaultValue="section1" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="section1">Section 1</TabsTrigger>
                <TabsTrigger value="section2">Section 2</TabsTrigger>
                <TabsTrigger value="section3">Section 3</TabsTrigger>
              </TabsList>
              
              {/* Section 1: Your Research Journey */}
              <TabsContent value="section1">
                <div className="bg-card p-6 md:p-8 rounded-lg border border-border">
                  <h3 className="text-xl md:text-2xl font-semibold mb-4 text-primary">Section 1: Your Research Journey</h3>
                  <p className="text-sm font-semibold text-accent mb-3">Dr. Bryson answers these questions:</p>
                  <ol className="space-y-3 list-decimal list-inside text-left mb-4">
                    <li className="text-sm md:text-base">What made you return to data from 20 years ago for your 2025 article, and what did you see differently with the new lens?</li>
                    <li className="text-sm md:text-base">Can you give a specific example where &quot;care capital&quot; (2016) vs &quot;poverty governance&quot; (2025) revealed different insights from the same data?</li>
                  </ol>
                  
                  <div className="mt-6">
                    {interviewVideos.section1 ? (
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <video
                          controls
                          className="w-full h-full"
                          src={supabase.storage.from('interview-videos').getPublicUrl(interviewVideos.section1.file_path).data.publicUrl}
                        />
                      </div>
                    ) : (
                      <div className="p-4 bg-muted/50 rounded-lg text-center">
                        <p className="text-sm font-semibold text-muted-foreground">
                          No video uploaded yet. <Link to="/upload-videos" className="text-primary underline">Upload video</Link>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Section 2: Theoretical Frameworks */}
              <TabsContent value="section2">
                <div className="bg-card p-6 md:p-8 rounded-lg border border-border">
                  <h3 className="text-xl md:text-2xl font-semibold mb-4 text-primary">Section 2: Theoretical Frameworks</h3>
                  <p className="text-sm font-semibold text-accent mb-3">Dr. Bryson answers these questions:</p>
                  <ol className="space-y-3 list-decimal list-inside text-left mb-4">
                    <li className="text-sm md:text-base">Can you explain &quot;care capital&quot; and what mothers had to demonstrate to be seen as &quot;good enough&quot;?</li>
                    <li className="text-sm md:text-base">How are meanings like &quot;neglect&quot; socially constructed differently for poor vs wealthy families?</li>
                  </ol>
                  
                  <div className="mt-6">
                    {interviewVideos.section2 ? (
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <video
                          controls
                          className="w-full h-full"
                          src={supabase.storage.from('interview-videos').getPublicUrl(interviewVideos.section2.file_path).data.publicUrl}
                        />
                      </div>
                    ) : (
                      <div className="p-4 bg-muted/50 rounded-lg text-center">
                        <p className="text-sm font-semibold text-muted-foreground">
                          No video uploaded yet. <Link to="/upload-videos" className="text-primary underline">Upload video</Link>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Section 3: Practical Application */}
              <TabsContent value="section3">
                <div className="bg-card p-6 md:p-8 rounded-lg border border-border">
                  <h3 className="text-xl md:text-2xl font-semibold mb-4 text-primary">Section 3: Practical Application</h3>
                  <p className="text-sm font-semibold text-accent mb-3">Dr. Bryson answers these questions:</p>
                  <ol className="space-y-3 list-decimal list-inside text-left mb-4">
                    <li className="text-sm md:text-base">How does using an interpretivist/constructivist approach with your &quot;poverty governance&quot; lens change what you can discover as a researcher?</li>
                    <li className="text-sm md:text-base">What advice would you give researchers about choosing theoretical lenses?</li>
                  </ol>
                  
                  <div className="mt-6">
                    {interviewVideos.section3 ? (
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <video
                          controls
                          className="w-full h-full"
                          src={supabase.storage.from('interview-videos').getPublicUrl(interviewVideos.section3.file_path).data.publicUrl}
                        />
                      </div>
                    ) : (
                      <div className="p-4 bg-muted/50 rounded-lg text-center">
                        <p className="text-sm font-semibold text-muted-foreground">
                          No video uploaded yet. <Link to="/upload-videos" className="text-primary underline">Upload video</Link>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </PresentationSlide>

        {/* Video Section 1: Maid */}
        <div id="slide-6">
          <VideoSection
            title="Maid (Netflix, Episode 1)"
            videoUrl="https://www.youtube.com/watch?v=MMIBPTNmDoI"
            timestamp="Social worker meeting scene"
            questions={[
              {
                id: "maid-interp",
                lens: "Interpretivist Lens",
                text: "As researchers, how would our perspectives influence what we notice in this scene? How might two researchers interpret the same information differently?"
              },
              {
                id: "maid-construct",
                lens: "Constructivist Lens",
                text: "How does meaning change depending on who's observing? How might Alex's perspective differ from the social worker's? What social norms shape how we interpret what's happening?"
              },
              {
                id: "maid-posit",
                lens: "Positivist (Facts/Objective)",
                text: "What's actually happening? What could you record as observable facts?"
              },
              {
                id: "maid-capital",
                lens: "Capital (Resources/Advantages)",
                text: "What resources or advantages does Alex have or lack? How might these affect how she's seen or how she navigates the situation?"
              },
              {
                id: "maid-gov",
                lens: "Poverty Governance (System/Rules)",
                text: "How do rules, policies, or systems shape what's happening? What pressures are outside Alex's control?"
              }
            ]}
          />
        </div>

        {/* Video Section 2: Claudine */}
        <div id="slide-6">
          <VideoSection
            title="Claudine (1974)"
            videoUrl="https://www.youtube.com/watch?v=ZOPy3FC-lUk"
            timestamp="⏩ Skip to 1:26 - Welfare/social worker home visit"
            questions={[
              {
                id: "claud-interp",
                lens: "Interpretivist Lens",
                text: "What 'truths' are highlighted or hidden depending on the lens? How do the characters' backgrounds influence how we interpret their actions?"
              },
              {
                id: "claud-construct",
                lens: "Constructivist Lens",
                text: "How might the family's perspective or the researcher's perspective alter the interpretation of this home visit? What does 'appropriate home' mean in different contexts?"
              },
              {
                id: "claud-posit",
                lens: "Positivist (Facts/Objective)",
                text: "What observable facts can be documented about the home and the interaction?"
              },
              {
                id: "claud-capital",
                lens: "Capital (Resources/Advantages)",
                text: "What forms of capital (economic, social, cultural) are being assessed? What resources must Claudine demonstrate to be seen as a 'good mother'?"
              },
              {
                id: "claud-gov",
                lens: "Poverty Governance (System/Rules)",
                text: "How does the welfare system shape this interaction? What rules govern this relationship?"
              }
            ]}
          />
        </div>

        {/* Video Section 3: The Florida Project */}
        <div id="slide-8">
          <VideoSection
            title="The Florida Project (2017)"
            videoUrl="https://www.youtube.com/watch?v=bvZV09_0p9k"
            timestamp="⏩ Skip to 1:43 - Social worker visit to Halley in motel"
            questions={[
              {
                id: "florida-interp",
                lens: "Interpretivist Lens",
                text: "How might researchers from different backgrounds interpret this scene differently? What assumptions might shape our understanding?"
              },
              {
                id: "florida-construct",
                lens: "Constructivist Lens",
                text: "How is the meaning of 'appropriate housing' socially constructed? How might living in a motel be interpreted differently by different observers?"
              },
              {
                id: "florida-posit",
                lens: "Positivist (Facts/Objective)",
                text: "What are the observable, measurable facts about the living situation and the interaction?"
              },
              {
                id: "florida-capital",
                lens: "Capital (Resources/Advantages)",
                text: "What economic, social, and cultural capital does Halley lack? How does this lack shape the interaction and assessment?"
              },
              {
                id: "florida-gov",
                lens: "Poverty Governance (System/Rules)",
                text: "How do housing policies, child welfare rules, and economic systems create this situation? What structural factors are being individualized?"
              }
            ]}
          />
        </div>

        {/* Slide 10: References */}
        <PresentationSlide
          id="slide-9"
          title="References"
        >
          <div className="space-y-4 text-left max-w-4xl mx-auto">
            <div className="space-y-3">
              <p className="text-sm md:text-base">
                Berger, P. L., & Luckmann, T. (1966). <em>The social construction of reality: A treatise in the sociology of knowledge</em>. Anchor Books.
              </p>
              <p className="text-sm md:text-base">
                Bryson, S. A. (2016). A credit check of maternal assets: Low-income Black mothers' navigation of child welfare services. <em>The British Journal of Social Work</em>, 46(6), 1558-1574.
              </p>
              <p className="text-sm md:text-base">
                Bryson, S. A. (2025). "Oh, this one has money": Policing, not protecting families. <em>Child Abuse & Neglect</em>, 159, 107119.
              </p>
              <p className="text-sm md:text-base">
                Comte, A. (1855). <em>The positive philosophy</em> (H. Martineau, Trans.). Calvin Blanchard.
              </p>
              <p className="text-sm md:text-base">
                Crotty, M. (2015). <em>The foundations of social research: Meaning and perspective in the research process</em>. SAGE Publications.
              </p>
              <p className="text-sm md:text-base">
                Schutz, A. (1967). <em>The phenomenology of the social world</em>. Northwestern University Press.
              </p>
              <p className="text-sm md:text-base">
                Weber, M. (1978). <em>Economy and society: An outline of interpretive sociology</em> (G. Roth & C. Wittich, Eds.). University of California Press.
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-xl font-semibold mb-3">Films Referenced</h3>
              <div className="space-y-2">
                <p className="text-sm md:text-base">
                  <em>Maid</em> (2021). Netflix series, Episode 1.
                </p>
                <p className="text-sm md:text-base">
                  <em>Claudine</em> (1974). Directed by John Berry.
                </p>
                <p className="text-sm md:text-base">
                  <em>The Florida Project</em> (2017). Directed by Sean Baker.
                </p>
              </div>
            </div>
          </div>
        </PresentationSlide>
      </div>
    </div>
  );
};

export default Index;
