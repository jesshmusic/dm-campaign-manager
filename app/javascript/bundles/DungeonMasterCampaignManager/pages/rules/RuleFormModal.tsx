import React, { useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { RecordFormModal } from '../../components/shared/modals';
import RuleForm, { RuleFormData } from './RuleForm';
import rest from '../../api/api';

type RuleData = {
  name: string;
  slug: string;
  description: string;
};

type RuleFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  initialData?: RuleData | null;
  token?: string;
  createRule: (data: RuleFormData, token?: string) => void;
  updateRule: (id: string, data: RuleFormData, token?: string) => void;
  deleteRule: (id: string, token?: string) => void;
  onSuccess?: () => void;
  onDeleteSuccess?: () => void;
};

const RuleFormModal: React.FC<RuleFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  token,
  createRule,
  updateRule,
  deleteRule,
  onSuccess,
  onDeleteSuccess,
}) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const formDataRef = useRef<RuleFormData | null>(null);

  const handleFormSubmit = useCallback((data: RuleFormData) => {
    formDataRef.current = data;
  }, []);

  const handleSave = () => {
    // Trigger form submit to collect the data
    const form = document.getElementById('rule-form') as HTMLFormElement;
    if (form) {
      form.requestSubmit();
      // Wait a tick for the form submit handler to run
      setTimeout(() => {
        if (formDataRef.current) {
          setIsSaving(true);
          if (mode === 'create') {
            createRule(formDataRef.current, token);
          } else if (initialData?.slug) {
            updateRule(initialData.slug, formDataRef.current, token);
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
      deleteRule(initialData.slug, token);
      setTimeout(() => {
        setIsDeleting(false);
        onDeleteSuccess?.();
        onClose();
      }, 500);
    }
  };

  const title = mode === 'create' ? 'New Rule' : `Edit ${initialData?.name || 'Rule'}`;

  return (
    <RecordFormModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      mode={mode}
      entityName="rule"
      entityTitle={initialData?.name}
      onSave={handleSave}
      onDelete={mode === 'edit' ? handleDelete : undefined}
      isSaving={isSaving}
      isDeleting={isDeleting}
      maxWidth="900px"
    >
      <RuleForm initialData={initialData} onSubmit={handleFormSubmit} isSubmitting={isSaving} />
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
    createRule: (data: RuleFormData, token?: string) => {
      dispatch(
        rest.actions.createRule(
          {},
          {
            body: JSON.stringify({ rule: data, token }),
          },
        ),
      );
    },
    updateRule: (id: string, data: RuleFormData, token?: string) => {
      dispatch(
        rest.actions.updateRule(
          { id },
          {
            body: JSON.stringify({ rule: data, token }),
          },
        ),
      );
    },
    deleteRule: (id: string, token?: string) => {
      dispatch(
        rest.actions.deleteRule(
          { id },
          {
            body: JSON.stringify({ token }),
          },
        ),
      );
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RuleFormModal);
