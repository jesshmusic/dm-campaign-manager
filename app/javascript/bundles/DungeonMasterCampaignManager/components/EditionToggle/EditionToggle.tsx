import React from 'react';
import { useEdition, DndEdition } from '../../contexts/EditionContext';
import {
  ToggleContainer,
  ToggleLabel,
  ToggleWrapper,
  ToggleButton,
  CollapsedToggle,
  CollapsedButton,
} from './EditionToggle.styles';

interface EditionToggleProps {
  isCollapsed?: boolean;
}

const EditionToggle: React.FC<EditionToggleProps> = ({ isCollapsed = false }) => {
  const { edition, setEdition } = useEdition();

  const handleEditionChange = (newEdition: DndEdition) => {
    if (newEdition !== edition) {
      // setEdition will update the URL if we're on an edition-aware page,
      // and update localStorage for future visits
      setEdition(newEdition);
    }
  };

  if (isCollapsed) {
    return (
      <CollapsedToggle>
        <CollapsedButton
          $isActive={edition === '2024'}
          onClick={() => handleEditionChange('2024')}
          title="2024 Rules"
        >
          &apos;24
        </CollapsedButton>
        <CollapsedButton
          $isActive={edition === '2014'}
          onClick={() => handleEditionChange('2014')}
          title="2014 Rules"
        >
          &apos;14
        </CollapsedButton>
      </CollapsedToggle>
    );
  }

  return (
    <ToggleContainer>
      <ToggleLabel>Rules:</ToggleLabel>
      <ToggleWrapper>
        <ToggleButton
          $isActive={edition === '2024'}
          onClick={() => handleEditionChange('2024')}
          title="Use 2024 D&D Rules"
        >
          2024
        </ToggleButton>
        <ToggleButton
          $isActive={edition === '2014'}
          onClick={() => handleEditionChange('2014')}
          title="Use 2014 D&D Rules"
        >
          2014
        </ToggleButton>
      </ToggleWrapper>
    </ToggleContainer>
  );
};

export default EditionToggle;
