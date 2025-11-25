import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/GenMonsterSection', () => {
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

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/FormSelectAsync', () => {
  return function MockFormSelectAsync({ label }: any) {
    return <div data-testid="form-select-async">{label}</div>;
  };
});

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/SavesSkillsSection', () => {
  return function MockSavesSkillsSection() {
    return <div data-testid="saves-skills-section">Saves Skills</div>;
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
    getMonsterActions: jest.fn(),
    getSpecialAbilities: jest.fn(),
    getSpells: jest.fn(),
    handleGenerateName: jest.fn(),
    handleGenerateMonsterName: jest.fn(),
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

  it('displays frame with correct title', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} />);
    expect(screen.getByText('Random Monster Generator')).toBeInTheDocument();
  });

  it('displays frame with correct subtitle', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} />);
    expect(screen.getByText('Select options to create a new Monster')).toBeInTheDocument();
  });

  it('renders NameFormField', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} />);
    expect(screen.getByTestId('name-form-field')).toBeInTheDocument();
  });

  it('renders Stats section', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} />);
    expect(screen.getByTestId('section-Stats')).toBeInTheDocument();
    expect(screen.getByTestId('quick-monster-stats-section')).toBeInTheDocument();
  });

  it('renders Traits section', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} />);
    expect(screen.getByTestId('section-Traits')).toBeInTheDocument();
    expect(screen.getByText('Search for and select special abilities from existing monsters')).toBeInTheDocument();
  });

  it('renders Actions section', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} />);
    expect(screen.getByTestId('section-Actions')).toBeInTheDocument();
    expect(screen.getByText('Search for and select actions from existing monsters')).toBeInTheDocument();
  });

  it('renders Saving Throws & Skills section', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} />);
    expect(screen.getByTestId('section-Saving Throws & Skills')).toBeInTheDocument();
    expect(screen.getByTestId('saves-skills-section')).toBeInTheDocument();
  });

  it('renders Spells section', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} />);
    expect(screen.getByTestId('section-Spells')).toBeInTheDocument();
    expect(screen.getByText('Spells (search by name, level, or school)')).toBeInTheDocument();
  });

  it('renders Submit section with button', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} />);
    expect(screen.getByTestId('section-Submit')).toBeInTheDocument();
    expect(screen.getByText('Generate Monster')).toBeInTheDocument();
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

  it('displays "Generating..." when isLoading is true', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} isLoading={true} />);
    expect(screen.getByText('Generating...')).toBeInTheDocument();
  });

  it('displays "Generate Monster" when isLoading is false', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} isLoading={false} />);
    expect(screen.getByText('Generate Monster')).toBeInTheDocument();
  });

  it('disables submit button when isLoading is true', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} isLoading={true} />);
    const button = screen.getByText('Generating...');
    expect(button).toBeDisabled();
  });

  it('enables submit button when isLoading is false', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} isLoading={false} />);
    const button = screen.getByText('Generate Monster');
    expect(button).not.toBeDisabled();
  });

  it('submits form when Generate Monster button clicked', () => {
    render(<QuickGenerateMonster onGenerateMonster={jest.fn()} />);
    const button = screen.getByText('Generate Monster');
    fireEvent.click(button);

    expect(mockUseData.onSubmit).toHaveBeenCalled();
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
