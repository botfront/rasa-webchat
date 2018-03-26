import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { Widget, addResponseMessage, addLinkSnippet, addUserMessage } from '../../index';

import logo from '../../assets/logo.svg';

class App extends Component {
  componentDidMount() {
    addResponseMessage('Welcome to this awesome chat!');
  }

  handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
        // Now send the message throught the backend API
  }

  render() {
    return (
      <div className="App">
        <Widget
          handleNewUserMessage={this.handleNewUserMessage}
          profileAvatar={logo}
          title="My new awesome title"
          subtitle="And my cool subtitle"
        />
      </div>
    );
  }
}

ReactDom.render(
  <App />,
    document.getElementById('app'));
