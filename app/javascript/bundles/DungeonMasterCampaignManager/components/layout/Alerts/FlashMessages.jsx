import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert';

/**
 * @return {null}
 */
const AlertDismissible = ({ messageText, messageHeading, messageVariant }) => {
  const [show, setShow] = React.useState(true);

  if (show) {
    return (
      <Alert variant={messageVariant} onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{messageHeading}</Alert.Heading>
        {messageText}
      </Alert>
    );
  }
  return null;
};

AlertDismissible.propTypes = {
  messageText: PropTypes.string.isRequired,
  messageHeading: PropTypes.string.isRequired,
  messageVariant: PropTypes.string.isRequired,
};


const FlashMessages = ({messages}) => (
  <div>
    {messages.map((message, index) =>
      <AlertDismissible key={index}
        messageHeading={message.heading ? message.heading : 'Error'}
        messageText={message.text}
        messageVariant={message.type === 'alert' ? 'danger' : message.type } />
    )}
  </div>
);

FlashMessages.propTypes = {
  messages: PropTypes.array,
};


export default FlashMessages;