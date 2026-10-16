import { LinkableType, SessionLink } from '../types';
import SearchSelect, { SearchOption } from './SearchSelect';

type Option = { id: string; label: string };

type LinkPickerProps = {
  label: string;
  linkableType: LinkableType;
  links: SessionLink[];
  options: Option[];
  // Shown in the menu when the campaign has nothing of this type yet
  emptyText: string;
  onAdd: (linkableType: LinkableType, id: string) => unknown;
  onRemove: (link: SessionLink) => unknown;
  // Only show links to these records (when one type is split across steps)
  scopeIds?: string[];
};

/**
 * What a session or quest links to of one type, as a multi-select: type to
 * find a record, pick as many as you like, and remove one with its ×.
 */
const LinkPicker = ({
  label,
  linkableType,
  links,
  options,
  emptyText,
  onAdd,
  onRemove,
  scopeIds,
}: LinkPickerProps) => {
  const linked = links.filter(
    (link) =>
      link.linkableType === linkableType && (!scopeIds || scopeIds.includes(link.linkableId)),
  );
  const labelFor = (id: string, fallback: string) =>
    options.find((option) => option.id === id)?.label ?? fallback;
  const value: SearchOption[] = linked.map((link) => ({
    value: link.linkableId,
    label: labelFor(link.linkableId, link.name),
  }));

  return (
    <SearchSelect
      isMulti
      aria-label={label}
      placeholder={`${label}…`}
      options={options.map((option) => ({ value: option.id, label: option.label }))}
      value={value}
      isClearable={false}
      closeMenuOnSelect={false}
      noOptionsMessage={({ inputValue }) =>
        inputValue ? 'No matches' : options.length ? 'All picked' : emptyText
      }
      onChange={(_value, action) => {
        if (action.action === 'select-option' && action.option) {
          onAdd(linkableType, action.option.value);
        } else if (
          (action.action === 'remove-value' || action.action === 'pop-value') &&
          action.removedValue
        ) {
          const link = linked.find((other) => other.linkableId === action.removedValue?.value);
          if (link) onRemove(link);
        }
      }}
    />
  );
};

export default LinkPicker;
