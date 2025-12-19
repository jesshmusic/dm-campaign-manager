import React, { useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { RecordFormModal } from '../../components/shared/modals';
import RaceForm, { RaceFormData } from './RaceForm';
import { RaceProps } from '../../utilities/types';
import rest from '../../api/api';

type RaceFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  initialData?: RaceProps | null;
  token?: string;
  createRace: (data: RaceFormData, token?: string) => void;
  updateRace: (id: string, data: RaceFormData, token?: string) => void;
  deleteRace: (id: string, token?: string) => void;
  onSuccess?: () => void;
  onDeleteSuccess?: () => void;
};

const RaceFormModal: React.FC<RaceFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  token,
  createRace,
  updateRace,
  deleteRace,
  onSuccess,
  onDeleteSuccess,
}) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const formDataRef = useRef<RaceFormData | null>(null);

  const handleFormSubmit = useCallback((data: RaceFormData) => {
    formDataRef.current = data;
  }, []);

  const handleSave = () => {
    // Trigger form submit to collect the data
    const form = document.getElementById('race-form') as HTMLFormElement;
    if (form) {
      form.requestSubmit();
      // Wait a tick for the form submit handler to run
      setTimeout(() => {
        if (formDataRef.current) {
          setIsSaving(true);
          if (mode === 'create') {
            createRace(formDataRef.current, token);
          } else if (initialData?.slug) {
            updateRace(initialData.slug, formDataRef.current, token);
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
      deleteRace(initialData.slug, token);
      setTimeout(() => {
        setIsDeleting(false);
        onDeleteSuccess?.();
        onClose();
      }, 500);
    }
  };

  const title = mode === 'create' ? 'New Race' : `Edit ${initialData?.name || 'Race'}`;

  return (
    <RecordFormModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      mode={mode}
      entityName="race"
      entityTitle={initialData?.name}
      onSave={handleSave}
      onDelete={mode === 'edit' ? handleDelete : undefined}
      isSaving={isSaving}
      isDeleting={isDeleting}
      maxWidth="900px"
    >
      <RaceForm initialData={initialData} onSubmit={handleFormSubmit} isSubmitting={isSaving} />
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
    createRace: (data: RaceFormData, token?: string) => {
      dispatch(
        rest.actions.createRace(
          {},
          {
            body: JSON.stringify({ race: data, token }),
          },
        ),
      );
    },
    updateRace: (id: string, data: RaceFormData, token?: string) => {
      dispatch(
        rest.actions.updateRace(
          { id },
          {
            body: JSON.stringify({ race: data, token }),
          },
        ),
      );
    },
    deleteRace: (id: string, token?: string) => {
      dispatch(
        rest.actions.deleteRace(
          { id },
          {
            body: JSON.stringify({ token }),
          },
        ),
      );
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RaceFormModal);
