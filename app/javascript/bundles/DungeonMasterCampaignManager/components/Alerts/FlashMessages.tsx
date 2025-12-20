import { FlashMessage } from '../../utilities/types';
import AlertDismissible from './AlertDismissible';
import { connect } from 'react-redux';
import { dismissFlashMessage } from '../../reducers/flashMessages';
import { RootState, AppDispatch } from '../../store/store';

type FlashMessagesProps = {
  onDismissFlashMessage: (messageId: number) => void;
  messages: FlashMessage[];
};

const FlashMessages = ({ onDismissFlashMessage, messages }: FlashMessagesProps) => {
  return (
    <div>
      {messages.map((message, index) => (
        <AlertDismissible
          key={message.id}
          offset={index}
          dismissFlashMessage={onDismissFlashMessage}
          messageId={message.id}
          messageHeading={message.heading ? message.heading : 'Error'}
          messageText={message.text}
          messageVariant={message.messageType}
        />
      ))}
    </div>
  );
};

function mapStateToProps(state: RootState) {
  return {
    messages: state.flashMessages,
  };
}

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    onDismissFlashMessage: (messageId: number) => {
      dispatch(dismissFlashMessage(messageId));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FlashMessages);
