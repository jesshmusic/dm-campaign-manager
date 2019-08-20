import React from 'react';
import Alert from 'react-bootstrap/Alert';

function AlertDismissible(message) {
  const [show, setShow] = React.useState(true);

  if (show) {
    return (
      <Alert variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Error</Alert.Heading>
        {message}
      </Alert>
    );
  }
}


export default class FlashMessages extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      messages: props.messages
    };
  }

  render () {
    return (
      <div>
        {this.state.messages.map((message) => <AlertDismissible key={message.id} message={message} />)}
      </div>
    );
  }
}