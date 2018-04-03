/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { toggleChat, addUserMessage, addResponseMessage } from 'actions';
import io from 'socket.io-client';
import WidgetLayout from './layout';


class Widget extends Component {

  componentDidMount() {
    this.socket = io(this.props.socketUrl);
    this.socket.on('connect', () => {
      console.log(`connect:${this.socket.id}`);
    });

    this.socket.on('bot_uttered', (botUttered) => {
      console.log(botUttered);
      this.props.dispatch(addResponseMessage(botUttered.text));
    });

    this.socket.on('connect_error', (error) => {
      console.log(error);
    });

    this.socket.on('error', (error) => {
      console.log(error);
    });

    this.socket.on('disconnect', (reason) => {
      console.log(reason);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fullScreenMode) {
      this.props.dispatch(toggleChat());
    }
  }

  toggleConversation = () => {
    this.props.dispatch(toggleChat());
  }

  handleMessageSubmit = (event) => {
    event.preventDefault();
    const userUttered = event.target.message.value;
    if (userUttered) {
      this.props.dispatch(addUserMessage(userUttered));
      this.socket.emit('user_uttered', userUttered);
    }
    event.target.message.value = '';
  }

  render() {
    return (
      <WidgetLayout
        onToggleConversation={this.toggleConversation}
        onSendMessage={this.handleMessageSubmit}
        title={this.props.title}
        subtitle={this.props.subtitle}
        senderPlaceHolder={this.props.senderPlaceHolder}
        profileAvatar={this.props.profileAvatar}
        showCloseButton={this.props.showCloseButton}
        fullScreenMode={this.props.fullScreenMode}
        badge={this.props.badge}
      />
    );
  }
}

Widget.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  socketUrl: PropTypes.string,
  senderPlaceHolder: PropTypes.string,
  profileAvatar: PropTypes.string,
  showCloseButton: PropTypes.bool,
  fullScreenMode: PropTypes.bool,
  badge: PropTypes.number
};

export default connect()(Widget);
