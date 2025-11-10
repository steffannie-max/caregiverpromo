import { PresentationSlide } from "@/components/PresentationSlide";
import { DefinitionCard } from "@/components/DefinitionCard";
import { VideoSection } from "@/components/VideoSection";
import { LensCard } from "@/components/LensCard";
import { Eye, DollarSign, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
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
            {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
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

        {/* Video Section 1: Maid */}
        <div id="slide-4">
          <VideoSection
            title="Maid (Netflix, Episode 1)"
            videoUrl="https://www.netflix.com/watch/81166770"
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
        <div id="slide-5">
          <VideoSection
            title="Claudine (1974)"
            videoUrl="https://www.youtube.com/watch?v=claudine1974"
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
        <div id="slide-6">
          <VideoSection
            title="The Florida Project (2017)"
            videoUrl="https://www.youtube.com/watch?v=floridaproject2017"
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
      </div>
    </div>
  );
};

export default Index;
