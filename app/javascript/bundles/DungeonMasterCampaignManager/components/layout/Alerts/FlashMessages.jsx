import React from 'react';
import Alert from './Alert.jsx';

export default class FlashMessages extends React.Component {
  constructor (props) {
    super(props);
    console.log(props);
    this.state = {messages: props.messages};
  }

  render () {
    return (
      <div>
        {this.state.messages.map(message =>
          <Alert key={message.id} message={message}/>)}
      </div>
    );
  }
}