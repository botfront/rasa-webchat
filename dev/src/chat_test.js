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
    addQuickReply({
      item: 'What ice cream flavor do you want?',
      hint: 'Could you please choose an option?',
      replies:
      [
        { title: 'Mint', payload: 'I\'d like a mint flavored ice-cream please' },
        { title: 'Chocolate', payload: 'I\'d like a chocolate flavored ice-cream please' },
        { title: 'Raspberry', payload: 'I\'d like a raspberry flavored ice-cream please' },
        { title: 'Nut', payload: 'I\'d like a nut flavored ice-cream please' }
      ] });
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
