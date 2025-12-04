import React from 'react';
import { StepContainer } from '../../../MonsterGenerator.styles';

type GenMonsterSectionProps = {
  children: React.ReactNode;
  heading: string;
  step?: number;
  currentStep?: number;
  isMultiStep?: boolean;
};

const GenMonsterSection = (props: GenMonsterSectionProps) => {
  const { children, heading, step, currentStep, isMultiStep } = props;

  const isVisible = !isMultiStep || currentStep === step;

  if (isMultiStep && step) {
    return (
      <StepContainer $isVisible={isVisible}>
        <h4>{`Step ${step}: ${heading}`}</h4>
        {children}
      </StepContainer>
    );
  }

  return (
    <div>
      <h4>{step ? `Step ${step}: ${heading}` : heading}</h4>
      {children}
    </div>
  );
};

export default GenMonsterSection;
