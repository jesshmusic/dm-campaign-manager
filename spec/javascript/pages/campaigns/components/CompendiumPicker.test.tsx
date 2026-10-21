import { render, screen, fireEvent, within } from '../../../test-utils';
import CompendiumPicker from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/CompendiumPicker';
import { samplePacks } from '../fixtures';

const checkbox = (book: string, label: RegExp) =>
  within(screen.getByRole('group', { name: book })).getByRole('checkbox', { name: label });

describe('CompendiumPicker', () => {
  it('shows a loading message until the packs arrive', () => {
    render(<CompendiumPicker packs={null} excluded={[]} onChange={jest.fn()} />);

    expect(screen.getByText('Loading compendiums…')).toBeInTheDocument();
  });

  it('explains how to get compendiums when there are none', () => {
    render(<CompendiumPicker packs={[]} excluded={[]} onChange={jest.fn()} />);

    expect(
      screen.getByText(/Install Dorman Lakely's Campaign Planner in Foundry/),
    ).toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('groups the packs by book with their entry counts', () => {
    render(<CompendiumPicker packs={samplePacks()} excluded={[]} onChange={jest.fn()} />);

    expect(checkbox('Monster Manual', /Monsters/)).toBeChecked();
    expect(screen.getByText('(504)')).toBeInTheDocument();
    expect(checkbox('Monster Manual', /Tables/)).toBeChecked();
    expect(checkbox('SRD 5.2', /Monsters/)).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'All compendiums' })).toBeChecked();
  });

  it("lists the DM's homebrew compendiums and world actors under Homebrew", () => {
    const onChange = jest.fn();
    const packs = [
      ...samplePacks(),
      {
        pack: 'world-actors.greyhawk',
        book: 'other' as const,
        bookName: 'Homebrew',
        label: 'World actors (Greyhawk)',
        count: 12,
        homebrew: true,
      },
      {
        pack: 'world.my-monsters',
        book: 'other' as const,
        bookName: 'Homebrew',
        label: 'My Monsters',
        count: 3,
        homebrew: true,
      },
    ];
    render(<CompendiumPicker packs={packs} excluded={[]} onChange={onChange} />);

    expect(checkbox('Homebrew', /World actors \(Greyhawk\)/)).toBeChecked();
    fireEvent.click(checkbox('Homebrew', /My Monsters/));

    expect(onChange).toHaveBeenCalledWith(['world.my-monsters']);
  });

  it('unchecks excluded packs and marks the all checkbox as partly on', () => {
    render(
      <CompendiumPicker packs={samplePacks()} excluded={['dnd5e.actors24']} onChange={jest.fn()} />,
    );

    const all = screen.getByRole('checkbox', { name: 'All compendiums' }) as HTMLInputElement;
    expect(all).not.toBeChecked();
    expect(all.indeterminate).toBe(true);
    expect(checkbox('SRD 5.2', /Monsters/)).not.toBeChecked();
  });

  it('is not partly on when every pack is off', () => {
    const excluded = samplePacks().map((pack) => pack.pack);
    render(<CompendiumPicker packs={samplePacks()} excluded={excluded} onChange={jest.fn()} />);

    const all = screen.getByRole('checkbox', { name: 'All compendiums' }) as HTMLInputElement;
    expect(all).not.toBeChecked();
    expect(all.indeterminate).toBe(false);
  });

  it('turns one pack off and on', () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <CompendiumPicker packs={samplePacks()} excluded={[]} onChange={onChange} />,
    );

    fireEvent.click(checkbox('Monster Manual', /Tables/));
    expect(onChange).toHaveBeenLastCalledWith(['dnd-monster-manual.tables']);

    rerender(
      <CompendiumPicker
        packs={samplePacks()}
        excluded={['dnd-monster-manual.tables']}
        onChange={onChange}
      />,
    );
    fireEvent.click(checkbox('Monster Manual', /Tables/));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('turns every pack off, keeping exclusions for packs not shown', () => {
    const onChange = jest.fn();
    render(
      <CompendiumPicker
        packs={samplePacks()}
        excluded={['dnd-players-handbook.spells']}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'All compendiums' }));

    expect(onChange).toHaveBeenCalledWith([
      'dnd-players-handbook.spells',
      'dnd-monster-manual.actors',
      'dnd-monster-manual.tables',
      'dnd5e.actors24',
    ]);
  });

  it('turns every pack back on, keeping exclusions for packs not shown', () => {
    const onChange = jest.fn();
    render(
      <CompendiumPicker
        packs={samplePacks()}
        excluded={['dnd-players-handbook.spells', 'dnd5e.actors24']}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'All compendiums' }));

    expect(onChange).toHaveBeenCalledWith(['dnd-players-handbook.spells']);
  });

  it('can be disabled', () => {
    render(<CompendiumPicker packs={samplePacks()} excluded={[]} onChange={jest.fn()} disabled />);

    expect(screen.getAllByRole('checkbox').every((box) => (box as HTMLInputElement).disabled)).toBe(
      true,
    );
  });
});
