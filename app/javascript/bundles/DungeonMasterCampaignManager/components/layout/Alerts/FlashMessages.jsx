import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert';
import {connect} from 'react-redux';

/**
 * @return {null}
 */
const AlertDismissible = ({
  dismissFlashMessage,
  messageId,
  messageText,
  messageHeading,
  messageVariant,
}) => (
  <Alert variant={messageVariant} onClose={() => dismissFlashMessage(messageId)} dismissible>
    <Alert.Heading>{messageHeading}</Alert.Heading>
    {messageText}
  </Alert>
);

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