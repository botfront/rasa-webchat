import React, { PureComponent } from 'react';
import { PROP_TYPES } from 'constants';
import Linkify from 'linkifyjs/react';

import './styles.scss';

class Message extends PureComponent {
  render() {
    return (
      <div className={this.props.message.get('sender')}>
        <div className="message-text" >
          <Linkify tagName="p" style={{ margin: '0' }}>{this.props.message.get('text')}</Linkify>
        </div>
      </div>
    );
  }
}

Message.propTypes = {
  message: PROP_TYPES.MESSAGE
};

export default Message;