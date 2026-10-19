import {
  quickStats,
  signed,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/CharacterSheetView';

describe('signed', () => {
  it('writes modifiers with their sign', () => {
    expect(signed(3)).toBe('+3');
    expect(signed(0)).toBe('+0');
    expect(signed(-1)).toBe('-1');
    expect(signed(undefined)).toBe('—');
  });
});

describe('quickStats', () => {
  it('lists what the sheet has', () => {
    expect(quickStats({ ac: 15, hpMax: 27 })).toBe('AC 15 · HP 27');
    expect(quickStats({})).toBe('');
  });
});
