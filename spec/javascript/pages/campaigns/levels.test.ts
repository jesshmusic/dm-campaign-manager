import {
  LEVEL_OPTIONS,
  MAX_LEVEL,
  MIN_LEVEL,
} from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/levels';

describe('LEVEL_OPTIONS', () => {
  it('offers every level from 1 to 20', () => {
    expect([MIN_LEVEL, MAX_LEVEL]).toEqual([1, 20]);
    expect(LEVEL_OPTIONS).toHaveLength(20);
    expect(LEVEL_OPTIONS[0]).toEqual({ value: '1', label: '1' });
    expect(LEVEL_OPTIONS[19]).toEqual({ value: '20', label: '20' });
  });
});
