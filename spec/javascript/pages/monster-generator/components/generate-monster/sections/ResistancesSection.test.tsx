import React from 'react';
import { render, screen } from '../../../../../test-utils';
import ResistancesSection from '../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/ResistancesSection';

jest.mock('../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/FormSelectAsync', () => {
  return function MockFormSelectAsync({ label }: any) {
    return <div data-testid={`form-select-async-${label}`}>{label}</div>;
  };
});

jest.mock('../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/FormSelect', () => {
  return function MockFormSelect({ label }: any) {
    return <div data-testid={`form-select-${label}`}>{label}</div>;
  };
});

describe('ResistancesSection', () => {
  const mockUseForm = {
    control: {},
  };

  it('renders without crashing', () => {
    render(<ResistancesSection UseForm={mockUseForm as any} />);
  });

  it('renders Condition Immunities field', () => {
    render(<ResistancesSection UseForm={mockUseForm as any} />);
    expect(screen.getByText('Condition Immunities')).toBeInTheDocument();
  });

  it('renders Damage Resistances field', () => {
    render(<ResistancesSection UseForm={mockUseForm as any} />);
    expect(screen.getByText('Damage Resistances')).toBeInTheDocument();
  });

  it('renders Damage Immunities field', () => {
    render(<ResistancesSection UseForm={mockUseForm as any} />);
    expect(screen.getByText('Damage Immunities')).toBeInTheDocument();
  });

  it('renders Damage Vulnerabilities field', () => {
    render(<ResistancesSection UseForm={mockUseForm as any} />);
    expect(screen.getByText('Damage Vulnerabilities')).toBeInTheDocument();
  });

  it('uses async select for Condition Immunities', () => {
    render(<ResistancesSection UseForm={mockUseForm as any} />);
    expect(screen.getByTestId('form-select-async-Condition Immunities')).toBeInTheDocument();
  });

  it('uses regular select for damage fields', () => {
    render(<ResistancesSection UseForm={mockUseForm as any} />);
    expect(screen.getByTestId('form-select-Damage Resistances')).toBeInTheDocument();
    expect(screen.getByTestId('form-select-Damage Immunities')).toBeInTheDocument();
    expect(screen.getByTestId('form-select-Damage Vulnerabilities')).toBeInTheDocument();
  });
});
