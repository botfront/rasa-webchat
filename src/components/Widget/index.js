/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  toggleChat,
  addUserMessage,
  emitUserMessage,
  addResponseMessage,
  addLinkSnippet,
  addVideoSnippet,
  addImageSnippet,
  addQuickReply,
  connectServer,
  disconnectServer,
  pullSession
} from 'actions';

import { isSnippet, isVideo, isImage, isQR, isText } from './msgProcessor';
import WidgetLayout from './layout';
import { storeLocalSession, getLocalSession } from '../../store/reducers/helper';
import { SESSION_NAME } from 'constants';

class Widget extends Component {

  constructor(props) {
    super(props);
    this.messages = [];
    setInterval(() => {
      if (this.messages.length > 0) {
        this.dispatchMessage(this.messages.shift());
      }
    }, this.props.interval);
  }

  componentDidMount() {
    const { initPayload, customData, socket, storage } = this.props;

    socket.on('bot_uttered', (botUttered) => {
      this.messages.push(botUttered);
    });

    /* Request a session from server */
    this.props.dispatch(pullSession());

    // Get the local session, check if there is an existing session_id
    const localSession = getLocalSession(storage, SESSION_NAME);
    const local_id = localSession? localSession.session_id: null

    // Send a session_request to the server
    socket.on('connect', () => {
      socket.emit('session_request', ({ 'session_id': local_id }));
    });

    // When session_confirm is received from the server:
    socket.on('session_confirm', (remote_id) => {
      console.log(`session_confirm:${socket.id} session_id:${remote_id}`);
      
      /*
      Check if the session_id is consistent with the server
      If the local_id is null or different from the remote_id,
      start a new session.
      */
      if (local_id != remote_id) {
        socket.emit('user_uttered', { message: initPayload, customData, session_id: remote_id });
        
        // Store the received session_id to storage
        storeLocalSession(storage, SESSION_NAME, remote_id);

        // Store the initial state to both the redux store and the storage
        this.props.dispatch(connectServer());
      }
    });

    socket.on('disconnect', (reason) => {
      console.log(reason);
      this.props.dispatch(disconnectServer());
    });

    if (this.props.embedded || this.props.fullScreenMode) {
      this.toggleConversation();
    }
  }

  dispatchMessage(message) {
    if (Object.keys(message).length === 0) {
      return;
    }
    if (isText(message)) {
      this.props.dispatch(addResponseMessage(message.text));
    } else if (isQR(message)) {
      this.props.dispatch(addQuickReply(message));
    } else if (isSnippet(message)) {
      const element = message.attachment.payload.elements[0];
      this.props.dispatch(addLinkSnippet({
        title: element.title,
        content: element.buttons[0].title,
        link: element.buttons[0].url,
        target: '_blank'
      }));
    } else if (isVideo(message)) {
      const element = message.attachment.payload;
      this.props.dispatch(addVideoSnippet({
        title: element.title,
        video: element.src
      }));
    } else if (isImage(message)) {
      const element = message.attachment.payload;
      this.props.dispatch(addImageSnippet({
        title: element.title,
        image: element.src
      }));
    }
  }

  toggleConversation = () => {
    this.props.dispatch(toggleChat());
  };

  handleMessageSubmit = (event) => {
    event.preventDefault();
    const userUttered = event.target.message.value;
    if (userUttered) {
      this.props.dispatch(addUserMessage(userUttered));
      this.props.dispatch(emitUserMessage(userUttered));
    }
    event.target.message.value = '';
  };

  render() {
    return (
      <WidgetLayout
        onToggleConversation={this.toggleConversation}
        onSendMessage={this.handleMessageSubmit}
        title={this.props.title}
        subtitle={this.props.subtitle}
        customData={this.props.customData}
        profileAvatar={this.props.profileAvatar}
        showCloseButton={this.props.showCloseButton}
        fullScreenMode={this.props.fullScreenMode}
        showWidget={this.props.showWidget}
        showChat={this.props.showChat}
        badge={this.props.badge}
        embedded={this.props.embedded}
        params={this.props.params}
      />
    );
  }
}

Widget.propTypes = {
  interval: PropTypes.number,
  title: PropTypes.string,
  customData: PropTypes.shape({}),
  subtitle: PropTypes.string,
  initPayload: PropTypes.string,
  profileAvatar: PropTypes.string,
  showCloseButton: PropTypes.bool,
  fullScreenMode: PropTypes.bool,
  showWidget: PropTypes.bool,
  showChat: PropTypes.bool,
  badge: PropTypes.number,
  socket: PropTypes.shape({}),
  embedded: PropTypes.bool,
  params: PropTypes.object
};

export default connect()(Widget);