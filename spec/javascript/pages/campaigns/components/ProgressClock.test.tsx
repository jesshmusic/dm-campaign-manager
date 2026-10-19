import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils';
import ProgressClock from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/ProgressClock';
import { theme } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/theme';

const segments = (container: HTMLElement) => Array.from(container.querySelectorAll('path'));

describe('ProgressClock', () => {
  it('labels the clock with how full it is', () => {
    render(<ProgressClock name="The Rising Dead" segments={6} filled={2} />);

    expect(
      screen.getByRole('img', { name: 'The Rising Dead: 2 of 6 segments filled' }),
    ).toBeInTheDocument();
  });

  it('draws one wedge per segment and fills the first ones', () => {
    const { container } = render(<ProgressClock name="Doom" segments={4} filled={3} />);

    expect(segments(container).map((path) => path.getAttribute('fill'))).toEqual([
      theme.colors.primary,
      theme.colors.primary,
      theme.colors.primary,
      theme.colors.white,
    ]);
  });

  it('fills up to the clicked segment', () => {
    const onChange = jest.fn();
    const { container } = render(
      <ProgressClock name="Doom" segments={6} filled={2} onChange={onChange} />,
    );

    fireEvent.click(segments(container)[4]);

    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('empties back to a lower segment when one below the last filled is clicked', () => {
    const onChange = jest.fn();
    const { container } = render(
      <ProgressClock name="Doom" segments={6} filled={4} onChange={onChange} />,
    );

    fireEvent.click(segments(container)[0]);

    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('empties the last filled segment when it is clicked', () => {
    const onChange = jest.fn();
    const { container } = render(
      <ProgressClock name="Doom" segments={6} filled={2} onChange={onChange} />,
    );

    fireEvent.click(segments(container)[1]);

    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('can empty the clock by clicking the only filled segment', () => {
    const onChange = jest.fn();
    const { container } = render(
      <ProgressClock name="Doom" segments={6} filled={1} onChange={onChange} />,
    );

    fireEvent.click(segments(container)[0]);

    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('advances and winds back one segment with the buttons', () => {
    const onChange = jest.fn();
    render(<ProgressClock name="Doom" segments={6} filled={2} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Advance Doom' }));
    expect(onChange).toHaveBeenLastCalledWith(3);

    fireEvent.click(screen.getByRole('button', { name: 'Wind back Doom' }));
    expect(onChange).toHaveBeenLastCalledWith(1);
  });

  it('disables winding back an empty clock', () => {
    render(<ProgressClock name="Doom" segments={6} filled={0} onChange={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Wind back Doom' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Advance Doom' })).toBeEnabled();
  });

  it('disables advancing a full clock', () => {
    render(<ProgressClock name="Doom" segments={6} filled={6} onChange={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Advance Doom' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Wind back Doom' })).toBeEnabled();
  });

  it('is read-only without onChange', () => {
    const { container } = render(<ProgressClock name="Doom" segments={4} filled={1} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    segments(container).forEach((path) => expect(path).not.toHaveAttribute('role'));
    expect(() => fireEvent.click(segments(container)[2])).not.toThrow();
  });

  it('makes each segment clickable when editable', () => {
    const { container } = render(
      <ProgressClock name="Doom" segments={4} filled={1} onChange={jest.fn()} />,
    );

    segments(container).forEach((path) => expect(path).toHaveAttribute('role', 'button'));
  });

  it('uses the requested size', () => {
    render(<ProgressClock name="Doom" segments={4} filled={1} size={40} />);

    const svg = screen.getByRole('img');
    expect(svg).toHaveAttribute('width', '40');
    expect(svg).toHaveAttribute('viewBox', '0 0 40 40');
  });
});
