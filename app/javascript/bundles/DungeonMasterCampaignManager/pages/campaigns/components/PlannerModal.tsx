import React, { CSSProperties, useId } from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import { LinkButton, Notice } from '../Campaigns.styles';

const Panel = styled.div<{ $wide: boolean }>`
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: 6px;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 2rem);
  width: min(${({ $wide }) => ($wide ? '64rem' : '40rem')}, calc(100vw - 2rem));
`;

const Header = styled.header`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;

  h2 {
    margin: 0;
  }
`;

const Body = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 1rem 1.25rem;
`;

const Footer = styled.footer`
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.colors.borderColor};
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 0.75rem 1.25rem;
`;

// react-modal positions the dialog; the panel above draws it
const modalStyles: { overlay: CSSProperties; content: CSSProperties } = {
  overlay: {
    alignItems: 'center',
    background: 'rgba(0, 0, 0, 0.55)',
    display: 'flex',
    justifyContent: 'center',
    padding: '1rem',
    zIndex: 2000,
  },
  content: {
    background: 'transparent',
    border: 'none',
    inset: 'auto',
    overflow: 'visible',
    padding: 0,
    position: 'relative',
  },
};

type PlannerModalProps = {
  title: string;
  isOpen: boolean;
  onSave: () => unknown;
  onCancel: () => void;
  saveLabel?: string;
  saving?: boolean;
  // Shown above the buttons when saving fails
  error?: string | null;
  // When true, Cancel (or Escape) asks before throwing the changes away
  dirty?: boolean;
  // For long plans, like session prep
  wide?: boolean;
  children: React.ReactNode;
};

/**
 * A planner window: nothing it holds is saved until Save, and Cancel throws
 * the changes away.
 */
const PlannerModal = ({
  title,
  isOpen,
  onSave,
  onCancel,
  saveLabel = 'Save',
  saving = false,
  error = null,
  dirty = false,
  wide = false,
  children,
}: PlannerModalProps) => {
  const titleId = useId();
  const appElement =
    typeof document === 'undefined' ? null : document.getElementById('dmsContainer');

  const cancel = () => {
    if (saving) return;
    if (dirty && !window.confirm('Discard your changes?')) return;
    onCancel();
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={cancel}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc
      appElement={appElement ?? undefined}
      ariaHideApp={appElement !== null}
      aria={{ labelledby: titleId }}
      style={modalStyles}
    >
      <Panel $wide={wide}>
        <Header>
          <h2 id={titleId}>{title}</h2>
          <LinkButton type="button" aria-label="Close" onClick={cancel}>
            ✕
          </LinkButton>
        </Header>
        <Body>{children}</Body>
        <Footer>
          {error && <Notice role="alert">{error}</Notice>}
          <Button color={Colors.secondary} title="Cancel" onClick={cancel} disabled={saving} />
          <Button
            color={Colors.primary}
            title={saving ? 'Saving…' : saveLabel}
            onClick={() => void onSave()}
            disabled={saving}
          />
        </Footer>
      </Panel>
    </ReactModal>
  );
};

export default PlannerModal;
