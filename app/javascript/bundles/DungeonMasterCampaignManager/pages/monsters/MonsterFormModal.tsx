import React, { useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { RecordFormModal } from '../../components/shared/modals';
import MonsterForm, { MonsterFormData } from './MonsterForm';
import { MonsterProps } from '../../utilities/types';
import rest from '../../api/api';

type MonsterFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  initialData?: MonsterProps | null;
  token?: string;
  createMonster: (data: MonsterFormData, token?: string) => void;
  updateMonster: (id: string, data: MonsterFormData, token?: string) => void;
  deleteMonster: (id: string, token?: string) => void;
  onSuccess?: () => void;
  onDeleteSuccess?: () => void;
};

const MonsterFormModal: React.FC<MonsterFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  token,
  createMonster,
  updateMonster,
  deleteMonster,
  onSuccess,
  onDeleteSuccess,
}) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const formDataRef = useRef<MonsterFormData | null>(null);

  // Get slug from initialData
  const slug =
    initialData && 'slug' in initialData
      ? (initialData as MonsterProps & { slug: string }).slug
      : undefined;

  const handleFormSubmit = useCallback((data: MonsterFormData) => {
    formDataRef.current = data;
  }, []);

  const handleSave = () => {
    // Trigger form submit to collect the data
    const form = document.getElementById('monster-form') as HTMLFormElement;
    if (form) {
      form.requestSubmit();
      // Wait a tick for the form submit handler to run
      setTimeout(() => {
        if (formDataRef.current) {
          setIsSaving(true);
          if (mode === 'create') {
            createMonster(formDataRef.current, token);
          } else if (slug) {
            updateMonster(slug, formDataRef.current, token);
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
    if (slug) {
      setIsDeleting(true);
      deleteMonster(slug, token);
      setTimeout(() => {
        setIsDeleting(false);
        onDeleteSuccess?.();
        onClose();
      }, 500);
    }
  };

  const title = mode === 'create' ? 'New Monster' : `Edit ${initialData?.name || 'Monster'}`;

  return (
    <RecordFormModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      mode={mode}
      entityName="monster"
      entityTitle={initialData?.name}
      onSave={handleSave}
      onDelete={mode === 'edit' ? handleDelete : undefined}
      isSaving={isSaving}
      isDeleting={isDeleting}
      maxWidth="1000px"
    >
      <MonsterForm initialData={initialData} onSubmit={handleFormSubmit} isSubmitting={isSaving} />
    </RecordFormModal>
  );
};

function mapStateToProps(state: RootState) {
  return {
    token: state.users.token,
  };
}

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    createMonster: (data: MonsterFormData, token?: string) => {
      dispatch(
        rest.actions.createMonster(
          {},
          {
            body: JSON.stringify({ monster: data, token }),
          },
        ),
      );
    },
    updateMonster: (id: string, data: MonsterFormData, token?: string) => {
      dispatch(
        rest.actions.updateMonster(
          { id },
          {
            body: JSON.stringify({ monster: data, token }),
          },
        ),
      );
    },
    deleteMonster: (id: string, token?: string) => {
      dispatch(
        rest.actions.deleteMonster(
          { id },
          {
            body: JSON.stringify({ token }),
          },
        ),
      );
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MonsterFormModal);
