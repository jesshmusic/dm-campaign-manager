import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import QuantityField from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/QuantityField';

const input = () => screen.getByRole('spinbutton', { name: 'Quantity of Potion of Healing' });

const renderField = (value: number | null, onSave = jest.fn().mockResolvedValue(true)) => {
  const utils = render(
    <QuantityField label="Quantity of Potion of Healing" value={value} onSave={onSave} />,
  );
  return { ...utils, onSave };
};

describe('QuantityField', () => {
  it('shows the quantity', () => {
    renderField(3);

    expect(input()).toHaveValue(3);
    expect(input()).toHaveAttribute('min', '1');
    expect(input()).toHaveAttribute('max', '9999');
  });

  it('is empty, meaning one, without a quantity', () => {
    renderField(null);

    expect(input()).toHaveValue(null);
    expect(input()).toHaveAttribute('placeholder', '1');
  });

  // Saving shows "Saving…" until it finishes
  const saved = () => waitFor(() => expect(screen.queryByText('Saving…')).not.toBeInTheDocument());

  it('saves a new quantity on blur', async () => {
    const { onSave } = renderField(null);

    fireEvent.change(input(), { target: { value: '4' } });
    expect(onSave).not.toHaveBeenCalled();
    fireEvent.blur(input());

    expect(onSave).toHaveBeenCalledWith(4);
    await saved();
  });

  it('clears the quantity', async () => {
    const { onSave } = renderField(2);

    fireEvent.change(input(), { target: { value: '' } });
    fireEvent.blur(input());

    expect(onSave).toHaveBeenCalledWith(null);
    await saved();
  });

  it('does not save when nothing changed', () => {
    const { onSave } = renderField(2);

    fireEvent.blur(input());
    fireEvent.change(input(), { target: { value: '2' } });
    fireEvent.blur(input());

    expect(onSave).not.toHaveBeenCalled();
  });

  it("won't save a quantity that is not 1 to 9,999", () => {
    const { onSave } = renderField(null);

    ['0', '-2', '1.5', '10000'].forEach((value) => {
      fireEvent.change(input(), { target: { value } });
      fireEvent.blur(input());
    });

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText('1 to 9,999')).toBeInTheDocument();
  });

  it('shows saving progress, and says when saving failed', async () => {
    let finish!: (saved: boolean) => void;
    const onSave = jest.fn(() => new Promise<boolean>((resolve) => (finish = resolve)));
    renderField(null, onSave);

    fireEvent.change(input(), { target: { value: '5' } });
    fireEvent.blur(input());

    expect(screen.getByText('Saving…')).toBeInTheDocument();
    finish(false);
    expect(await screen.findByText("Couldn't save.")).toBeInTheDocument();
  });

  it('shows a new quantity when it changes elsewhere', () => {
    const { rerender } = renderField(2);

    rerender(<QuantityField label="Quantity of Potion of Healing" value={6} onSave={jest.fn()} />);

    expect(input()).toHaveValue(6);
  });
});
