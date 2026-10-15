import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import EntityForm, {
  FieldConfig,
  toAttributes,
  toFormValues,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/EntityForm';

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
  { name: 'truths', label: 'Truths', type: 'lines', wide: true },
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
        truths: '',
        revealed: false,
      }),
    ).toEqual({
      name: 'Lareth',
      role: null,
      level: null,
      notes: null,
      truths: [],
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
        truths: ' The dead walk \n\n  The temple is corrupt\n',
        revealed: true,
      }),
    ).toEqual({
      name: 'Lareth',
      role: 'villain',
      level: 5,
      notes: 'Beautiful',
      truths: ['The dead walk', 'The temple is corrupt'],
      revealed: true,
    });
  });

  it('treats missing values as blank and unchecked', () => {
    expect(toAttributes(fields, {})).toEqual({
      name: null,
      role: null,
      level: null,
      notes: null,
      truths: [],
      revealed: false,
    });
  });

  it('only includes configured fields', () => {
    expect(toAttributes([fields[0]], { name: 'Elmo', extra: 'ignored' })).toEqual({
      name: 'Elmo',
    });
  });
});

describe('toFormValues', () => {
  it('converts a record into strings, joined lines and booleans', () => {
    expect(
      toFormValues(fields, {
        name: 'Lareth',
        role: 'villain',
        level: 5,
        notes: null,
        truths: ['The dead walk', 'The temple is corrupt'],
        revealed: true,
      }),
    ).toEqual({
      name: 'Lareth',
      role: 'villain',
      level: '5',
      notes: '',
      truths: 'The dead walk\nThe temple is corrupt',
      revealed: true,
    });
  });

  it('uses blanks for missing values', () => {
    expect(toFormValues(fields, {})).toEqual({
      name: '',
      role: '',
      level: '',
      notes: '',
      truths: '',
      revealed: false,
    });
  });

  it('round-trips through toAttributes', () => {
    const record = {
      name: 'Elmo',
      role: 'ally',
      level: 2,
      notes: 'Drinks a lot',
      truths: ['One', 'Two'],
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

  it('renders each field with its initial value', () => {
    renderForm();

    expect(input('name')).toHaveValue('Elmo');
    expect(input('name')).toBeRequired();
    expect(input('role')).toHaveValue('ally');
    expect(input('level')).toHaveValue(2);
    expect(screen.getByText('Only you see this')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'None' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Already revealed' })).not.toBeChecked();
  });

  it('labels the controls', () => {
    renderForm();

    expect(screen.getByLabelText('Name')).toBe(input('name'));
    expect(screen.getByLabelText('Level')).toBe(input('level'));
  });

  it('submits converted attributes and closes when saved', async () => {
    const { onSubmit, onCancel } = renderForm();

    fireEvent.change(input('name'), { target: { value: ' Elmo the Drunk ' } });
    fireEvent.change(input('role'), { target: { value: '' } });
    fireEvent.change(input('level'), { target: { value: '4' } });
    fireEvent.change(input('truths'), { target: { value: 'One\n\nTwo' } });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Already revealed' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(onCancel).toHaveBeenCalled());
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Elmo the Drunk',
      role: null,
      level: 4,
      notes: null,
      truths: ['One', 'Two'],
      revealed: true,
    });
  });

  it('stays open when saving fails', async () => {
    const { onSubmit, onCancel } = renderForm();
    onSubmit.mockResolvedValue(false);

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled());
    expect(onSubmit).toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('disables the submit button while saving', async () => {
    const saving = deferred<boolean>();
    renderForm({ onSubmit: () => saving.promise });

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    saving.resolve(false);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled());
  });

  it('cancels', () => {
    const { onSubmit, onCancel } = renderForm();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('has no cancel button without onCancel', () => {
    renderForm({ onCancel: undefined });

    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
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
