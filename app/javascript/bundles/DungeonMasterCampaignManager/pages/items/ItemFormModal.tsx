import React, { useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { RecordFormModal } from '../../components/shared/modals';
import ItemForm, { ItemFormData } from './ItemForm';
import { ItemProps } from '../../utilities/types';
import rest from '../../api/api';

type ItemFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  initialData?: ItemProps | null;
  token?: string;
  createItem: (data: ItemFormData, token?: string) => void;
  updateItem: (id: string, data: ItemFormData, token?: string) => void;
  deleteItem: (id: string, token?: string) => void;
  onSuccess?: () => void;
  onDeleteSuccess?: () => void;
};

const ItemFormModal: React.FC<ItemFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  token,
  createItem,
  updateItem,
  deleteItem,
  onSuccess,
  onDeleteSuccess,
}) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const formDataRef = useRef<ItemFormData | null>(null);

  const handleFormSubmit = useCallback((data: ItemFormData) => {
    formDataRef.current = data;
  }, []);

  const handleSave = () => {
    // Trigger form submit to collect the data
    const form = document.getElementById('item-form') as HTMLFormElement;
    if (form) {
      form.requestSubmit();
      // Wait a tick for the form submit handler to run
      setTimeout(() => {
        if (formDataRef.current) {
          setIsSaving(true);
          if (mode === 'create') {
            createItem(formDataRef.current, token);
          } else if (initialData?.slug) {
            updateItem(initialData.slug, formDataRef.current, token);
          }
          // Wait a bit for the API call to complete
          setTimeout(() => {
            setIsSaving(false);
            onSuccess?.();
            onClose();
          }, 500);
        }
      }, 0);
    }
  };

  const handleDelete = () => {
    if (initialData?.slug) {
      setIsDeleting(true);
      deleteItem(initialData.slug, token);
      setTimeout(() => {
        setIsDeleting(false);
        onDeleteSuccess?.();
        onClose();
      }, 500);
    }
  };

  const title = mode === 'create' ? 'New Item' : `Edit ${initialData?.name || 'Item'}`;

  return (
    <RecordFormModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      mode={mode}
      entityName="item"
      entityTitle={initialData?.name}
      onSave={handleSave}
      onDelete={mode === 'edit' ? handleDelete : undefined}
      isSaving={isSaving}
      isDeleting={isDeleting}
      maxWidth="900px"
    >
      <ItemForm initialData={initialData} onSubmit={handleFormSubmit} isSubmitting={isSaving} />
    </RecordFormModal>
  );
};

function mapStateToProps(state) {
  return {
    token: state.users.token,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createItem: (data: ItemFormData, token?: string) => {
      dispatch(
        rest.actions.createItem(
          {},
          {
            body: JSON.stringify({ item: data, token }),
          },
        ),
      );
    },
    updateItem: (id: string, data: ItemFormData, token?: string) => {
      dispatch(
        rest.actions.updateItem(
          { id },
          {
            body: JSON.stringify({ item: data, token }),
          },
        ),
      );
    },
    deleteItem: (id: string, token?: string) => {
      dispatch(
        rest.actions.deleteItem(
          { id },
          {
            body: JSON.stringify({ token }),
          },
        ),
      );
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemFormModal);
