import React from 'react';
import { FlashMessage } from '../../../utilities/types';
import AlertDismissible from './AlertDismissible';

type FlashMessagesProps = {
  messages: FlashMessage[]
}

const FlashMessages = ({ messages }: FlashMessagesProps) => {
  const [state, setState] = React.useState({
    flashMessages: messages
  });

  const dismissFlashMessage = (messageId: number) => {
    const removeIndex = state.flashMessages.map((flash) => flash.id).indexOf(messageId);
    const newState = [...state.flashMessages];
    newState.splice(removeIndex, 1);
    setState({ flashMessages: newState });
  };

  return (
    <div>
      {messages.map((message, index) =>
        <AlertDismissible key={index}
                          dismissFlashMessage={dismissFlashMessage}
                          messageId={message.id}
                          messageHeading={message.heading ? message.heading : 'Error'}
                          messageText={message.text}
                          messageVariant={message.type === 'alert' ? 'danger' : message.type} />
      )}
    </div>
  );
};

export default FlashMessages;