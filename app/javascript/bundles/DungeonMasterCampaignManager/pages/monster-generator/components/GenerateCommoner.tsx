import React from 'react';
import NameOptions from '../../../components/Widgets/NameOptions';
import Frame from '../../../components/Frame/Frame';
import InstructionsPanel, {
  CommonerInstructions,
} from '../../../components/InstructionsPanel/InstructionsPanel';

type GenerateCommonerProps = {
  isLoading?: boolean;
  onFormSubmit: () => void;
  token?: string;
};

const GenerateCommoner = ({ isLoading, onFormSubmit, token }: GenerateCommonerProps) => {
  return (
    <Frame
      subtitle="Instantly create a basic NPC with randomized stats. Great for shopkeepers, villagers, and background characters."
      subtitleAction={
        <InstructionsPanel>
          <CommonerInstructions />
        </InstructionsPanel>
      }
    >
      <NameOptions
        isLoading={isLoading}
        onFormSubmit={onFormSubmit}
        title={'Commoner'}
        token={token}
      />
    </Frame>
  );
};

export default GenerateCommoner;
