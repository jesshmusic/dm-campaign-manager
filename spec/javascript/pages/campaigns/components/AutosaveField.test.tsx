import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import AutosaveField from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/AutosaveField';

describe('AutosaveField', () => {
  const field = () => screen.getByRole('textbox', { name: 'Strong start' });

  it('shows the saved value', () => {
    render(
      <AutosaveField label="Strong start" value="The bell tolls" onSave={jest.fn()} rows={3} />,
    );

    expect(field()).toHaveValue('The bell tolls');
    expect(field()).toHaveAttribute('rows', '3');
  });

  it('saves on blur when the value changed', async () => {
    const onSave = jest.fn().mockResolvedValue(true);
    render(<AutosaveField label="Strong start" value="" onSave={onSave} />);

    fireEvent.change(field(), { target: { value: 'Zombies at the gate' } });
    expect(onSave).not.toHaveBeenCalled();

    fireEvent.blur(field());

    expect(onSave).toHaveBeenCalledWith('Zombies at the gate');
    expect(await screen.findByText('Saved')).toBeInTheDocument();
  });

  it('shows saving progress', async () => {
    let finish!: (saved: boolean) => void;
    const onSave = jest.fn(() => new Promise<boolean>((resolve) => (finish = resolve)));
    render(<AutosaveField label="Strong start" value="" onSave={onSave} />);

    fireEvent.change(field(), { target: { value: 'Zombies' } });
    fireEvent.blur(field());

    expect(screen.getByText('Saving…')).toBeInTheDocument();
    finish(true);
    expect(await screen.findByText('Saved')).toBeInTheDocument();
  });

  it('does not save on blur when nothing changed', () => {
    const onSave = jest.fn().mockResolvedValue(true);
    render(<AutosaveField label="Strong start" value="Same" onSave={onSave} />);

    fireEvent.blur(field());
    fireEvent.change(field(), { target: { value: 'Different' } });
    fireEvent.change(field(), { target: { value: 'Same' } });
    fireEvent.blur(field());

    expect(onSave).not.toHaveBeenCalled();
  });

  it('says when saving failed', async () => {
    const onSave = jest.fn().mockResolvedValue(false);
    render(<AutosaveField label="Strong start" value="" onSave={onSave} />);

    fireEvent.change(field(), { target: { value: 'Zombies' } });
    fireEvent.blur(field());

    expect(await screen.findByText("Couldn't save. Try again.")).toBeInTheDocument();
  });

  it('follows the value when it changes from outside', () => {
    const { rerender } = render(
      <AutosaveField label="Strong start" value="Old" onSave={jest.fn()} />,
    );

    rerender(<AutosaveField label="Strong start" value="New from server" onSave={jest.fn()} />);

    expect(field()).toHaveValue('New from server');
  });

  describe('helper', () => {
    it('appends the generated text after a blank line and saves', async () => {
      const onSave = jest.fn().mockResolvedValue(true);
      const generate = jest.fn().mockResolvedValue('A dragon attacks');
      render(
        <AutosaveField
          label="Strong start"
          value="The bell tolls"
          onSave={onSave}
          helper={{ label: 'Suggest a hook', generate }}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Suggest a hook' }));

      await waitFor(() =>
        expect(onSave).toHaveBeenCalledWith('The bell tolls\n\nA dragon attacks'),
      );
      expect(field()).toHaveValue('The bell tolls\n\nA dragon attacks');
    });

    it('fills an empty field with the generated text', async () => {
      const onSave = jest.fn().mockResolvedValue(true);
      render(
        <AutosaveField
          label="Strong start"
          value=""
          onSave={onSave}
          helper={{ label: 'Suggest a hook', generate: () => Promise.resolve('Goblins!') }}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Suggest a hook' }));

      await waitFor(() => expect(onSave).toHaveBeenCalledWith('Goblins!'));
      expect(field()).toHaveValue('Goblins!');
    });

    it('shows that it is thinking', async () => {
      let finish!: (text: string) => void;
      render(
        <AutosaveField
          label="Strong start"
          value=""
          onSave={jest.fn().mockResolvedValue(true)}
          helper={{
            label: 'Suggest a hook',
            generate: () => new Promise<string>((resolve) => (finish = resolve)),
          }}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Suggest a hook' }));

      expect(screen.getByRole('button', { name: 'Thinking…' })).toBeDisabled();
      finish('Goblins!');
      expect(await screen.findByRole('button', { name: 'Suggest a hook' })).toBeEnabled();
    });

    it('shows an error when the helper fails', async () => {
      const onSave = jest.fn();
      render(
        <AutosaveField
          label="Strong start"
          value="Keep"
          onSave={onSave}
          helper={{ label: 'Suggest a hook', generate: () => Promise.reject(new Error('down')) }}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Suggest a hook' }));

      expect(await screen.findByText("Couldn't save. Try again.")).toBeInTheDocument();
      expect(onSave).not.toHaveBeenCalled();
      expect(field()).toHaveValue('Keep');
    });
  });
});
