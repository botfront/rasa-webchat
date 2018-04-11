/* eslint-disable no-undef */
import React, { Component } from 'react';
import { isSnippet, isQR, isText } from './msgProcessor';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { toggleChat, addUserMessage, emitUserMessage, addResponseMessage, addLinkSnippet, addQuickReply, initialize } from 'actions';
import WidgetLayout from './layout';


class Widget extends Component {

  componentDidMount() {
    const { initPayload, initialized, socket } = this.props;

    socket.on('bot_uttered', (botUttered) => {
      this.dispatchMessage(botUttered);
    });
    if (!initialized) {
      this.props.dispatch(initialize());
      socket.emit('user_uttered', initPayload);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fullScreenMode) {
      this.props.dispatch(toggleChat());
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
  }

  render() {
    return (
      <WidgetLayout
        onToggleConversation={this.toggleConversation}
        onSendMessage={this.handleMessageSubmit}
        title={this.props.title}
        subtitle={this.props.subtitle}
        profileAvatar={this.props.profileAvatar}
        showCloseButton={this.props.showCloseButton}
        fullScreenMode={this.props.fullScreenMode}
        badge={this.props.badge}
      />
    );
  }
}

const mapStateToProps = state => ({
  initialized: state.behavior.get('initialized')
});

Widget.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  initPayload: PropTypes.string,
  initialized: PropTypes.bool,
  inputTextFieldHint: PropTypes.string,
  handleNewUserMessage: PropTypes.func.isRequired,
  profileAvatar: PropTypes.string,
  showCloseButton: PropTypes.bool,
  fullScreenMode: PropTypes.bool,
  badge: PropTypes.number,
  socket: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(Widget);
