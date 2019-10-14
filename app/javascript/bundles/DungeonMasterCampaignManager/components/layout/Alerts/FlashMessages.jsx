import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Toast from 'react-bootstrap/Toast';
import { GiBroadsword, GiSkullCrossedBones } from 'react-icons/gi';

/**
 * @return {null}
 */
const AlertDismissible = ({
  dismissFlashMessage,
  messageId,
  messageText,
  messageHeading,
  messageVariant,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      dismissFlashMessage(messageId);
    }, 4000);
    return () => clearTimeout(timer);
  });

  return (
    <Toast show={true}
           onClose={() => dismissFlashMessage(messageId)}
           style={{
             position: 'absolute',
             top: 20,
             right: 20,
           }}>
      <Toast.Header>
        {messageVariant === 'success' ? (
          <GiBroadsword/>
        ) : (
          <GiSkullCrossedBones/>
        )}
        <strong className="mr-auto">{messageHeading}</strong>
        <small>{messageVariant}</small>
      </Toast.Header>
      <Toast.Body>{messageText}</Toast.Body>
    </Toast>
  );
};

AlertDismissible.propTypes = {
  dismissFlashMessage: PropTypes.func.isRequired,
  messageId: PropTypes.number.isRequired,
  messageText: PropTypes.string.isRequired,
  messageHeading: PropTypes.string.isRequired,
  messageVariant: PropTypes.string.isRequired,
};


const FlashMessages = ({dismissFlashMessage, messages}) => (
  <div>
    {messages.map((message, index) =>
      <AlertDismissible key={index}
                        dismissFlashMessage={dismissFlashMessage}
                        messageId={message.id}
                        messageHeading={message.heading ? message.heading : 'Error'}
                        messageText={message.text}
                        messageVariant={message.type === 'alert' ? 'danger' : message.type}/>,
    )}
  </div>
);

FlashMessages.propTypes = {
  dismissFlashMessage: PropTypes.func.isRequired,
  messages: PropTypes.array,
};

const mapStateToProps = (state) => ({
  messages: state.flashMessages,
});

const mapDispatchToProps = (dispatch) => ({
  dismissFlashMessage: (id) => {
    dispatch({type: '@@dmcm@dismissFlashMessage', id});
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(FlashMessages);