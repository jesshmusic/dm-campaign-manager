import React from 'react';
import { render, screen, fireEvent } from '../../../../test-utils';
import GenerateMonster from '../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/GenerateMonster';
import * as useDataHook from '../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/use-data';

jest.mock('react-icons/gi', () => ({
  GiDiceTwentyFacesTwenty: () => <div>DiceIcon</div>,
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
  return function MockGenMonsterSection({ heading, children, step, currentStep, isMultiStep }: any) {
    // In multi-step mode, only show content for the current step
    const isVisible = !isMultiStep || currentStep === step;
    return (
      <div data-testid={`section-${heading.toLowerCase().replace(/[ &]/g, '-')}`} style={{ display: isVisible ? 'block' : 'none' }}>
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
    expect(screen.getByText('Create NPC')).toBeInTheDocument();
    expect(screen.getByText('Full control over every detail. Build custom NPCs and creatures with automatic Challenge Rating calculation.')).toBeInTheDocument();
  });

  // Step 1: Stats
  it('renders Stats section', () => {
    render(<GenerateMonster {...defaultProps} />);
    expect(screen.getByTestId('section-stats')).toBeInTheDocument();
    expect(screen.getByTestId('monster-stats-section')).toBeInTheDocument();
  });

  // Step 2: Abilities & Defenses (combined)
  it('renders Abilities & Defenses section with abilities, saves/skills, and resistances', () => {
    render(<GenerateMonster {...defaultProps} />);
    expect(screen.getByTestId('section-abilities---defenses')).toBeInTheDocument();
    expect(screen.getByTestId('abilities-section')).toBeInTheDocument();
    expect(screen.getByTestId('saves-skills-section')).toBeInTheDocument();
    expect(screen.getByTestId('resistances-section')).toBeInTheDocument();
  });

  // Step 3: Senses & Movement (combined)
  it('renders Senses & Movement section with senses and speeds', () => {
    render(<GenerateMonster {...defaultProps} />);
    expect(screen.getByTestId('section-senses---movement')).toBeInTheDocument();
    expect(screen.getByTestId('senses-form')).toBeInTheDocument();
    expect(screen.getByTestId('speeds-form')).toBeInTheDocument();
  });

  // Step 4: Actions
  it('renders Actions section', () => {
    render(<GenerateMonster {...defaultProps} />);
    expect(screen.getByTestId('section-actions')).toBeInTheDocument();
    expect(screen.getByTestId('actions-action')).toBeInTheDocument();
  });

  // Step 5: Special Abilities & Reactions (combined)
  it('renders Special Abilities & Reactions section with special abilities, reactions, and legendary actions', () => {
    render(<GenerateMonster {...defaultProps} />);
    expect(screen.getByTestId('section-special-abilities---reactions')).toBeInTheDocument();
    expect(screen.getByTestId('actions-special-ability')).toBeInTheDocument();
    expect(screen.getByTestId('actions-reaction')).toBeInTheDocument();
    expect(screen.getByTestId('actions-legendary-action')).toBeInTheDocument();
  });

  // Step 6: Name
  it('renders Name section with NameFormField', () => {
    render(<GenerateMonster {...defaultProps} />);
    expect(screen.getByTestId('section-name')).toBeInTheDocument();
    expect(screen.getByTestId('name-form-field')).toBeInTheDocument();
  });

  it('renders Next and Skip buttons on step 1', () => {
    render(<GenerateMonster {...defaultProps} />);
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Skip')).toBeInTheDocument();
  });

  it('shows step indicator for 6 steps', () => {
    render(<GenerateMonster {...defaultProps} />);
    expect(screen.getByText(/Step 1 of 6/)).toBeInTheDocument();
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

  describe('step navigation', () => {
    it('navigates to next step when Next is clicked', () => {
      render(<GenerateMonster {...defaultProps} />);

      expect(screen.getByText(/Step 1 of 6/)).toBeInTheDocument();
      fireEvent.click(screen.getByText('Next'));
      expect(screen.getByText(/Step 2 of 6/)).toBeInTheDocument();
    });

    it('navigates to next step when Skip is clicked', () => {
      render(<GenerateMonster {...defaultProps} />);

      expect(screen.getByText(/Step 1 of 6/)).toBeInTheDocument();
      fireEvent.click(screen.getByText('Skip'));
      expect(screen.getByText(/Step 2 of 6/)).toBeInTheDocument();
    });

    it('shows Previous button after step 1', () => {
      render(<GenerateMonster {...defaultProps} />);

      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      fireEvent.click(screen.getByText('Next'));
      expect(screen.getByText('Previous')).toBeInTheDocument();
    });

    it('navigates back when Previous is clicked', () => {
      render(<GenerateMonster {...defaultProps} />);

      fireEvent.click(screen.getByText('Next'));
      expect(screen.getByText(/Step 2 of 6/)).toBeInTheDocument();
      fireEvent.click(screen.getByText('Previous'));
      expect(screen.getByText(/Step 1 of 6/)).toBeInTheDocument();
    });

    it('shows Create NPC button on last step', () => {
      render(<GenerateMonster {...defaultProps} />);

      // Navigate to the last step (step 6)
      for (let i = 0; i < 5; i++) {
        fireEvent.click(screen.getByText('Next'));
      }

      expect(screen.getByText(/Step 6 of 6/)).toBeInTheDocument();
      // The "Create NPC" text appears in both title and button, so check for the submit button specifically
      expect(screen.getByRole('button', { name: 'Create NPC' })).toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
      expect(screen.queryByText('Skip')).not.toBeInTheDocument();
    });

    it('shows Creating... when loading on last step', () => {
      render(<GenerateMonster {...defaultProps} isLoading={true} />);

      // Navigate to the last step
      for (let i = 0; i < 5; i++) {
        fireEvent.click(screen.getByText('Next'));
      }

      expect(screen.getByText('Creating...')).toBeInTheDocument();
    });
  });
});
