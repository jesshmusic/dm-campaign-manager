import { useState } from 'react';
import Select, { GroupBase, Props as SelectProps, StylesConfig } from 'react-select';
import '../../../components/forms/inputOverrides.scss';

export type SearchOption = {
  value: string;
  label: string;
  // Shown after the label in the menu, e.g. "CR 1/4 · Monster Manual"
  detail?: string | null;
};

export type SearchGroup = GroupBase<SearchOption>;

// The menu opens in a layer above everything, so a modal's scrolling can't clip it
const styles: StylesConfig<SearchOption, boolean, SearchGroup> = {
  menuPortal: (base) => ({ ...base, zIndex: 3000 }),
};

const formatOptionLabel = (option: SearchOption) =>
  option.detail ? (
    <span>
      {option.label} <small>({option.detail})</small>
    </span>
  ) : (
    option.label
  );

/**
 * A select you can type in to filter, styled like the app's other selects:
 * one value, or several with `isMulti`.
 */
function SearchSelect<IsMulti extends boolean = false>(
  props: SelectProps<SearchOption, IsMulti, SearchGroup>,
) {
  const { onKeyDown, onMenuOpen, onMenuClose } = props;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Select<SearchOption, IsMulti, SearchGroup>
      className="reactSelect"
      classNamePrefix="reactSelect"
      isSearchable
      menuPlacement="auto"
      menuPortalTarget={typeof document === 'undefined' ? undefined : document.body}
      styles={styles as StylesConfig<SearchOption, IsMulti, SearchGroup>}
      formatOptionLabel={formatOptionLabel}
      noOptionsMessage={({ inputValue }) => (inputValue ? 'No matches' : 'Nothing to choose')}
      {...props}
      onMenuOpen={() => {
        setMenuOpen(true);
        onMenuOpen?.();
      }}
      onMenuClose={() => {
        setMenuOpen(false);
        onMenuClose?.();
      }}
      // Escape closes the menu, not the planner modal around it
      onKeyDown={(event) => {
        if (event.key === 'Escape' && menuOpen) event.stopPropagation();
        onKeyDown?.(event);
      }}
    />
  );
}

export default SearchSelect;
