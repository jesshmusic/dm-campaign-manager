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
 * renders as a card; editing swaps the card for an EntityForm.
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

  return (
    <section aria-label={title}>
      <SectionTitle>
        {title}
        {!adding && (
          <Button color={Colors.primary} title={`Add ${noun}`} onClick={() => setAdding(true)} />
        )}
      </SectionTitle>
      {intro}
      {adding && (
        <Card>
          <h3>New {noun}</h3>
          <EntityForm
            fields={fields}
            initialValues={formValues(newValues)}
            submitLabel={`Add ${noun}`}
            onSubmit={(attributes) => onSave(attributes)}
            onCancel={() => setAdding(false)}
          />
        </Card>
      )}
      {items.length === 0 && !adding && <EmptyState>{emptyText}</EmptyState>}
      <CardGrid>
        {items.map((item) =>
          editingId === item.id ? (
            <Card key={item.id}>
              <EntityForm
                fields={editFields?.(item) ?? fields}
                initialValues={toFormValues(editFields?.(item) ?? fields, valuesFor(item))}
                submitLabel="Save"
                onSubmit={(attributes) => onSave(attributes, item.id)}
                onCancel={() => setEditingId(null)}
              />
            </Card>
          ) : (
            <Card key={item.id}>
              {renderItem(item)}
              <ButtonRow>
                {renderActions?.(item)}
                <Button
                  color={Colors.secondary}
                  title="Edit"
                  onClick={() => setEditingId(item.id)}
                />
                <Button color={Colors.danger} title="Delete" onClick={() => confirmDelete(item)} />
              </ButtonRow>
            </Card>
          ),
        )}
      </CardGrid>
    </section>
  );
}

export default EntitySection;
