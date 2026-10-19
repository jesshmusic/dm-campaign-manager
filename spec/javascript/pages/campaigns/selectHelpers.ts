/**
 * Helpers for the planner's SearchSelects (react-select): open one by its
 * label, type to filter, pick an option, and remove a picked one.
 */
import { fireEvent, screen } from '../../test-utils';

/** The select's text input, found by its label */
export const selectInput = (label: string | RegExp) =>
  screen.getByRole('combobox', { name: label });

/** Opens the menu, optionally typing into the select first */
export const openSelect = (label: string | RegExp, text?: string) => {
  const input = selectInput(label);
  if (text !== undefined) fireEvent.change(input, { target: { value: text } });
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  return input;
};

/** The option labels the open menu shows */
export const menuOptions = () =>
  screen.queryAllByRole('option').map((option) => option.textContent);

/** Opens the select and picks an option by its text */
export const chooseOption = async (
  label: string | RegExp,
  option: string | RegExp,
  text?: string,
) => {
  openSelect(label, text);
  fireEvent.click(await screen.findByRole('option', { name: option }));
};

/** Removes a picked value from a multi-select by clicking its × */
export const removeValue = (name: string) =>
  fireEvent.click(screen.getByRole('button', { name: `Remove ${name}` }));
