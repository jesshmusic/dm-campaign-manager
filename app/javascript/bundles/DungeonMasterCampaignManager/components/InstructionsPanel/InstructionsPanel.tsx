import React from 'react';
import ReactDOM from 'react-dom';
import { GiSpellBook } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';

import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalContent,
  Section,
  AIBadge,
  InfoButton,
} from './InstructionsPanel.styles';

export type InstructionsPanelProps = {
  title?: string;
  children: React.ReactNode;
};

const InstructionsPanel = ({ title = 'How to Use', children }: InstructionsPanelProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const modal = isOpen
    ? ReactDOM.createPortal(
        <ModalOverlay onClick={handleOverlayClick}>
          <ModalContainer role="dialog" aria-modal="true" aria-labelledby="instructions-title">
            <ModalHeader>
              <ModalTitle id="instructions-title">
                <GiSpellBook size={24} />
                {title}
              </ModalTitle>
              <CloseButton onClick={() => setIsOpen(false)} aria-label="Close">
                <IoClose size={24} />
              </CloseButton>
            </ModalHeader>
            <ModalContent>{children}</ModalContent>
          </ModalContainer>
        </ModalOverlay>,
        document.body,
      )
    : null;

  return (
    <>
      <InfoButton onClick={() => setIsOpen(true)} aria-label="Show instructions">
        <GiSpellBook size={18} />
        How to Use
      </InfoButton>
      {modal}
    </>
  );
};

// Pre-built instruction content for each generator type
export const CommonerInstructions = () => (
  <>
    <Section>
      <h4>Quick Start</h4>
      <p>
        Create a basic NPC with randomized ability scores in seconds. Perfect for shopkeepers,
        villagers, tavern patrons, and other background characters.
      </p>
    </Section>
    <Section>
      <h4>How It Works</h4>
      <ul>
        <li>Select a gender and race for your commoner</li>
        <li>Click &quot;Generate&quot; to create an NPC with the Commoner stat block</li>
        <li>A random name matching the race and gender will be generated</li>
        <li>Copy the stat block to your VTT or campaign notes</li>
      </ul>
    </Section>
  </>
);

export const CreateNPCInstructions = () => (
  <>
    <Section>
      <h4>Quick Start</h4>
      <p>
        Create combat-ready NPCs and creatures by selecting a Challenge Rating and archetype. The
        generator calculates appropriate stats and can generate thematic abilities using AI.
      </p>
    </Section>
    <Section>
      <h4>Workflow</h4>
      <ul>
        <li>
          <strong>Step 1 - Stats:</strong> Choose CR, monster type, size, and archetype. Stats are
          automatically calculated based on your selections.
        </li>
        <li>
          <strong>Step 2 - Saves & Skills:</strong> Optionally add saving throw and skill
          proficiencies.
        </li>
        <li>
          <strong>Step 3 - Description:</strong> Add flavor text and generate AI-powered actions and
          abilities based on your creature description.
        </li>
        <li>
          <strong>Step 4 - Name:</strong> Enter a name or generate one randomly.
        </li>
      </ul>
    </Section>
    <Section>
      <h4>
        <AIBadge>AI</AIBadge> AI Features
      </h4>
      <p>
        The &quot;Generate Actions&quot; button uses AI to create thematic attacks, special
        abilities, and spells based on your creature&apos;s description and type. This feature
        requires an internet connection and may take a few seconds.
      </p>
    </Section>
  </>
);

export const QuickNPCInstructions = () => (
  <>
    <Section>
      <h4>Quick Start</h4>
      <p>
        Create a complete creature from just a description. Simply describe what you want and the AI
        will generate a full stat block including abilities, actions, and combat stats.
      </p>
    </Section>
    <Section>
      <h4>How It Works</h4>
      <ul>
        <li>
          <strong>Set Parameters:</strong> Choose a target Challenge Rating, creature type, and
          alignment to guide the generation.
        </li>
        <li>
          <strong>Describe Your Creature:</strong> Write a description including personality,
          appearance, combat style, and any special abilities you want.
        </li>
        <li>
          <strong>Generate:</strong> Click &quot;Generate Creature&quot; and the AI will create a
          complete stat block.
        </li>
        <li>
          <strong>Review & Edit:</strong> Review the generated concept, make any edits, then approve
          to create the final creature.
        </li>
      </ul>
    </Section>
    <Section>
      <h4>Tips for Better Results</h4>
      <ul>
        <li>Be specific about combat abilities (e.g., &quot;attacks with poisoned claws&quot;)</li>
        <li>
          Mention special features (e.g., &quot;can turn invisible&quot;, &quot;breathes fire&quot;)
        </li>
        <li>Include personality traits for more flavorful ability descriptions</li>
        <li>The more detail you provide, the more tailored the result will be</li>
      </ul>
    </Section>
    <Section>
      <h4>
        <AIBadge>AI</AIBadge> Fully AI-Powered
      </h4>
      <p>
        This generator uses AI to create the entire stat block from your description. Generation
        takes a few seconds and requires an internet connection. You can regenerate if you
        don&apos;t like the results.
      </p>
    </Section>
  </>
);

export default InstructionsPanel;
