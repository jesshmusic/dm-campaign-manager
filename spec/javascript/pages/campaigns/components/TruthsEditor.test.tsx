import React, { useState } from 'react';
import { render, screen, fireEvent, within } from '../../../test-utils';
import TruthsEditor from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/TruthsEditor';
import { Truth } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';

const gold: Truth = {
  name: 'Greyhawk runs on gold.',
  description: 'Nearly anything can be bought.',
};
const walls: Truth = { name: 'The city has walls within walls.', description: 'Gates matter.' };
const dead: Truth = { name: 'The dead walk', description: '' };

// Holds the list like a form does, reporting each change
const renderEditor = (initial: Truth[] = [gold, walls, dead]) => {
  const onChange = jest.fn();
  const Holder = () => {
    const [truths, setTruths] = useState(initial);
    return (
      <TruthsEditor
        truths={truths}
        onChange={(next) => {
          onChange(next);
          setTruths(next);
        }}
      />
    );
  };
  render(<Holder />);
  return { onChange, latest: () => onChange.mock.calls.at(-1)?.[0] as Truth[] };
};

const names = () =>
  within(screen.getByRole('list', { name: 'Truths' }))
    .getAllByRole('textbox', { name: /name$/ })
    .map((input) => (input as HTMLInputElement).value);

describe('TruthsEditor', () => {
  it('shows each truth numbered, with its name and description', () => {
    renderEditor();

    const rows = within(screen.getByRole('list', { name: 'Truths' })).getAllByRole('listitem');
    expect(rows).toHaveLength(3);
    expect(rows[0]).toHaveTextContent(/^1\./);
    expect(rows[2]).toHaveTextContent(/^3\./);
    expect(screen.getByLabelText('Truth 1 name')).toHaveValue('Greyhawk runs on gold.');
    expect(screen.getByLabelText('Truth 1 description')).toHaveValue(
      'Nearly anything can be bought.',
    );
    expect(screen.getByLabelText('Truth 3 name')).toHaveValue('The dead walk');
    expect(screen.getByLabelText('Truth 3 description')).toHaveValue('');
  });

  it('limits names and descriptions to what the server takes', () => {
    renderEditor();

    expect(screen.getByLabelText('Truth 1 name')).toHaveAttribute('maxLength', '120');
    expect(screen.getByLabelText('Truth 1 description')).toHaveAttribute('maxLength', '1000');
  });

  it('changes a name or description as the DM types', () => {
    const { latest } = renderEditor();

    fireEvent.change(screen.getByLabelText('Truth 2 name'), { target: { value: 'Walls!' } });
    expect(latest()).toEqual([gold, { ...walls, name: 'Walls!' }, dead]);

    fireEvent.change(screen.getByLabelText('Truth 3 description'), {
      target: { value: 'Nobody knows why.' },
    });
    expect(latest()).toEqual([
      gold,
      { ...walls, name: 'Walls!' },
      { ...dead, description: 'Nobody knows why.' },
    ]);
  });

  it('adds an empty truth at the end and moves to its name', () => {
    const { latest } = renderEditor();

    fireEvent.click(screen.getByRole('button', { name: 'Add a truth' }));

    expect(latest()).toEqual([gold, walls, dead, { name: '', description: '' }]);
    expect(screen.getByLabelText('Truth 4 name')).toHaveFocus();
  });

  it('starts with only the add button when there are no truths', () => {
    renderEditor([]);

    expect(screen.queryByRole('list', { name: 'Truths' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Add a truth' }));

    expect(screen.getByLabelText('Truth 1 name')).toHaveFocus();
  });

  it('moves a truth up and down, keeping focus on the moved truth', () => {
    const { latest } = renderEditor();

    fireEvent.click(screen.getByRole('button', { name: 'Move truth 3 up' }));
    expect(latest()).toEqual([gold, dead, walls]);
    expect(screen.getByRole('button', { name: 'Move truth 2 up' })).toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: 'Move truth 2 up' }));
    expect(names()).toEqual([
      'The dead walk',
      'Greyhawk runs on gold.',
      'The city has walls within walls.',
    ]);
    // It's first now, so its "up" is off; focus moves to "down"
    expect(screen.getByRole('button', { name: 'Move truth 1 down' })).toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: 'Move truth 1 down' }));
    expect(latest()).toEqual([gold, dead, walls]);
    expect(screen.getByRole('button', { name: 'Move truth 2 down' })).toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: 'Move truth 2 down' }));
    expect(latest()).toEqual([gold, walls, dead]);
    expect(screen.getByRole('button', { name: 'Move truth 3 up' })).toHaveFocus();
  });

  it("can't move the first truth up or the last one down", () => {
    renderEditor();

    expect(screen.getByRole('button', { name: 'Move truth 1 up' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Move truth 1 down' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Move truth 3 up' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Move truth 3 down' })).toBeDisabled();
  });

  it('removes a truth, moving to the next one', () => {
    const { latest } = renderEditor();

    fireEvent.click(screen.getByRole('button', { name: 'Remove truth 2' }));

    expect(latest()).toEqual([gold, dead]);
    expect(screen.getByLabelText('Truth 2 name')).toHaveValue('The dead walk');
    expect(screen.getByLabelText('Truth 2 name')).toHaveFocus();
  });

  it('moves to the one before after removing the last truth, and to the add button after removing them all', () => {
    renderEditor([gold, walls]);

    fireEvent.click(screen.getByRole('button', { name: 'Remove truth 2' }));
    expect(screen.getByLabelText('Truth 1 name')).toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: 'Remove truth 1' }));
    expect(screen.queryByRole('list', { name: 'Truths' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add a truth' })).toHaveFocus();
  });

  it('stops adding at the most a campaign can have', () => {
    renderEditor(Array.from({ length: 20 }, (_, i) => ({ name: `Truth ${i}`, description: '' })));

    expect(screen.getByRole('button', { name: 'Add a truth' })).toBeDisabled();
    expect(screen.getByText("That's as many as a campaign can have.")).toBeInTheDocument();
  });

  it('never submits the form around it', () => {
    const onSubmit = jest.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <TruthsEditor truths={[gold, walls]} onChange={jest.fn()} />
      </form>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add a truth' }));
    fireEvent.click(screen.getByRole('button', { name: 'Move truth 1 down' }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove truth 1' }));

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
