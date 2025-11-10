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

  const scrollToSlide = (index: number) => {
    setCurrentSlide(index);
    const element = document.getElementById(`slide-${index}`);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Week 7: Interpretivism/Constructivism</h1>
          <div className="flex gap-2">
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
              Dr. Bryson analyzed the same dataset twice – once in 2016 and again in 2025 – using different interpretive frameworks.
            </p>
            
            <Tabs defaultValue="section1" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="section1">Section 1</TabsTrigger>
                <TabsTrigger value="section2">Section 2</TabsTrigger>
                <TabsTrigger value="section3">Section 3</TabsTrigger>
              </TabsList>
              
              {/* Section 1: Returning to the Data */}
              <TabsContent value="section1">
                <div className="bg-card p-6 md:p-8 rounded-lg border border-border">
                  <h3 className="text-xl md:text-2xl font-semibold mb-4 text-primary">Returning to the Data</h3>
                  <ol className="space-y-3 list-decimal list-inside text-left">
                    <li className="text-sm md:text-base">You analyzed the same dataset 20 years apart using different interpretive frameworks. What made you return to this data, and what did you see differently?</li>
                    <li className="text-sm md:text-base">How did your own perspective as a researcher change between 2016 and 2025?</li>
                    <li className="text-sm md:text-base">Can you walk us through a specific example where the "care capital" lens in 2016 highlighted something different than the "poverty governance" lens in 2025?</li>
                  </ol>
                  
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-semibold text-primary">
                      [Video Upload: Dr. Bryson&apos;s Responses - Section 1]
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Section 2: Care Capital Framework */}
              <TabsContent value="section2">
                <div className="bg-card p-6 md:p-8 rounded-lg border border-border">
                  <h3 className="text-xl md:text-2xl font-semibold mb-4 text-primary">Care Capital Framework</h3>
                  <ol className="space-y-3 list-decimal list-inside text-left" start={4}>
                    <li className="text-sm md:text-base">Can you explain Bourdieu&apos;s concept of capital and how you extended it to "care capital"?</li>
                    <li className="text-sm md:text-base">What kinds of capital were mothers expected to demonstrate to be seen as "good enough" parents?</li>
                    <li className="text-sm md:text-base">How would a positivist researcher approach this data differently? What would they miss?</li>
                    <li className="text-sm md:text-base">When you say meanings are "socially constructed," what does that look like in child welfare practice?</li>
                  </ol>
                  
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-semibold text-primary">
                      [Video Upload: Dr. Bryson&apos;s Responses - Section 2]
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Section 3: Poverty Governance & Theoretical Frameworks */}
              <TabsContent value="section3">
                <div className="bg-card p-6 md:p-8 rounded-lg border border-border">
                  <h3 className="text-xl md:text-2xl font-semibold mb-4 text-primary">Poverty Governance & Theoretical Frameworks</h3>
                  <ol className="space-y-3 list-decimal list-inside text-left" start={8}>
                    <li className="text-sm md:text-base">In your 2025 article, you use a "poverty governance" lens. What does this framework reveal?</li>
                    <li className="text-sm md:text-base">How do child welfare policies govern poverty rather than protect children?</li>
                    <li className="text-sm md:text-base">What advice would you give to new researchers about choosing theoretical lenses?</li>
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
            timestamp="1:26 - Welfare/social worker home visit"
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
            timestamp="1:43 - Social worker visit to Halley in motel"
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
