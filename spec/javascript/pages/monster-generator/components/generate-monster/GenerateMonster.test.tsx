import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GenerateMonster from '../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/GenerateMonster';
import * as useDataHook from '../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/use-data';

jest.mock('react-icons/gi', () => ({
  GiDiceTwentyFacesTwenty: () => <div>DiceIcon</div>,
}));

jest.mock('react-icons/all', () => ({
  GiLinkedRings: () => <div>SpinnerIcon</div>,
}));

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Frame/Frame', () => {
  return function MockFrame({ title, subtitle, children }: any) {
    return (
      <div data-testid="frame">
        <h1>{title}</h1>
        <h2>{subtitle}</h2>
        {children}
      </div>
    );
  };
});

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return function MockButton({ onClick, title, disabled, type }: any) {
    return (
      <button onClick={onClick} disabled={disabled} type={type}>
        {title}
      </button>
    );
  };
});

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/NameFormField', () => {
  return function MockNameFormField() {
    return <div data-testid="name-form-field">Name Field</div>;
  };
});

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/GenMonsterSection', () => {
  return function MockGenMonsterSection({ heading, children }: any) {
    return (
      <div data-testid={`section-${heading.toLowerCase().replace(/ /g, '-')}`}>
        <h3>{heading}</h3>
        {children}
      </div>
    );
  };
});

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/MonsterStatsSection', () => {
  return function MockMonsterStatsSection() {
    return <div data-testid="monster-stats-section">Monster Stats</div>;
  };
});

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/AbilitiesSection', () => {
  return function MockAbilitiesSection() {
    return <div data-testid="abilities-section">Abilities</div>;
  };
});

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/SavesSkillsSection', () => {
  return function MockSavesSkillsSection() {
    return <div data-testid="saves-skills-section">Saves & Skills</div>;
  };
});

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/senses/SensesForm', () => {
  return function MockSensesForm() {
    return <div data-testid="senses-form">Senses</div>;
  };
});

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/speeds/SpeedsForm', () => {
  return function MockSpeedsForm() {
    return <div data-testid="speeds-form">Speeds</div>;
  };
});

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/ResistancesSection', () => {
  return function MockResistancesSection() {
    return <div data-testid="resistances-section">Resistances</div>;
  };
});

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/actions/action-forms/BaseActionsFormSection', () => {
  return function MockBaseActionsFormSection({ singularTitle }: any) {
    return <div data-testid={`actions-${singularTitle.toLowerCase().replace(/ /g, '-')}`}>{singularTitle}</div>;
  };
});

describe('GenerateMonster', () => {
  const mockHandleCalculateCR = jest.fn();
  const mockHandleGenerateName = jest.fn();
  const mockHandleGenerateMonsterName = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockUpdateForm = jest.fn();
  const mockOnGenerateMonster = jest.fn();

  const mockUseForm = {
    handleSubmit: (fn: any) => fn,
    getValues: jest.fn(),
    register: jest.fn(),
    formState: { errors: {} },
    watch: jest.fn(() => ({ unsubscribe: jest.fn() })),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(useDataHook, 'useData').mockReturnValue({
      handleCalculateCR: mockHandleCalculateCR,
      handleGenerateName: mockHandleGenerateName,
      handleGenerateMonsterName: mockHandleGenerateMonsterName,
      onSubmit: mockOnSubmit,
      updateForm: mockUpdateForm,
      UseForm: mockUseForm as any,
    });
  });

  const defaultProps = {
    isLoading: false,
    onGenerateMonster: mockOnGenerateMonster,
  };

  it('renders without crashing', () => {
    render(<GenerateMonster {...defaultProps} />);
  });

  it('renders Frame with correct title and subtitle', () => {
    render(<GenerateMonster {...defaultProps} />);
    expect(screen.getByText('Monster Creator')).toBeInTheDocument();
    expect(screen.getByText('Select options to create a new Monster')).toBeInTheDocument();
  });

  it('renders NameFormField', () => {
    render(<GenerateMonster {...defaultProps} />);
    expect(screen.getByTestId('name-form-field')).toBeInTheDocument();
  });

  it('renders Stats section', () => {
    render(<GenerateMonster {...defaultProps} />);
    expect(screen.getByTestId('section-stats')).toBeInTheDocument();
    expect(screen.getByTestId('monster-stats-section')).toBeInTheDocument();
  });

  it('renders Ability Scores section', () => {
    render(<GenerateMonster {...defaultProps} />);
    expect(screen.getByTestId('section-ability-scores')).toBeInTheDocument();
    expect(screen.getByTestId('abilities-section')).toBeInTheDocument();
  });

  it('renders Saving Throws & Skills section', () => {
    render(<GenerateMonster {...defaultProps} />);
    expect(screen.getByTestId('section-saving-throws-&-skills')).toBeInTheDocument();
    expect(screen.getByTestId('saves-skills-section')).toBeInTheDocument();
  });

  it('renders Senses section', () => {
    render(<GenerateMonster {...defaultProps} />);
    expect(screen.getByTestId('section-senses')).toBeInTheDocument();
    expect(screen.getByTestId('senses-form')).toBeInTheDocument();
  });

  it('renders Speeds section', () => {
    render(<GenerateMonster {...defaultProps} />);
    expect(screen.getByTestId('section-speeds')).toBeInTheDocument();
    expect(screen.getByTestId('speeds-form')).toBeInTheDocument();
  });

  it('renders Resistances & Vulnerabilities section', () => {
    render(<GenerateMonster {...defaultProps} />);
    expect(screen.getByTestId('section-resistances-&-vulnerabilities')).toBeInTheDocument();
    expect(screen.getByTestId('resistances-section')).toBeInTheDocument();
  });

  it('renders Actions section', () => {
    render(<GenerateMonster {...defaultProps} />);
    expect(screen.getByTestId('section-actions')).toBeInTheDocument();
    expect(screen.getByTestId('actions-action')).toBeInTheDocument();
  });

  it('renders Special Abilities section', () => {
    render(<GenerateMonster {...defaultProps} />);
    expect(screen.getByTestId('section-special-abilities')).toBeInTheDocument();
    expect(screen.getByTestId('actions-special-ability')).toBeInTheDocument();
  });

  it('renders Reactions section', () => {
    render(<GenerateMonster {...defaultProps} />);
    expect(screen.getByTestId('section-reactions')).toBeInTheDocument();
    expect(screen.getByTestId('actions-reaction')).toBeInTheDocument();
  });

  it('renders Legendary Actions section', () => {
    render(<GenerateMonster {...defaultProps} />);
    expect(screen.getByTestId('section-legendary-actions')).toBeInTheDocument();
    expect(screen.getByTestId('actions-legendary-action')).toBeInTheDocument();
  });

  it('renders submit button with Generate Monster text when not loading', () => {
    render(<GenerateMonster {...defaultProps} />);
    expect(screen.getByText('Generate Monster')).toBeInTheDocument();
  });

  it('renders submit button with Generating... text when loading', () => {
    render(<GenerateMonster {...defaultProps} isLoading={true} />);
    expect(screen.getByText('Generating...')).toBeInTheDocument();
  });

  it('disables submit button when loading', () => {
    render(<GenerateMonster {...defaultProps} isLoading={true} />);
    const button = screen.getByText('Generating...');
    expect(button).toBeDisabled();
  });

  it('does not disable submit button when not loading', () => {
    render(<GenerateMonster {...defaultProps} isLoading={false} />);
    const button = screen.getByText('Generate Monster');
    expect(button).not.toBeDisabled();
  });

  it('calls onSubmit when form submitted', () => {
    render(<GenerateMonster {...defaultProps} />);
    const form = screen.getByTestId('frame').querySelector('form');
    fireEvent.submit(form!);
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('subscribes to form watch on mount', () => {
    render(<GenerateMonster {...defaultProps} />);
    expect(mockUseForm.watch).toHaveBeenCalled();
  });

  it('passes token to useData hook', () => {
    render(<GenerateMonster {...defaultProps} token="test-token" />);
    expect(useDataHook.useData).toHaveBeenCalledWith({
      isLoading: false,
      onGenerateMonster: mockOnGenerateMonster,
      token: 'test-token',
    });
  });
});
