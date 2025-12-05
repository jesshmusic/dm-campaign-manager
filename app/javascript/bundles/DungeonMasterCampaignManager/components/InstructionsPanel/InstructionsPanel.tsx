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
        <li>Click "Generate" to create an NPC with the Commoner stat block</li>
        <li>A random name matching the race and gender will be generated</li>
        <li>Copy the stat block to your VTT or campaign notes</li>
      </ul>
    </Section>
  </>
);

export const QuickNPCInstructions = () => (
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
        The "Generate Actions" button uses AI to create thematic attacks, special abilities, and
        spells based on your creature's description and type. This feature requires an internet
        connection and may take a few seconds.
      </p>
    </Section>
  </>
);

export const CreateNPCInstructions = () => (
  <>
    <Section>
      <h4>Quick Start</h4>
      <p>
        Build completely custom NPCs and creatures with full control over every stat, ability, and
        action. The Challenge Rating is calculated automatically as you build.
      </p>
    </Section>
    <Section>
      <h4>Workflow</h4>
      <ul>
        <li>
          <strong>Step 1 - Stats:</strong> Set AC, hit dice, and base combat stats. CR is calculated
          as you make changes.
        </li>
        <li>
          <strong>Step 2 - Abilities & Defenses:</strong> Set ability scores, saving throws, skills,
          and damage resistances/immunities.
        </li>
        <li>
          <strong>Step 3 - Senses & Movement:</strong> Add special senses and movement speeds.
        </li>
        <li>
          <strong>Step 4 - Actions:</strong> Create attacks, multiattack, and other actions.
        </li>
        <li>
          <strong>Step 5 - Special Abilities:</strong> Add traits, reactions, and legendary actions.
        </li>
        <li>
          <strong>Step 6 - Name:</strong> Enter a name or generate one randomly.
        </li>
      </ul>
    </Section>
    <Section>
      <h4>
        <AIBadge>AI</AIBadge> Challenge Rating Calculation
      </h4>
      <p>
        The CR calculator uses AI to analyze your creature's full stat block including special
        abilities, resistances, and legendary actions. The AI considers how abilities interact and
        may suggest adjustments beyond what raw numbers indicate.
      </p>
      <p>
        <em>Note: CR calculations are rate-limited to prevent API overload.</em>
      </p>
    </Section>
  </>
);

export default InstructionsPanel;
