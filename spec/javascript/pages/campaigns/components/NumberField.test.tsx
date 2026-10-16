import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import NumberField from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/NumberField';

const renderField = (value: number | null = null, onSave = jest.fn().mockResolvedValue(true)) => {
  render(
    <NumberField
      label="XP"
      hint="For the whole party"
      value={value}
      min={0}
      max={1_000_000}
      placeholder="None"
      onSave={onSave}
    />,
  );
  return { onSave, input: screen.getByRole('spinbutton', { name: 'XP' }) };
};

describe('NumberField', () => {
  it('shows the value with its label and hint', () => {
    const { input } = renderField(450);

    expect(input).toHaveValue(450);
    expect(input).toHaveAttribute('placeholder', 'None');
    expect(screen.getByText('For the whole party')).toBeInTheDocument();
  });

  it('saves a whole number when it loses focus', async () => {
    const { input, onSave } = renderField(null);

    fireEvent.change(input, { target: { value: '1200' } });
    fireEvent.blur(input);

    expect(onSave).toHaveBeenCalledWith(1200);
    expect(await screen.findByText('Saved')).toBeInTheDocument();
  });

  it('saves a blank as null', async () => {
    const { input, onSave } = renderField(450);

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    await waitFor(() => expect(onSave).toHaveBeenCalledWith(null));
  });

  it("doesn't save when nothing changed", () => {
    const { input, onSave } = renderField(450);

    fireEvent.blur(input);

    expect(onSave).not.toHaveBeenCalled();
  });

  it('rejects numbers out of range or with fractions', () => {
    const { input, onSave } = renderField(null);

    ['-1', '1000001', '2.5'].forEach((value) => {
      fireEvent.change(input, { target: { value } });
      fireEvent.blur(input);
    });

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText('Use a whole number from 0 to 1,000,000.')).toBeInTheDocument();
  });

  it("says when it couldn't save", async () => {
    const { input } = renderField(null, jest.fn().mockResolvedValue(false));

    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.blur(input);

    expect(await screen.findByText("Couldn't save. Try again.")).toBeInTheDocument();
  });

  it('follows a new value from outside', () => {
    const onSave = jest.fn();
    const { rerender } = render(
      <NumberField label="XP" value={1} min={0} max={10} onSave={onSave} />,
    );

    rerender(<NumberField label="XP" value={7} min={0} max={10} onSave={onSave} />);

    expect(screen.getByRole('spinbutton', { name: 'XP' })).toHaveValue(7);
  });
});
