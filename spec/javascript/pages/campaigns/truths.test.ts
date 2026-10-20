import {
  emptyTruth,
  truthFromText,
  truthsFrom,
  truthsMissingName,
  truthsToSave,
} from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/truths';

describe('truthFromText', () => {
  it('splits after the first sentence, keeping the punctuation on the name', () => {
    expect(truthFromText('Greyhawk runs on gold. The Directing Oligarchy governs.')).toEqual({
      name: 'Greyhawk runs on gold.',
      description: 'The Directing Oligarchy governs.',
    });
  });

  it('splits after "!" or "?" too, and only at the first sentence end', () => {
    expect(truthFromText('The dead walk! Nobody knows why. The priests say a curse.')).toEqual({
      name: 'The dead walk!',
      description: 'Nobody knows why. The priests say a curse.',
    });
    expect(truthFromText('Who rules? Gold does.')).toEqual({
      name: 'Who rules?',
      description: 'Gold does.',
    });
  });

  it('keeps text with no sentence end, or one that ends the text, as the whole name', () => {
    expect(truthFromText('No punctuation here')).toEqual({
      name: 'No punctuation here',
      description: '',
    });
    expect(truthFromText('  The dead walk.  ')).toEqual({
      name: 'The dead walk.',
      description: '',
    });
    expect(truthFromText('e.g.no space')).toEqual({ name: 'e.g.no space', description: '' });
  });

  it('splits at a sentence end followed by a new line or extra spaces', () => {
    expect(truthFromText('The dead walk.\n  Nobody knows why')).toEqual({
      name: 'The dead walk.',
      description: 'Nobody knows why',
    });
    expect(truthFromText('Wait... what')).toEqual({ name: 'Wait...', description: 'what' });
  });
});

describe('truthsFrom', () => {
  it('turns text with one truth per line into truths, skipping blank lines', () => {
    expect(
      truthsFrom('Greyhawk runs on gold. Anything can be bought.\n\n  \nThe dead walk'),
    ).toEqual([
      { name: 'Greyhawk runs on gold.', description: 'Anything can be bought.' },
      { name: 'The dead walk', description: '' },
    ]);
  });

  it('takes a mix of truths and older strings, in order', () => {
    expect(truthsFrom(['First. One', { name: 'Second', description: 'Two' }, '', 'Third'])).toEqual(
      [
        { name: 'First.', description: 'One' },
        { name: 'Second', description: 'Two' },
        { name: 'Third', description: '' },
      ],
    );
  });

  it('keeps rows the DM is still filling in, as they are', () => {
    expect(truthsFrom([{ name: ' ', description: '' }, { name: 'Gold ' }])).toEqual([
      { name: ' ', description: '' },
      { name: 'Gold ', description: '' },
    ]);
  });

  it('treats anything else as no truths', () => {
    expect(truthsFrom(undefined)).toEqual([]);
    expect(truthsFrom(null)).toEqual([]);
    expect(truthsFrom(true)).toEqual([]);
    expect(truthsFrom([3, null, { name: 5 }])).toEqual([{ name: '', description: '' }]);
  });
});

describe('truthsToSave', () => {
  it('trims each truth and leaves out empty rows', () => {
    expect(
      truthsToSave([
        { name: ' Gold rules ', description: ' All of it ' },
        emptyTruth(),
        { name: '  ', description: ' ' },
        { name: '', description: 'Orphan' },
      ]),
    ).toEqual([
      { name: 'Gold rules', description: 'All of it' },
      { name: '', description: 'Orphan' },
    ]);
  });
});

describe('truthsMissingName', () => {
  it('is true when a truth has a description but no name', () => {
    expect(truthsMissingName([{ name: ' ', description: 'Orphan' }])).toBe(true);
  });

  it('is false for named truths and empty rows', () => {
    expect(truthsMissingName([{ name: 'Gold', description: '' }, emptyTruth()])).toBe(false);
    expect(truthsMissingName([])).toBe(false);
  });
});
