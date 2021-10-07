import React, { useEffect } from 'react';
import Toast from 'react-bootstrap/Toast';
import { GiBroadsword, GiSkullCrossedBones } from 'react-icons/gi';

type AlertDismissibleProps = {
  dismissFlashMessage: (messageId: number) => void;
  messageId: number;
  messageText: string;
  messageHeading: string;
  messageVariant: string;
}

const AlertDismissible = (props: AlertDismissibleProps) => {
  const {
    dismissFlashMessage,
    messageId,
    messageText,
    messageHeading,
    messageVariant
  } = props;

  useEffect(() => {
    const timer = setTimeout(() => {
      dismissFlashMessage(messageId);
    }, 10000);
    return () => clearTimeout(timer);
  });

  return (
    <Toast show={true}
           onClose={() => dismissFlashMessage(messageId)}
           style={{
             position: 'absolute',
             top: 20,
             right: 20
           }}>
      <Toast.Header>
        {messageVariant === 'success' ? (
          <GiBroadsword />
        ) : (
          <GiSkullCrossedBones />
        )}
        <strong className='mr-auto'>{messageHeading}</strong>
        <small>{messageVariant}</small>
      </Toast.Header>
      <Toast.Body>{messageText}</Toast.Body>
    </Toast>
  );
};

export default AlertDismissible;