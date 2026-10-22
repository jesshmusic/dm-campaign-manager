import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import EntityForm, {
  FieldConfig,
  toAttributes,
  toFormValues,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/EntityForm';
import { chooseOption, menuOptions, openSelect } from '../selectHelpers';

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const fields: FieldConfig[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    blankLabel: 'None',
    options: [
      { value: 'ally', label: 'Ally' },
      { value: 'villain', label: 'Villain' },
    ],
  },
  { name: 'level', label: 'Level', type: 'number', min: 1, max: 20 },
  { name: 'notes', label: 'Notes', hint: 'Only you see this', type: 'textarea', wide: true },
  { name: 'features', label: 'Features', type: 'lines', noun: 'feature', max: 20, wide: true },
  { name: 'revealed', label: 'Already revealed', type: 'checkbox' },
];

describe('toAttributes', () => {
  it('trims text and turns blanks into null', () => {
    expect(
      toAttributes(fields, {
        name: '  Lareth  ',
        role: '',
        level: '',
        notes: '   ',
        features: '',
        revealed: false,
      }),
    ).toEqual({
      name: 'Lareth',
      role: null,
      level: null,
      notes: null,
      features: [],
      revealed: false,
    });
  });

  it('converts numbers, line lists and checkboxes', () => {
    expect(
      toAttributes(fields, {
        name: 'Lareth',
        role: 'villain',
        level: ' 5 ',
        notes: 'Beautiful',
        features: ' Bone altar \n\n  Collapsed stair\n',
        revealed: true,
      }),
    ).toEqual({
      name: 'Lareth',
      role: 'villain',
      level: 5,
      notes: 'Beautiful',
      features: ['Bone altar', 'Collapsed stair'],
      revealed: true,
    });
  });

  it("saves a list's rows trimmed, without empty ones", () => {
    expect(
      toAttributes(fields, { features: [' Bone altar ', '', '  ', 'Collapsed stair'] }),
    ).toMatchObject({
      features: ['Bone altar', 'Collapsed stair'],
    });
  });

  it('treats missing values as blank and unchecked', () => {
    expect(toAttributes(fields, {})).toEqual({
      name: null,
      role: null,
      level: null,
      notes: null,
      features: [],
      revealed: false,
    });
  });

  it('only includes configured fields', () => {
    expect(toAttributes([fields[0]], { name: 'Elmo', extra: 'ignored' })).toEqual({
      name: 'Elmo',
    });
  });
});

describe('truths fields', () => {
  const truthFields: FieldConfig[] = [
    { name: 'truths', label: 'Truths of the setting', hint: 'About six', type: 'truths' },
  ];

  it('saves truths trimmed, in order, without empty rows', () => {
    expect(
      toAttributes(truthFields, {
        truths: [
          { name: ' Greyhawk runs on gold. ', description: ' Anything can be bought. ' },
          { name: ' ', description: '' },
          { name: 'Walls within walls', description: '' },
        ],
      }),
    ).toEqual({
      truths: [
        { name: 'Greyhawk runs on gold.', description: 'Anything can be bought.' },
        { name: 'Walls within walls', description: '' },
      ],
    });
    expect(toAttributes(truthFields, {})).toEqual({ truths: [] });
  });

  it("edits a record's truths as a list, splitting any older strings", () => {
    expect(
      toFormValues(truthFields, {
        truths: [
          { name: 'Gold rules', description: 'All of it' },
          'The dead walk. Nobody knows why.',
        ],
      }),
    ).toEqual({
      truths: [
        { name: 'Gold rules', description: 'All of it' },
        { name: 'The dead walk.', description: 'Nobody knows why.' },
      ],
    });
    expect(toFormValues(truthFields, { truths: null })).toEqual({ truths: [] });
  });

  it('round-trips through toAttributes', () => {
    const record = { truths: [{ name: 'Gold rules', description: 'All of it' }] };

    expect(toAttributes(truthFields, toFormValues(truthFields, record))).toEqual(record);
  });

  const renderTruthsForm = () => {
    const onSubmit = jest.fn().mockResolvedValue(true);
    render(
      <EntityForm
        title="Edit campaign"
        fields={truthFields}
        initialValues={toFormValues(truthFields, {
          truths: [{ name: 'Gold rules', description: 'All of it' }],
        })}
        submitLabel="Save"
        onSubmit={onSubmit}
        onCancel={jest.fn()}
      />,
    );
    return onSubmit;
  };

  it('edits the truths as a labelled group with its hint', () => {
    renderTruthsForm();

    const group = screen.getByRole('group', { name: 'Truths of the setting' });
    expect(group).toHaveAccessibleDescription('About six');
    expect(screen.getByLabelText('Truth 1 name')).toHaveValue('Gold rules');
  });

  it('saves the truths the DM added', async () => {
    const onSubmit = renderTruthsForm();

    fireEvent.click(screen.getByRole('button', { name: 'Add a truth' }));
    fireEvent.change(screen.getByLabelText('Truth 2 name'), { target: { value: 'Walls' } });
    fireEvent.click(screen.getByRole('button', { name: 'Move truth 2 up' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        truths: [
          { name: 'Walls', description: '' },
          { name: 'Gold rules', description: 'All of it' },
        ],
      }),
    );
  });

  it('needs a name for each truth with a description before saving', () => {
    const onSubmit = renderTruthsForm();

    fireEvent.change(screen.getByLabelText('Truth 1 name'), { target: { value: ' ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Each truth needs a name.');
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe('toFormValues', () => {
  it('converts a record into strings, lists and booleans', () => {
    expect(
      toFormValues(fields, {
        name: 'Lareth',
        role: 'villain',
        level: 5,
        notes: null,
        features: ['Bone altar', 'Collapsed stair'],
        revealed: true,
      }),
    ).toEqual({
      name: 'Lareth',
      role: 'villain',
      level: '5',
      notes: '',
      features: ['Bone altar', 'Collapsed stair'],
      revealed: true,
    });
  });

  it('uses blanks for missing values', () => {
    expect(toFormValues(fields, {})).toEqual({
      name: '',
      role: '',
      level: '',
      notes: '',
      features: [],
      revealed: false,
    });
  });

  it('round-trips through toAttributes', () => {
    const record = {
      name: 'Elmo',
      role: 'ally',
      level: 2,
      notes: 'Drinks a lot',
      features: ['One', 'Two'],
      revealed: false,
    };

    expect(toAttributes(fields, toFormValues(fields, record))).toEqual(record);
  });
});

describe('EntityForm', () => {
  const renderForm = (props: Partial<React.ComponentProps<typeof EntityForm>> = {}) => {
    const onSubmit = jest.fn().mockResolvedValue(true);
    const onCancel = jest.fn();
    render(
      <EntityForm
        title="Edit Elmo"
        fields={fields}
        initialValues={toFormValues(fields, { name: 'Elmo', role: 'ally', level: 2 })}
        submitLabel="Save"
        onSubmit={onSubmit}
        onCancel={onCancel}
        {...props}
      />,
    );
    return { onSubmit, onCancel };
  };

  const input = (name: string) => document.getElementById(`field-${name}`) as HTMLInputElement;

  it('opens in a dialog with its title', () => {
    renderForm();

    expect(screen.getByRole('dialog', { name: 'Edit Elmo' })).toBeInTheDocument();
  });

  it('renders each field with its initial value', () => {
    renderForm();

    expect(input('name')).toHaveValue('Elmo');
    expect(input('name')).toBeRequired();
    expect(screen.getByText('Ally')).toBeInTheDocument();
    expect(input('level')).toHaveValue(2);
    expect(screen.getByText('Only you see this')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Already revealed' })).not.toBeChecked();
  });

  it('labels the controls', () => {
    renderForm();

    expect(screen.getByLabelText('Name')).toBe(input('name'));
    expect(screen.getByLabelText('Role')).toBe(input('role'));
    expect(screen.getByLabelText('Level')).toBe(input('level'));
  });

  it('filters a select as you type', () => {
    renderForm();

    openSelect('Role', 'vil');

    expect(menuOptions()).toEqual(['Villain']);
  });

  it('shows the blank choice when a select has no value', () => {
    renderForm({ initialValues: toFormValues(fields, { name: 'Elmo' }) });

    expect(screen.getByText('None')).toBeInTheDocument();
  });

  it('submits converted attributes and closes when saved', async () => {
    const { onSubmit, onCancel } = renderForm();

    fireEvent.change(input('name'), { target: { value: ' Elmo the Drunk ' } });
    fireEvent.keyDown(input('role'), { key: 'Backspace' });
    fireEvent.change(input('level'), { target: { value: '4' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add a feature' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Feature 1' }), {
      target: { value: ' One ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add a feature' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add a feature' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Feature 3' }), {
      target: { value: 'Two' },
    });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Already revealed' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(onCancel).toHaveBeenCalled());
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Elmo the Drunk',
      role: null,
      level: 4,
      notes: null,
      features: ['One', 'Two'],
      revealed: true,
    });
  });

  it('saves a picked select option', async () => {
    const { onSubmit } = renderForm();

    await chooseOption('Role', 'Villain', 'vil');
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ role: 'villain' })),
    );
  });

  it('saves with Enter in a field', async () => {
    const { onSubmit } = renderForm();

    fireEvent.submit(input('name').closest('form') as HTMLFormElement);

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });

  it('stays open with an error when saving fails', async () => {
    const { onSubmit, onCancel } = renderForm();
    onSubmit.mockResolvedValue(false);

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      "Couldn't save. Check the fields and try again.",
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('needs the required fields before saving', () => {
    const { onSubmit } = renderForm();

    fireEvent.change(input('name'), { target: { value: '  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Name is required.');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('disables the buttons while saving', async () => {
    const saving = deferred<boolean>();
    renderForm({ onSubmit: () => saving.promise });

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled();
    saving.resolve(false);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled());
  });

  it('cancels without saving', () => {
    const { onSubmit, onCancel } = renderForm();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('asks before throwing away changes', () => {
    const confirm = jest.spyOn(window, 'confirm').mockReturnValue(false);
    const { onCancel } = renderForm();

    fireEvent.change(input('name'), { target: { value: 'Elmo the Drunk' } });
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(confirm).toHaveBeenCalledWith('Discard your changes?');
    expect(onCancel).not.toHaveBeenCalled();
    confirm.mockRestore();
  });

  describe('helpers', () => {
    const helperFields = (generate: jest.Mock): FieldConfig[] => [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        helper: { label: 'Random name', generate },
      },
      { name: 'setting', label: 'Setting', type: 'text' },
      {
        name: 'premise',
        label: 'Premise',
        type: 'textarea',
        helper: { label: 'Suggest a hook', generate },
      },
    ];

    it('fills a text field with the generated value', async () => {
      const generate = jest.fn().mockResolvedValue('Ostler Gundigoot');
      renderForm({
        fields: helperFields(generate),
        initialValues: { name: '', setting: 'Greyhawk', premise: '' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Random name' }));

      await waitFor(() => expect(input('name')).toHaveValue('Ostler Gundigoot'));
      expect(generate).toHaveBeenCalledWith({ name: '', setting: 'Greyhawk', premise: '' });
    });

    it('fills a textarea with the generated value', async () => {
      const generate = jest.fn().mockResolvedValue('A dragon attacks');
      renderForm({
        fields: helperFields(generate),
        initialValues: { name: '', setting: '', premise: 'old' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Suggest a hook' }));

      await waitFor(() => expect(input('premise')).toHaveValue('A dragon attacks'));
    });

    it('shows that it is thinking and disables every helper meanwhile', async () => {
      const pending = deferred<string>();
      const generate = jest.fn(() => pending.promise);
      renderForm({
        fields: helperFields(generate),
        initialValues: { name: '', setting: '', premise: '' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Random name' }));

      expect(screen.getByRole('button', { name: 'Thinking…' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Suggest a hook' })).toBeDisabled();

      pending.resolve('Elmo');
      await waitFor(() =>
        expect(screen.getByRole('button', { name: 'Random name' })).toBeEnabled(),
      );
    });

    it('explains when a helper fails and keeps the value', async () => {
      const generate = jest.fn().mockRejectedValue(new Error('boom'));
      renderForm({
        fields: helperFields(generate),
        initialValues: { name: 'Keep me', setting: '', premise: '' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Random name' }));

      expect(
        await screen.findByText("Random name didn't work this time. Please try again."),
      ).toBeInTheDocument();
      expect(input('name')).toHaveValue('Keep me');
    });

    it('does not submit the form when a helper is clicked', async () => {
      const generate = jest.fn().mockResolvedValue('Elmo');
      const { onSubmit } = renderForm({
        fields: helperFields(generate),
        initialValues: { name: '', setting: '', premise: '' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Random name' }));

      await waitFor(() => expect(input('name')).toHaveValue('Elmo'));
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
});
