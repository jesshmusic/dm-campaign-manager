import React, { useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { RecordFormModal } from '../../components/shared/modals';
import DndClassForm, { DndClassFormData } from './DndClassForm';
import { DndClass } from '../../utilities/types';
import rest from '../../api/api';

type DndClassFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  initialData?: DndClass | null;
  token?: string;
  createDndClass: (data: DndClassFormData, token?: string) => void;
  updateDndClass: (id: string, data: DndClassFormData, token?: string) => void;
  deleteDndClass: (id: string, token?: string) => void;
  onSuccess?: () => void;
  onDeleteSuccess?: () => void;
};

const DndClassFormModal: React.FC<DndClassFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  token,
  createDndClass,
  updateDndClass,
  deleteDndClass,
  onSuccess,
  onDeleteSuccess,
}) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const formDataRef = useRef<DndClassFormData | null>(null);

  const handleFormSubmit = useCallback((data: DndClassFormData) => {
    formDataRef.current = data;
  }, []);

  const handleSave = () => {
    // Trigger form submit to collect the data
    const form = document.getElementById('dnd-class-form') as HTMLFormElement;
    if (form) {
      form.requestSubmit();
      // Wait a tick for the form submit handler to run
      setTimeout(() => {
        if (formDataRef.current) {
          setIsSaving(true);
          if (mode === 'create') {
            createDndClass(formDataRef.current, token);
          } else if (initialData?.slug) {
            updateDndClass(initialData.slug, formDataRef.current, token);
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
      deleteDndClass(initialData.slug, token);
      setTimeout(() => {
        setIsDeleting(false);
        onDeleteSuccess?.();
        onClose();
      }, 500);
    }
  };

  const title = mode === 'create' ? 'New Class' : `Edit ${initialData?.name || 'Class'}`;

  return (
    <RecordFormModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      mode={mode}
      entityName="class"
      entityTitle={initialData?.name}
      onSave={handleSave}
      onDelete={mode === 'edit' ? handleDelete : undefined}
      isSaving={isSaving}
      isDeleting={isDeleting}
      maxWidth="900px"
    >
      <DndClassForm initialData={initialData} onSubmit={handleFormSubmit} isSubmitting={isSaving} />
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
    createDndClass: (data: DndClassFormData, token?: string) => {
      dispatch(
        rest.actions.createDndClass(
          {},
          {
            body: JSON.stringify({ dnd_class: data, token }),
          },
        ),
      );
    },
    updateDndClass: (id: string, data: DndClassFormData, token?: string) => {
      dispatch(
        rest.actions.updateDndClass(
          { id },
          {
            body: JSON.stringify({ dnd_class: data, token }),
          },
        ),
      );
    },
    deleteDndClass: (id: string, token?: string) => {
      dispatch(
        rest.actions.deleteDndClass(
          { id },
          {
            body: JSON.stringify({ token }),
          },
        ),
      );
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DndClassFormModal);
