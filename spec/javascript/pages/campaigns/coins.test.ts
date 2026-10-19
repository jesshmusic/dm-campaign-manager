import {
  coinDrafts,
  formatCoins,
  parseCoins,
} from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/coins';

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
