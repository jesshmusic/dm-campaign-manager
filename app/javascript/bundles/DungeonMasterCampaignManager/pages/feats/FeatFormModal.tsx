import React, { useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { RecordFormModal } from '../../components/shared/modals';
import FeatForm, { FeatFormData } from './FeatForm';
import { Feat } from '../../reducers/feats';
import rest from '../../api/api';

type FeatFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  initialData?: Feat | null;
  token?: string;
  createFeat: (data: FeatFormData, token?: string) => void;
  updateFeat: (id: number, data: FeatFormData, token?: string) => void;
  deleteFeat: (id: number, token?: string) => void;
  onSuccess?: () => void;
};

const FeatFormModal: React.FC<FeatFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  token,
  createFeat,
  updateFeat,
  deleteFeat,
  onSuccess,
}) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const formDataRef = useRef<FeatFormData | null>(null);

  const handleFormSubmit = useCallback((data: FeatFormData) => {
    formDataRef.current = data;
  }, []);

  const handleSave = () => {
    // Trigger form submit to collect the data
    const form = document.getElementById('feat-form') as HTMLFormElement;
    if (form) {
      form.requestSubmit();
      // Wait a tick for the form submit handler to run
      setTimeout(() => {
        if (formDataRef.current) {
          setIsSaving(true);
          if (mode === 'create') {
            createFeat(formDataRef.current, token);
          } else if (initialData?.id) {
            updateFeat(initialData.id, formDataRef.current, token);
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
      deleteFeat(initialData.id, token);
      setTimeout(() => {
        setIsDeleting(false);
        onSuccess?.();
        onClose();
      }, 500);
    }
  };

  const title = mode === 'create' ? 'New Feat' : `Edit ${initialData?.name || 'Feat'}`;

  return (
    <RecordFormModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      mode={mode}
      entityName="feat"
      entityTitle={initialData?.name}
      onSave={handleSave}
      onDelete={mode === 'edit' ? handleDelete : undefined}
      isSaving={isSaving}
      isDeleting={isDeleting}
      maxWidth="600px"
    >
      <FeatForm initialData={initialData} onSubmit={handleFormSubmit} isSubmitting={isSaving} />
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
    createFeat: (data: FeatFormData, token?: string) => {
      dispatch(
        rest.actions.createFeat(
          {},
          {
            body: JSON.stringify({ feat: data, token }),
          },
        ),
      );
    },
    updateFeat: (id: number, data: FeatFormData, token?: string) => {
      dispatch(
        rest.actions.updateFeat(
          { id },
          {
            body: JSON.stringify({ feat: data, token }),
          },
        ),
      );
    },
    deleteFeat: (id: number, token?: string) => {
      dispatch(
        rest.actions.deleteFeat(
          { id },
          {
            body: JSON.stringify({ token }),
          },
        ),
      );
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeatFormModal);
