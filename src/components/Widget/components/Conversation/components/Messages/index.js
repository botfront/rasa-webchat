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
    return (
      <div id="messages" className="messages-container">
        {
          this.props.messages.map((message, index) =>
            <div className="message" key={index}>
              {
                this.props.profileAvatar &&
                message.get('showAvatar') &&
                <img src={this.props.profileAvatar} className="avatar" alt="profile" />
              }
              {

                this.getComponentToRender(message, index, index === this.props.messages.size - 1)
              }
            </div>
          )
        }
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
