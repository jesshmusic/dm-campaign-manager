import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert';

/**
 * @return {null}
 */
const AlertDismissible = ({ messageText, messageHeading }) => {
  const [show, setShow] = React.useState(true);

  if (show) {
    return (
      <Alert variant="danger" onClose={() => setShow(false)} dismissible>
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
};


const FlashMessages = ({messages}) => (
  <div>
    {messages.map((message) => <AlertDismissible key={message.id ? message.id : Date.now()}
      messageHeading={message.heading ? message.heading : 'Error'}
      messageText={message.text} />)}
  </div>
);

FlashMessages.propTypes = {
  messages: PropTypes.array,
};


export default FlashMessages;