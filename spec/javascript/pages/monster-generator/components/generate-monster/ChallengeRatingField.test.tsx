import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChallengeRatingField from '../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/ChallengeRatingField';

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return function MockButton({ onClick, title }: any) {
    return <button onClick={onClick}>{title}</button>;
  };
});

describe('ChallengeRatingField', () => {
  const mockRegister = jest.fn((name) => ({
    name,
    ref: jest.fn(),
    onChange: jest.fn(),
    onBlur: jest.fn(),
  }));

  const mockOnCalculateCr = jest.fn();

  const defaultProps = {
    onCalculateCr: mockOnCalculateCr,
    register: mockRegister as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ChallengeRatingField {...defaultProps} />);
  });

  it('renders Challenge label', () => {
    render(<ChallengeRatingField {...defaultProps} />);
    expect(screen.getByText('Challenge')).toBeInTheDocument();
  });

  it('renders readonly input field', () => {
    render(<ChallengeRatingField {...defaultProps} />);
    const input = screen.getByPlaceholderText('Challenge');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('readonly');
  });

  it('registers challengeRating field', () => {
    render(<ChallengeRatingField {...defaultProps} />);
    expect(mockRegister).toHaveBeenCalledWith('challengeRating');
  });

  it('renders Calculate Challenge button', () => {
    render(<ChallengeRatingField {...defaultProps} />);
    expect(screen.getByText('Calculate Challenge')).toBeInTheDocument();
  });

  it('calls onCalculateCr when button clicked', () => {
    render(<ChallengeRatingField {...defaultProps} />);
    const button = screen.getByText('Calculate Challenge');
    fireEvent.click(button);
    expect(mockOnCalculateCr).toHaveBeenCalled();
  });
});
