import React, { useState } from 'react';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import EntityForm, { FieldConfig, FormValues, toFormValues } from './EntityForm';
import { ButtonRow, Card, CardGrid, EmptyState, SectionTitle } from '../Campaigns.styles';

type Entity = { id: string; name?: string };

type EntitySectionProps<T extends Entity> = {
  title: string;
  // Singular noun for buttons, e.g. "NPC"
  noun: string;
  items: T[];
  fields: FieldConfig[];
  // Fields for editing one item, when they depend on it (defaults to `fields`)
  editFields?: (item: T) => FieldConfig[];
  // Form values for an existing item, keyed by Rails attribute name
  valuesFor: (item: T) => Record<string, unknown>;
  newValues?: Record<string, unknown>;
  renderItem: (item: T) => React.ReactNode;
  // Extra buttons for an item, shown beside Edit and Delete
  renderActions?: (item: T) => React.ReactNode;
  emptyText: string;
  onSave: (attributes: Record<string, unknown>, id?: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  intro?: React.ReactNode;
};

/**
 * A titled list of campaign records with add, edit and delete. Each record
 * renders as a card; adding and editing open an EntityForm in a modal.
 */
function EntitySection<T extends Entity>({
  title,
  noun,
  items,
  fields,
  editFields,
  valuesFor,
  newValues = {},
  renderItem,
  renderActions,
  emptyText,
  onSave,
  onDelete,
  intro,
}: EntitySectionProps<T>) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const confirmDelete = (item: T) => {
    const label = item.name ? `"${item.name}"` : `this ${noun.toLowerCase()}`;
    if (window.confirm(`Delete ${label}? This can't be undone.`)) void onDelete(item.id);
  };

  const formValues = (record: Record<string, unknown>): FormValues => toFormValues(fields, record);
  const editing = items.find((item) => item.id === editingId);

  return (
    <section aria-label={title}>
      <SectionTitle>
        {title}
        <Button color={Colors.primary} title={`Add ${noun}`} onClick={() => setAdding(true)} />
      </SectionTitle>
      {intro}
      {adding && (
        <EntityForm
          title={`New ${noun}`}
          fields={fields}
          initialValues={formValues(newValues)}
          submitLabel={`Add ${noun}`}
          onSubmit={(attributes) => onSave(attributes)}
          onCancel={() => setAdding(false)}
        />
      )}
      {editing && (
        <EntityForm
          title={`Edit ${editing.name ?? noun}`}
          fields={editFields?.(editing) ?? fields}
          initialValues={toFormValues(editFields?.(editing) ?? fields, valuesFor(editing))}
          submitLabel="Save"
          onSubmit={(attributes) => onSave(attributes, editing.id)}
          onCancel={() => setEditingId(null)}
        />
      )}
      {items.length === 0 && <EmptyState>{emptyText}</EmptyState>}
      <CardGrid>
        {items.map((item) => (
          <Card key={item.id}>
            {renderItem(item)}
            <ButtonRow>
              {renderActions?.(item)}
              <Button color={Colors.secondary} title="Edit" onClick={() => setEditingId(item.id)} />
              <Button color={Colors.danger} title="Delete" onClick={() => confirmDelete(item)} />
            </ButtonRow>
          </Card>
        ))}
      </CardGrid>
    </section>
  );
}

export default EntitySection;
