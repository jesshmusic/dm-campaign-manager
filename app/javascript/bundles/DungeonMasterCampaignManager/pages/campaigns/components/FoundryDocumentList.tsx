import { FoundryDocument } from '../types';
import { EmptyState, LinkButton, List, Meta } from '../Campaigns.styles';

type FoundryDocumentListProps = {
  // Names the list, e.g. "Handouts for Stop the cult"
  label: string;
  documents: FoundryDocument[];
  emptyText: string;
  // Without it, the list can't be changed here
  onRemove?: (document: FoundryDocument) => unknown;
  disabled?: boolean;
};

/**
 * Foundry documents the DM drops on a record in Foundry (a quest's handouts,
 * a place's roll tables), listed by name. The website can't browse a world's
 * documents, so it only shows them, and can remove one.
 */
const FoundryDocumentList = ({
  label,
  documents,
  emptyText,
  onRemove,
  disabled = false,
}: FoundryDocumentListProps) => {
  if (documents.length === 0) return <EmptyState>{emptyText}</EmptyState>;
  return (
    <List aria-label={label}>
      {documents.map((document) => (
        <li key={document.uuid}>
          {document.name}
          {document.uuid.startsWith('Compendium.') && <Meta as="span"> (compendium)</Meta>}
          {onRemove && (
            <>
              {' '}
              <LinkButton
                type="button"
                aria-label={`Remove ${document.name}`}
                disabled={disabled}
                onClick={() => void onRemove(document)}
              >
                remove
              </LinkButton>
            </>
          )}
        </li>
      ))}
    </List>
  );
};

export default FoundryDocumentList;
