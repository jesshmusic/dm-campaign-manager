import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import CoinFields, {
  coinDrafts,
  formatCoins,
  parseCoins,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/CoinFields';

const coin = (name: string) => screen.getByRole('spinbutton', { name });
const gold = () => coin('Gold pieces (gp)');

describe('formatCoins', () => {
  it('lists the coins there are, most valuable first', () => {
    expect(formatCoins({ sp: 12, gp: 1200, cp: 0, pp: 3 })).toBe('3 pp, 1,200 gp, 12 sp');
  });

  it('is empty with no coins', () => {
    expect(formatCoins({})).toBe('');
    expect(formatCoins({ gp: 0 })).toBe('');
  });
});

describe('coinDrafts', () => {
  it('is the text of each coin, blank for none', () => {
    expect(coinDrafts({ gp: 50, sp: 0 })).toEqual({ pp: '', gp: '50', ep: '', sp: '', cp: '' });
  });
});

describe('parseCoins', () => {
  const drafts = (coins: Partial<Record<'pp' | 'gp' | 'ep' | 'sp' | 'cp', string>>) => ({
    ...coinDrafts({}),
    ...coins,
  });

  it('keeps only the coins above zero, most valuable first', () => {
    expect(parseCoins(drafts({ sp: ' 12 ', cp: '0', pp: '3' }))).toEqual({ pp: 3, sp: 12 });
    expect(JSON.stringify(parseCoins(drafts({ sp: '12', pp: '3' })))).toBe('{"pp":3,"sp":12}');
    expect(parseCoins(drafts({}))).toEqual({});
  });

  it('is null unless every coin is a whole number from 0 to 1,000,000', () => {
    expect(parseCoins(drafts({ gp: '-1' }))).toBeNull();
    expect(parseCoins(drafts({ gp: '1.5' }))).toBeNull();
    expect(parseCoins(drafts({ gp: '1000001' }))).toBeNull();
    expect(parseCoins(drafts({ gp: '1000000' }))).toEqual({ gp: 1_000_000 });
  });
});

describe('CoinFields', () => {
  it('has an input for each kind of coin, showing the saved coins', () => {
    render(<CoinFields value={{ gp: 50, sp: 12 }} onSave={jest.fn()} />);

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
    expect(coin('Platinum pieces (pp)')).toHaveValue(null);
    expect(gold()).toHaveValue(50);
    expect(coin('Silver pieces (sp)')).toHaveValue(12);
    expect(gold()).toHaveAttribute('min', '0');
  });

  it('saves the coins there are when an input loses focus', async () => {
    const onSave = jest.fn().mockResolvedValue(true);
    render(<CoinFields value={{ gp: 50 }} onSave={onSave} />);

    fireEvent.change(coin('Platinum pieces (pp)'), { target: { value: '2' } });
    fireEvent.change(coin('Copper pieces (cp)'), { target: { value: '0' } });
    expect(onSave).not.toHaveBeenCalled();
    fireEvent.blur(coin('Copper pieces (cp)'));

    expect(onSave).toHaveBeenCalledWith({ pp: 2, gp: 50 });
    expect(await screen.findByText('Saved')).toBeInTheDocument();
  });

  it('clears a coin', async () => {
    const onSave = jest.fn().mockResolvedValue(true);
    render(<CoinFields value={{ gp: 50, sp: 12 }} onSave={onSave} />);

    fireEvent.change(gold(), { target: { value: '' } });
    fireEvent.blur(gold());

    expect(onSave).toHaveBeenCalledWith({ sp: 12 });
    await waitFor(() => expect(screen.getByText('Saved')).toBeInTheDocument());
  });

  it('does not save when nothing changed', () => {
    const onSave = jest.fn().mockResolvedValue(true);
    render(<CoinFields value={{ gp: 50 }} onSave={onSave} />);

    fireEvent.blur(gold());
    fireEvent.change(gold(), { target: { value: '60' } });
    fireEvent.change(gold(), { target: { value: '50' } });
    fireEvent.change(coin('Silver pieces (sp)'), { target: { value: '0' } });
    fireEvent.blur(gold());

    expect(onSave).not.toHaveBeenCalled();
  });

  it("won't save coins that are not whole numbers from 0 to 1,000,000", () => {
    const onSave = jest.fn().mockResolvedValue(true);
    render(<CoinFields value={{}} onSave={onSave} />);

    ['-1', '1.5', '1000001'].forEach((value) => {
      fireEvent.change(gold(), { target: { value } });
      fireEvent.blur(gold());
    });

    expect(onSave).not.toHaveBeenCalled();
    expect(
      screen.getByText('Coins must be whole numbers from 0 to 1,000,000.'),
    ).toBeInTheDocument();
  });

  it('says when saving failed', async () => {
    const onSave = jest.fn().mockResolvedValue(false);
    render(<CoinFields value={{}} onSave={onSave} />);

    fireEvent.change(gold(), { target: { value: '5' } });
    fireEvent.blur(gold());

    expect(await screen.findByText("Couldn't save. Try again.")).toBeInTheDocument();
  });

  it('shows saving progress', async () => {
    let finish!: (saved: boolean) => void;
    const onSave = jest.fn(() => new Promise<boolean>((resolve) => (finish = resolve)));
    render(<CoinFields value={{}} onSave={onSave} />);

    fireEvent.change(gold(), { target: { value: '5' } });
    fireEvent.blur(gold());

    expect(screen.getByText('Saving…')).toBeInTheDocument();
    finish(true);
    expect(await screen.findByText('Saved')).toBeInTheDocument();
  });

  it('shows new coins when they change elsewhere', () => {
    const { rerender } = render(<CoinFields value={{ gp: 50 }} onSave={jest.fn()} />);

    rerender(<CoinFields value={{ gp: 75, cp: 3 }} onSave={jest.fn()} />);

    expect(gold()).toHaveValue(75);
    expect(coin('Copper pieces (cp)')).toHaveValue(3);
  });
});
