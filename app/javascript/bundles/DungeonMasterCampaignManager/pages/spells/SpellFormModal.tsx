import React, { useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { RecordFormModal } from '../../components/shared/modals';
import SpellForm, { SpellFormData } from './SpellForm';
import { SpellProps } from '../../utilities/types';
import rest from '../../api/api';

type SpellFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  initialData?: SpellProps | null;
  token?: string;
  createSpell: (data: SpellFormData, token?: string) => void;
  updateSpell: (id: string, data: SpellFormData, token?: string) => void;
  deleteSpell: (id: string, token?: string) => void;
  onSuccess?: () => void;
  onDeleteSuccess?: () => void;
};

const SpellFormModal: React.FC<SpellFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  token,
  createSpell,
  updateSpell,
  deleteSpell,
  onSuccess,
  onDeleteSuccess,
}) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const formDataRef = useRef<SpellFormData | null>(null);

  const handleFormSubmit = useCallback((data: SpellFormData) => {
    formDataRef.current = data;
  }, []);

  const handleSave = () => {
    // Trigger form submit to collect the data
    const form = document.getElementById('spell-form') as HTMLFormElement;
    if (form) {
      form.requestSubmit();
      // Wait a tick for the form submit handler to run
      setTimeout(() => {
        if (formDataRef.current) {
          setIsSaving(true);
          if (mode === 'create') {
            createSpell(formDataRef.current, token);
          } else if (initialData?.slug) {
            updateSpell(initialData.slug, formDataRef.current, token);
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
      deleteSpell(initialData.slug, token);
      setTimeout(() => {
        setIsDeleting(false);
        onDeleteSuccess?.();
        onClose();
      }, 500);
    }
  };

  const title = mode === 'create' ? 'New Spell' : `Edit ${initialData?.name ?? 'Spell'}`;

  return (
    <RecordFormModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      mode={mode}
      entityName="spell"
      entityTitle={initialData?.name}
      onSave={handleSave}
      onDelete={mode === 'edit' ? handleDelete : undefined}
      isSaving={isSaving}
      isDeleting={isDeleting}
      maxWidth="800px"
    >
      <SpellForm initialData={initialData} onSubmit={handleFormSubmit} isSubmitting={isSaving} />
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
    createSpell: (data: SpellFormData, token?: string) => {
      dispatch(
        rest.actions.createSpell(
          {},
          {
            body: JSON.stringify({ spell: data, token }),
          },
        ),
      );
    },
    updateSpell: (id: string, data: SpellFormData, token?: string) => {
      dispatch(
        rest.actions.updateSpell(
          { id },
          {
            body: JSON.stringify({ spell: data, token }),
          },
        ),
      );
    },
    deleteSpell: (id: string, token?: string) => {
      dispatch(
        rest.actions.deleteSpell(
          { id },
          {
            body: JSON.stringify({ token }),
          },
        ),
      );
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SpellFormModal);
