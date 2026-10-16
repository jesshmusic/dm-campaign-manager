import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import {
  DraftCoins,
  DraftNumber,
  DraftTextArea,
  parseWholeNumber,
  textOrNull,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/DraftFields';
import { coinDrafts } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/CoinFields';

describe('parseWholeNumber', () => {
  it('is null when blank', () => {
    expect(parseWholeNumber('  ', 0, 10)).toBeNull();
  });

  it('is the number when it is a whole number in range', () => {
    expect(parseWholeNumber(' 7 ', 0, 10)).toBe(7);
    expect(parseWholeNumber('0', 0, 10)).toBe(0);
    expect(parseWholeNumber('10', 0, 10)).toBe(10);
  });

  it('is undefined otherwise', () => {
    expect(parseWholeNumber('11', 0, 10)).toBeUndefined();
    expect(parseWholeNumber('-1', 0, 10)).toBeUndefined();
    expect(parseWholeNumber('2.5', 0, 10)).toBeUndefined();
    expect(parseWholeNumber('lots', 0, 10)).toBeUndefined();
  });
});

describe('textOrNull', () => {
  it('keeps text as typed, and is null when blank', () => {
    expect(textOrNull(' Zombies ')).toBe(' Zombies ');
    expect(textOrNull(' \n ')).toBeNull();
  });
});

describe('DraftTextArea', () => {
  it('changes the draft as you type, saving nothing itself', () => {
    const onChange = jest.fn();
    render(<DraftTextArea label="Strong start" value="The bell" onChange={onChange} />);
    const field = screen.getByRole('textbox', { name: 'Strong start' });

    expect(field).toHaveValue('The bell');
    expect(screen.queryByText('Strong start')).not.toBeInTheDocument();
    fireEvent.change(field, { target: { value: 'The bell tolls' } });
    fireEvent.blur(field);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('The bell tolls');
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('can show its label', () => {
    render(<DraftTextArea label="Reward notes" showLabel value="" onChange={jest.fn()} />);

    expect(screen.getByLabelText('Reward notes')).toBe(screen.getByRole('textbox'));
  });

  it("adds a helper's text below what's there", async () => {
    const onChange = jest.fn();
    const generate = jest.fn().mockResolvedValue('A dragon attacks');
    render(
      <DraftTextArea
        label="Strong start"
        value="The bell tolls"
        onChange={onChange}
        helper={{ label: 'Suggest a hook', generate }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Suggest a hook' }));

    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith('The bell tolls\n\nA dragon attacks'),
    );
    expect(screen.getByRole('button', { name: 'Suggest a hook' })).toBeEnabled();
  });

  it("fills in a helper's text when there's none", async () => {
    const onChange = jest.fn();
    render(
      <DraftTextArea
        label="Strong start"
        value=""
        onChange={onChange}
        helper={{ label: 'Suggest a hook', generate: () => Promise.resolve('A dragon attacks') }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Suggest a hook' }));

    await waitFor(() => expect(onChange).toHaveBeenCalledWith('A dragon attacks'));
  });

  it('says when the helper fails', async () => {
    const onChange = jest.fn();
    render(
      <DraftTextArea
        label="Strong start"
        value=""
        onChange={onChange}
        helper={{ label: 'Suggest a hook', generate: () => Promise.reject(new Error('down')) }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Suggest a hook' }));

    expect(
      await screen.findByText("Suggest a hook didn't work this time. Please try again."),
    ).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('DraftNumber', () => {
  it('is a labelled whole-number input that changes the draft as you type', () => {
    const onChange = jest.fn();
    render(
      <DraftNumber
        label="XP"
        hint="For the whole party"
        value="450"
        min={0}
        max={1_000_000}
        placeholder="None"
        onChange={onChange}
      />,
    );
    const xp = screen.getByRole('spinbutton', { name: 'XP' });

    expect(xp).toHaveValue(450);
    expect(xp).toHaveAttribute('max', '1000000');
    expect(screen.getByText('For the whole party')).toBeInTheDocument();
    fireEvent.change(xp, { target: { value: '500' } });

    expect(onChange).toHaveBeenCalledWith('500');
  });
});

describe('DraftCoins', () => {
  it('has an input for each coin and changes the draft as you type', () => {
    const onChange = jest.fn();
    const value = coinDrafts({ gp: 50 });
    render(<DraftCoins value={value} onChange={onChange} />);

    expect(screen.getByRole('group', { name: 'Coins' })).toBeInTheDocument();
    expect(
      screen.getAllByRole('spinbutton').map((input) => input.getAttribute('aria-label')),
    ).toEqual([
      'Platinum pieces (pp)',
      'Gold pieces (gp)',
      'Electrum pieces (ep)',
      'Silver pieces (sp)',
      'Copper pieces (cp)',
    ]);
    expect(screen.getByRole('spinbutton', { name: 'Gold pieces (gp)' })).toHaveValue(50);
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Silver pieces (sp)' }), {
      target: { value: '12' },
    });

    expect(onChange).toHaveBeenCalledWith({ ...value, sp: '12' });
  });
});
