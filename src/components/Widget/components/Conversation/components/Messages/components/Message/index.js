import React, { PureComponent } from 'react';
import ReactMarkdown from 'react-markdown';
import { PROP_TYPES } from 'constants';

import './styles.scss';

class Message extends PureComponent {
  render() {
    const sender = this.props.message.get('sender');
    const text = this.props.message.get('text');
    return (
      <div className={sender}>
        <div className="message-text" >
          {sender === 'response' ? (
            <ReactMarkdown className={'markdown'} source={text} linkTarget={(url) => { if (!url.startsWith('mailto') && !url.startsWith('javascript')) return '_blank'; }} transformLinkUri={null} />
          ) : (
            text
          )}
        </div>
      </div>
    );
  }
}

Message.propTypes = {
  message: PROP_TYPES.MESSAGE
};

export default Message;