import React from 'react';
import { render, screen } from '../../test-utils';
import PrivacyPolicy from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/privacy-policy/PrivacyPolicy';

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/containers/PageContainer', () => {
  return function MockPageContainer({ children, pageTitle }: any) {
    return <div data-testid="page-container" data-page-title={pageTitle}>{children}</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/PageTitle/PageTitle', () => {
  return function MockPageTitle({ title }: any) {
    return <h1 data-testid="page-title">{title}</h1>;
  };
});

describe('PrivacyPolicy', () => {
  it('renders without crashing', () => {
    render(<PrivacyPolicy />);
  });

  it('renders page container with correct title', () => {
    render(<PrivacyPolicy />);
    const container = screen.getByTestId('page-container');
    expect(container).toHaveAttribute('data-page-title', 'Dungeon Master GURU Privacy Policy');
  });

  it('displays privacy policy heading', () => {
    render(<PrivacyPolicy />);
    expect(screen.getByTestId('page-title')).toHaveTextContent('Dungeon Master GURU Privacy Policy');
  });

  it('displays privacy policy content', () => {
    render(<PrivacyPolicy />);
    expect(screen.getByText('Privacy Policy', { selector: 'strong' })).toBeInTheDocument();
  });

  it('displays information collection section', () => {
    render(<PrivacyPolicy />);
    expect(screen.getByText('Information Collection and Use', { selector: 'strong' })).toBeInTheDocument();
  });

  it('displays log data section', () => {
    render(<PrivacyPolicy />);
    expect(screen.getByText('Log Data', { selector: 'strong' })).toBeInTheDocument();
  });

  it('displays cookies section', () => {
    render(<PrivacyPolicy />);
    expect(screen.getByText('Cookies', { selector: 'strong' })).toBeInTheDocument();
  });

  it('displays service providers section', () => {
    render(<PrivacyPolicy />);
    expect(screen.getByText('Service Providers', { selector: 'strong' })).toBeInTheDocument();
  });

  it('displays security section', () => {
    render(<PrivacyPolicy />);
    expect(screen.getByText('Security', { selector: 'strong' })).toBeInTheDocument();
  });

  it('displays contact information', () => {
    render(<PrivacyPolicy />);
    expect(screen.getByText(/contact me at dmguru2025@gmail.com/)).toBeInTheDocument();
  });

  it('includes Google Play Services link', () => {
    render(<PrivacyPolicy />);
    const link = screen.getByText('Google Play Services');
    expect(link).toHaveAttribute('href', 'https://www.google.com/policies/privacy/');
  });

  it('displays effective date', () => {
    render(<PrivacyPolicy />);
    expect(screen.getByText('This policy is effective as of 2023-05-13')).toBeInTheDocument();
  });
});
