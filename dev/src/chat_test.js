import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { List } from 'immutable';
import { Widget, addResponseMessage, addLinkSnippet, addUserMessage, addQuickReply } from '../../index';

import logo from '../../assets/logo.png';

class App extends Component {
  componentDidMount() {
    addResponseMessage('Welcome to this awesome chat!');
  }

  handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
        // Now send the message throught the backend API
    addQuickReply(
        List([
             { title: 'Quick Reply 1', payload: () => { console.log('QR 1'); } },
             { title: 'Quick Reply 2', payload: () => { console.log('QR 2'); } }
        ]));
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
