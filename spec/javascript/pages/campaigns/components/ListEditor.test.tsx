import React, { useState } from 'react';
import { fireEvent, render, screen } from '../../../test-utils';
import ListEditor, {
  listToSave,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/ListEditor';

// Holds the rows like a form would
const Harness = ({ initial, max = 5 }: { initial: string[]; max?: number }) => {
  const [items, setItems] = useState(initial);
  return (
    <>
      <ListEditor noun="portent" max={max} items={items} onChange={setItems} />
      <output data-testid="items">{JSON.stringify(items)}</output>
    </>
  );
};

const items = () => JSON.parse(screen.getByTestId('items').textContent ?? '[]') as string[];

describe('ListEditor', () => {
  it('shows a numbered box for each row', () => {
    render(<Harness initial={['Graves open', 'Livestock die']} />);

    expect(screen.getByRole('textbox', { name: 'Portent 1' })).toHaveValue('Graves open');
    expect(screen.getByRole('textbox', { name: 'Portent 2' })).toHaveValue('Livestock die');
    expect(screen.getByRole('button', { name: 'Move portent 1 up' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Move portent 2 down' })).toBeDisabled();
  });

  it('adds a row and focuses it', () => {
    render(<Harness initial={['Graves open']} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add a portent' }));

    expect(items()).toEqual(['Graves open', '']);
    expect(screen.getByRole('textbox', { name: 'Portent 2' })).toHaveFocus();
  });

  it('changes, moves and removes rows', () => {
    render(<Harness initial={['Graves open', 'Livestock die', 'The sky darkens']} />);

    fireEvent.change(screen.getByRole('textbox', { name: 'Portent 2' }), {
      target: { value: 'Crops fail' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Move portent 3 up' }));
    expect(items()).toEqual(['Graves open', 'The sky darkens', 'Crops fail']);

    fireEvent.click(screen.getByRole('button', { name: 'Remove portent 1' }));
    expect(items()).toEqual(['The sky darkens', 'Crops fail']);
    expect(screen.getByRole('textbox', { name: 'Portent 1' })).toHaveFocus();
  });

  it('focuses Add after removing the last row', () => {
    render(<Harness initial={['Graves open']} />);

    fireEvent.click(screen.getByRole('button', { name: 'Remove portent 1' }));

    expect(items()).toEqual([]);
    expect(screen.getByRole('button', { name: 'Add a portent' })).toHaveFocus();
  });

  it('stops at the limit', () => {
    render(<Harness initial={['One', 'Two']} max={2} />);

    expect(screen.getByRole('button', { name: 'Add a portent' })).toBeDisabled();
    expect(screen.getByText(/That's 2, as many as this can have/)).toBeInTheDocument();
  });

  it('uses "an" before a vowel', () => {
    render(<ListEditor noun="omen" max={3} items={[]} onChange={() => undefined} />);

    expect(screen.getByRole('button', { name: 'Add an omen' })).toBeInTheDocument();
  });
});

describe('listToSave', () => {
  it('trims rows and leaves out empty ones', () => {
    expect(listToSave([' Graves open ', '', '   ', 'Crops fail'])).toEqual([
      'Graves open',
      'Crops fail',
    ]);
  });
});
