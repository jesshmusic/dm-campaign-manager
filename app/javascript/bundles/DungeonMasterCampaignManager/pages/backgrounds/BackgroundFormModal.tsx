import React, { useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { RecordFormModal } from '../../components/shared/modals';
import BackgroundForm, { BackgroundFormData } from './BackgroundForm';
import { Background } from '../../reducers/backgrounds';
import rest from '../../api/api';

type BackgroundFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  initialData?: Background | null;
  token?: string;
  createBackground: (data: BackgroundFormData, token?: string) => void;
  updateBackground: (id: number, data: BackgroundFormData, token?: string) => void;
  deleteBackground: (id: number, token?: string) => void;
  onSuccess?: () => void;
};

const BackgroundFormModal: React.FC<BackgroundFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  token,
  createBackground,
  updateBackground,
  deleteBackground,
  onSuccess,
}) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const formDataRef = useRef<BackgroundFormData | null>(null);

  const handleFormSubmit = useCallback((data: BackgroundFormData) => {
    formDataRef.current = data;
  }, []);

  const handleSave = () => {
    // Trigger form submit to collect the data
    const form = document.getElementById('background-form') as HTMLFormElement;
    if (form) {
      form.requestSubmit();
      // Wait a tick for the form submit handler to run
      setTimeout(() => {
        if (formDataRef.current) {
          setIsSaving(true);
          if (mode === 'create') {
            createBackground(formDataRef.current, token);
          } else if (initialData?.id) {
            updateBackground(initialData.id, formDataRef.current, token);
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
    if (initialData?.id) {
      setIsDeleting(true);
      deleteBackground(initialData.id, token);
      setTimeout(() => {
        setIsDeleting(false);
        onSuccess?.();
        onClose();
      }, 500);
    }
  };

  const title = mode === 'create' ? 'New Background' : `Edit ${initialData?.name || 'Background'}`;

  return (
    <RecordFormModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      mode={mode}
      entityName="background"
      entityTitle={initialData?.name}
      onSave={handleSave}
      onDelete={mode === 'edit' ? handleDelete : undefined}
      isSaving={isSaving}
      isDeleting={isDeleting}
      maxWidth="700px"
    >
      <BackgroundForm
        initialData={initialData}
        onSubmit={handleFormSubmit}
        isSubmitting={isSaving}
      />
    </RecordFormModal>
  );
};

function mapStateToProps(state: any) {
  return {
    token: state.users.token,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    createBackground: (data: BackgroundFormData, token?: string) => {
      dispatch(
        rest.actions.createBackground(
          {},
          {
            body: JSON.stringify({ background: data, token }),
          },
        ),
      );
    },
    updateBackground: (id: number, data: BackgroundFormData, token?: string) => {
      dispatch(
        rest.actions.updateBackground(
          { id },
          {
            body: JSON.stringify({ background: data, token }),
          },
        ),
      );
    },
    deleteBackground: (id: number, token?: string) => {
      dispatch(
        rest.actions.deleteBackground(
          { id },
          {
            body: JSON.stringify({ token }),
          },
        ),
      );
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundFormModal);
