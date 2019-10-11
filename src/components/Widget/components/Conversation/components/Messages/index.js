import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { MESSAGES_TYPES } from 'constants';
import { Video, Image, Message, Snippet, QuickReply } from 'messagesComponents';

import './styles.scss';

const scrollToBottom = () => {
  const messagesDiv = document.getElementById('messages');
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
};

class Messages extends Component {
  componentDidMount() {
    scrollToBottom();
  }

  componentDidUpdate() {
    scrollToBottom();
  }

  getComponentToRender = (message, index, isLast) => {
    const { params } = this.props;
    const ComponentToRender = (() => {
      switch(message.get('type')){
        case MESSAGES_TYPES.TEXT: {
          return Message
        }
        case MESSAGES_TYPES.SNIPPET.LINK: {
          return Snippet
        }
        case MESSAGES_TYPES.VIDREPLY.VIDEO: {
          return Video
        }
        case MESSAGES_TYPES.IMGREPLY.IMAGE: {
          return Image
        }
        case MESSAGES_TYPES.QUICK_REPLY: {
          return QuickReply
        }
        case MESSAGES_TYPES.CUSTOM_COMPONENT:
          return connect(
            store => ({ store }),
            dispatch => ({ dispatch })
          )(this.props.customComponent);
      }
      return null
    })()
    if (message.get('type') === 'component') {
      return <ComponentToRender id={index} {...message.get('props')} isLast={isLast}/>;
    }
    return <ComponentToRender id={index} params={params} message={message} isLast={isLast} />;
  }

  render() {
    const renderMessages = () => {
      const groups = [];
      let group = null;

      if (this.props.messages.isEmpty()) return null;

      const renderMessage = (message, index) => (
        <div className="message" key={index}>
          {
            this.props.profileAvatar &&
            message.get('showAvatar') &&
            <img src={this.props.profileAvatar} className="avatar" alt="profile" />
          }
          { this.getComponentToRender(message, index, index === this.props.messages.size - 1) }
        </div>
      );

      this.props.messages.forEach((msg, index) => {
        if (group === null || group.from !== msg.get('sender')) {
          if (group !== null) groups.push(group);

          group = {
            from: msg.get('sender'),
            messages: []
          };
        }

        group.messages.push(renderMessage(msg, index));
      });

      groups.push(group); // finally push last group of messages.

      return groups.map((g, index) => (
        <div className={`group-message from-${g.from}`} key={`group_${index}`}>
          {g.messages}
        </div>
      ));
    };

    return (
      <div id="messages" className="messages-container">
        { renderMessages() }
      </div>
    );
  }
}

Messages.propTypes = {
  messages: ImmutablePropTypes.listOf(ImmutablePropTypes.map),
  profileAvatar: PropTypes.string,
  customComponent: PropTypes.func
};

export default connect(store => ({
  messages: store.messages
}))(Messages);
