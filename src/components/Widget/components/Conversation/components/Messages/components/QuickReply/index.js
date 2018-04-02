import React, { PureComponent } from 'react';
import { PROP_TYPES } from 'constants';

import './styles.scss';

class QuickReply extends PureComponent {
  getReplies(replies) {
    let i = 0;
    return replies.toArray().map(reply => <li key={i += 1}>{reply.title}</li>);
  }

  render() {
    return (
      <div className={this.props.message.get('sender')}>
        <div className="message-text">
          <ul>{this.getReplies(this.props.message.get('replies'))}</ul>
        </div>
      </div>
    );
  }
  }

QuickReply.propTypes = {
  message: PROP_TYPES.QUICK_REPLY
};

export default QuickReply;
