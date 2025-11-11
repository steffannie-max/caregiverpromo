import { PresentationSlide } from "@/components/PresentationSlide";
import { DefinitionCard } from "@/components/DefinitionCard";
import { VideoSection } from "@/components/VideoSection";
import { LensCard } from "@/components/LensCard";
import { Eye, DollarSign, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(false);

  const scrollToSlide = (index: number) => {
    setCurrentSlide(index);
    const element = document.getElementById(`slide-${index}`);
    element?.scrollIntoView({ behavior: "smooth" });
  };

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

  return (
    <div className="relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Week 7: Interpretivism/Constructivism</h1>
          <div className="flex gap-2 items-center">
            <Button
              variant={showNotes ? "default" : "outline"}
              size="sm"
              onClick={() => setShowNotes(!showNotes)}
              className="mr-2"
            >
              📝 {showNotes ? "Hide" : "Show"} Notes
            </Button>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
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

      {/* Speaker Notes Panel */}
      {showNotes && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border max-h-64 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <h3 className="text-sm font-semibold text-primary mb-2">Speaker Notes - Slide {currentSlide + 1}</h3>
            <p className="text-sm text-foreground whitespace-pre-line">{speakerNotes[currentSlide as keyof typeof speakerNotes]}</p>
          </div>
        </div>
      )}

      <div className="pt-16">
        {/* Slide 1: Title */}
        <PresentationSlide
          id="slide-0"
          title="Interpretivism & Constructivism"
          variant="gradient"
        >
          <div className="space-y-6">
            <p className="text-2xl md:text-3xl font-semibold text-primary">
              Understanding Research Through Different Lenses
            </p>
            <p className="text-xl">
              Week 7, November 11
            </p>
            <p className="text-muted-foreground">
              Exploring how our perspectives shape what we see, interpret, and understand in social research
            </p>
          </div>
        </PresentationSlide>

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

        {/* Slide 3: More Definitions */}
        <PresentationSlide
          id="slide-2"
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

        {/* Slide 4: How Lenses Change What We See */}
        <PresentationSlide
          id="slide-3"
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

        {/* Slide 5: Dr. Bryson Interview */}
        <PresentationSlide
          id="slide-4"
          title="Interview with Dr. Bryson"
          variant="gradient"
        >
          <div className="space-y-6 max-w-5xl mx-auto">
            <p className="text-xl text-center mb-6">
              Dr. Bryson analyzed data collected 20 years ago in two articles published 9 years apart – one in 2016 and another in 2025 – using different interpretive frameworks.
            </p>
            
            <Tabs defaultValue="section1" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="section1">Section 1</TabsTrigger>
                <TabsTrigger value="section2">Section 2</TabsTrigger>
                <TabsTrigger value="section3">Section 3</TabsTrigger>
              </TabsList>
              
              {/* Section 1: Your Research Journey */}
              <TabsContent value="section1">
                <div className="bg-card p-6 md:p-8 rounded-lg border border-border">
                  <h3 className="text-xl md:text-2xl font-semibold mb-4 text-primary">Your Research Journey</h3>
                  <ol className="space-y-3 list-decimal list-inside text-left">
                    <li className="text-sm md:text-base">What made you return to data from 20 years ago for your 2025 article, and what did you see differently with the new lens?</li>
                    <li className="text-sm md:text-base">Can you give a specific example where "care capital" (2016) vs "poverty governance" (2025) revealed different insights from the same data?</li>
                  </ol>
                  
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-semibold text-primary">
                      [Video Upload: Dr. Bryson&apos;s Responses - Section 1]
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Section 2: Theoretical Frameworks */}
              <TabsContent value="section2">
                <div className="bg-card p-6 md:p-8 rounded-lg border border-border">
                  <h3 className="text-xl md:text-2xl font-semibold mb-4 text-primary">Theoretical Frameworks</h3>
                  <ol className="space-y-3 list-decimal list-inside text-left">
                    <li className="text-sm md:text-base">Can you explain "care capital" and what mothers had to demonstrate to be seen as "good enough"?</li>
                    <li className="text-sm md:text-base">How are meanings like "neglect" socially constructed differently for poor vs wealthy families?</li>
                  </ol>
                  
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-semibold text-primary">
                      [Video Upload: Dr. Bryson&apos;s Responses - Section 2]
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Section 3: Practical Application */}
              <TabsContent value="section3">
                <div className="bg-card p-6 md:p-8 rounded-lg border border-border">
                  <h3 className="text-xl md:text-2xl font-semibold mb-4 text-primary">Practical Application</h3>
                  <ol className="space-y-3 list-decimal list-inside text-left">
                    <li className="text-sm md:text-base">How does using an interpretivist/constructivist approach with your "poverty governance" lens change what you can discover as a researcher?</li>
                    <li className="text-sm md:text-base">What advice would you give researchers about choosing theoretical lenses?</li>
                  </ol>
                  
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-semibold text-primary">
                      [Video Upload: Dr. Bryson&apos;s Responses - Section 3]
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </PresentationSlide>

        {/* Video Section 1: Maid */}
        <div id="slide-5">
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
        <div id="slide-7">
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

        {/* Slide 9: References */}
        <PresentationSlide
          id="slide-8"
          title="References"
        >
          <div className="space-y-4 text-left max-w-4xl mx-auto">
            <div className="space-y-3">
              <p className="text-sm md:text-base">
                Bryson, S. A. (2016). A credit check of maternal assets: Low-income Black mothers' navigation of child welfare services. <em>The British Journal of Social Work</em>, 46(6), 1558-1574.
              </p>
              <p className="text-sm md:text-base">
                Bryson, S. A. (2025). "Oh, this one has money": Policing, not protecting families. <em>Child Abuse & Neglect</em>, 159, 107119.
              </p>
              <p className="text-sm md:text-base">
                Crotty, M. (2015). <em>The foundations of social research: Meaning and perspective in the research process</em>. SAGE Publications.
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
