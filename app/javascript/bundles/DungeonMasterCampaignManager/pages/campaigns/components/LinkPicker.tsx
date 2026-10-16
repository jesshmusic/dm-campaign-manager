import React, { useState } from 'react';
import { LinkableType, SessionLink } from '../types';
import { ButtonRow, EmptyState, HelperButton, LinkButton, List, Select } from '../Campaigns.styles';

type Option = { id: string; label: string };

type LinkPickerProps = {
  label: string;
  linkableType: LinkableType;
  links: SessionLink[];
  options: Option[];
  emptyText: string;
  onAdd: (linkableType: LinkableType, id: string) => Promise<boolean>;
  onRemove: (link: SessionLink) => Promise<boolean>;
  renderLink?: (link: SessionLink) => React.ReactNode;
  // Only show links to these records (when one type is split across steps)
  scopeIds?: string[];
  // Just the dropdown, when the step lists its links itself
  hideLinks?: boolean;
};

/** Lists what a session links to of one type, with a dropdown to add more. */
const LinkPicker = ({
  label,
  linkableType,
  links,
  options,
  emptyText,
  onAdd,
  onRemove,
  renderLink,
  scopeIds,
  hideLinks,
}: LinkPickerProps) => {
  const [selected, setSelected] = useState('');
  const linked = links.filter(
    (link) =>
      link.linkableType === linkableType && (!scopeIds || scopeIds.includes(link.linkableId)),
  );
  const available = options.filter(
    (option) => !linked.some((link) => link.linkableId === option.id),
  );

  const add = async () => {
    if (!selected) return;
    if (await onAdd(linkableType, selected)) setSelected('');
  };

  return (
    <div>
      {hideLinks ? null : linked.length === 0 ? (
        <EmptyState>{emptyText}</EmptyState>
      ) : (
        <List>
          {linked.map((link) => (
            <li key={link.id}>
              {renderLink ? renderLink(link) : link.name}{' '}
              <LinkButton aria-label={`Remove ${link.name}`} onClick={() => void onRemove(link)}>
                remove
              </LinkButton>
            </li>
          ))}
        </List>
      )}
      {available.length > 0 && (
        <ButtonRow>
          <Select
            aria-label={label}
            value={selected}
            onChange={(event) => setSelected(event.target.value)}
          >
            <option value="">Choose…</option>
            {available.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </Select>
          <HelperButton type="button" disabled={!selected} onClick={() => void add()}>
            Add
          </HelperButton>
        </ButtonRow>
      )}
    </div>
  );
};

export default LinkPicker;
