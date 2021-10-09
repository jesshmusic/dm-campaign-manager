import React, { useEffect } from 'react';
import { GiBroadsword, GiSkullCrossedBones } from 'react-icons/gi';

type AlertDismissibleProps = {
  dismissFlashMessage: (messageId: number) => void;
  messageId: number;
  messageText: string;
  messageHeading: string;
  messageVariant: string;
};

const AlertDismissible = (props: AlertDismissibleProps) => {
  const {
    dismissFlashMessage,
    messageId,
    messageText,
    messageHeading,
    messageVariant,
  } = props;

  useEffect(() => {
    const timer = setTimeout(() => {
      dismissFlashMessage(messageId);
    }, 10000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 11 }}>
      <div
        id="liveToast"
        className="toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="toast-header">
          {messageVariant === 'success' ? (
            <GiBroadsword />
          ) : (
            <GiSkullCrossedBones />
          )}
          <strong className="mr-auto">{messageHeading}</strong>
          <small>{messageVariant}</small>
        </div>
        <div className="toast-body">{messageText}</div>
      </div>
    </div>
  );
};

export default AlertDismissible;
