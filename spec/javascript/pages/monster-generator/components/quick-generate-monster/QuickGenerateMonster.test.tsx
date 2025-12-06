import React from 'react';
import { render, screen, fireEvent } from '../../../../test-utils';
import QuickGenerateMonster from '../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/quick-generate-monster/QuickGenerateMonster';
import * as useDataHook from '../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/quick-generate-monster/use-data';

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Frame/Frame', () => {
  return function MockFrame({ title, subtitle, children, className }: any) {
    return (
      <div data-testid="frame" className={className}>
        <h2>{title}</h2>
        <p>{subtitle}</p>
        {children}
      </div>
    );
  };
});

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return function MockButton({ title, onClick, type, disabled, isFullWidth }: any) {
    return (
      <button onClick={onClick} type={type} disabled={disabled} data-fullwidth={isFullWidth}>
        {title}
      </button>
    );
  };
});

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/NameFormField', () => {
  return function MockNameFormField({ handleGenerateName, handleGenerateMonsterName }: any) {
    return (
      <div data-testid="name-form-field">
        <button onClick={handleGenerateMonsterName}>Generate Monster Name</button>
        <button onClick={() => handleGenerateName('male', 'human')}>Generate Name</button>
      </div>
    );
  };
});

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/GenMonsterSection', () => {
  return function MockGenMonsterSection({ heading, children }: any) {
    return (
      <div data-testid={`section-${heading}`}>
        <h3>{heading}</h3>
        {children}
      </div>
    );
  };
});

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/quick-generate-monster/QuickMonsterStatsSection', () => {
  return function MockQuickMonsterStatsSection() {
    return <div data-testid="quick-monster-stats-section">Quick Monster Stats</div>;
  };
});

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/SavesSkillsSection', () => {
  return function MockSavesSkillsSection() {
    return <div data-testid="saves-skills-section">Saves Skills</div>;
  };
});

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/quick-generate-monster/CreatureDescriptionSection', () => {
  return function MockCreatureDescriptionSection() {
    return <div data-testid="creature-description-section">Creature Description</div>;
  };
});

describe('QuickGenerateMonster', () => {
  const mockUseForm = {
    register: jest.fn(),
    handleSubmit: jest.fn((callback) => (e) => {
      e.preventDefault();
      callback();
    }),
    getValues: jest.fn(() => ({ characterRace: { value: 'human' } })),
    watch: jest.fn(() => ({ unsubscribe: jest.fn() })),
    control: {},
    formState: { errors: {} },
  };

  const mockUseData = {
    archetypeOptions: [{ label: 'Warrior', value: 'warrior' }],
    challengeRatingOptions: [{ label: '1', value: '1' }],
    generatedActions: null,
    handleGenerateActions: jest.fn(),
    handleGenerateName: jest.fn(),
    handleGenerateMonsterName: jest.fn(),
    isGeneratingActions: false,
    monsterType: 'humanoid',
    onSubmit: jest.fn(),
    updateForm: jest.fn(),
    UseForm: mockUseForm,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(useDataHook, 'useData').mockReturnValue(mockUseData as any);
  });

  it('renders without crashing', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} />);
  });

  it('displays frame with correct subtitle', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} />);
    expect(screen.getByText('Set the basics and let the generator do the rest. Perfect for creating NPCs and enemies on the fly.')).toBeInTheDocument();
  });

  it('renders Stats section (Step 1)', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} />);
    expect(screen.getByTestId('section-Stats')).toBeInTheDocument();
    expect(screen.getByTestId('quick-monster-stats-section')).toBeInTheDocument();
  });

  it('renders Saving Throws & Skills section (Step 2)', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} />);
    expect(screen.getByTestId('section-Saving Throws & Skills')).toBeInTheDocument();
    expect(screen.getByTestId('saves-skills-section')).toBeInTheDocument();
  });

  it('renders Creature Description section (Step 3)', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} />);
    expect(screen.getByTestId('section-Creature Description')).toBeInTheDocument();
    expect(screen.getByTestId('creature-description-section')).toBeInTheDocument();
  });

  it('renders Name section (Step 4)', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} />);
    expect(screen.getByTestId('section-Name')).toBeInTheDocument();
    expect(screen.getByTestId('name-form-field')).toBeInTheDocument();
  });

  it('calls useData hook with props', () => {
    const onGenerateMonster = jest.fn();
    const token = 'test-token';
    render(<QuickGenerateMonster onGenerateMonster={onGenerateMonster} token={token} />);

    expect(useDataHook.useData).toHaveBeenCalledWith({
      onGenerateMonster,
      token,
      isLoading: undefined,
    });
  });

  it('renders Next and Skip buttons on step 1', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} />);
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Skip')).toBeInTheDocument();
  });

  it('shows step indicator', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} />);
    expect(screen.getByText(/Step 1 of 4/)).toBeInTheDocument();
  });

  it('calls handleGenerateMonsterName when Generate Monster Name clicked', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} />);
    const button = screen.getByText('Generate Monster Name');
    fireEvent.click(button);

    expect(mockUseData.handleGenerateMonsterName).toHaveBeenCalled();
  });

  it('calls handleGenerateName when Generate Name clicked', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} />);
    const button = screen.getByText('Generate Name');
    fireEvent.click(button);

    expect(mockUseData.handleGenerateName).toHaveBeenCalledWith('male', 'human');
  });

  it('does not render development debug panel in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} />);
    const debugPanel = screen.queryByText((content, element) => {
      return element?.tagName === 'PRE';
    });
    expect(debugPanel).not.toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });
});
