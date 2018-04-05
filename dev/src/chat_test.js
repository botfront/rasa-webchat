import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { Widget, addResponseMessage, addLinkSnippet, addUserMessage, addQuickReply } from '../../index';

import logo from '../../assets/logo.png';

class App extends Component {
  componentDidMount() {
    addResponseMessage('Welcome to this awesome chat!');
  }

  handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
        // Now send the message throught the backend API
    addQuickReply([
                     { title: 'Quick Reply 1', payload: 'Here is my first answer' },
                     { title: 'Quick Reply 2', payload: 'Here is another possible answer' }
    ]);
  }

  render() {
    return (
      <div className="App">
        <Widget
          handleNewUserMessage={this.handleNewUserMessage}
          profileAvatar={logo}
          title="React Chat Widget"
          subtitle="this is just a test"
        />
      </div>
    );
  }
}

ReactDom.render(
  <App />,
    document.getElementById('app'));
