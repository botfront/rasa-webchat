import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { PROP_TYPES } from 'constants';
import { insertUserMessage, setQuickReply } from 'actions';

import './styles.scss';

class QuickReply extends PureComponent {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  getReplies(replies) {
    let i = 0;
    return replies.map(reply => <li key={i += 1} data-payload={reply.payload}>{reply.title}</li>);
  }

  handleClick(reply) {
    const message = reply.payload;
    const title = reply.title;
    const id = this.props.id;
    this.props.chooseReply(message, title, id);
  }


  render() {
    const chosenReply = this.props.chosenReply(this.props.id);
    if (chosenReply) {
      return (
        <div className={this.props.message.get('sender')}>
          <div className="message-text">{chosenReply}</div>
        </div>);
    }
    return (
      <div className="message">
        {this.props.message.get('replies').map((reply, index) => <div key={index} className={'response'} onClick={this.handleClick.bind(this, reply)}>{reply.title}</div>)}
      </div>);
  }
  }

QuickReply.propTypes = {
  message: PROP_TYPES.QUICK_REPLY
};

const mapStateToProps = state => ({
  chosenReply: id => state.messages.get(id).get('chosenReply')
});

const mapDispatchToProps = dispatch => ({
  chooseReply: (payload, title, id) => {
    dispatch(setQuickReply(id, title));
    dispatch(insertUserMessage(id + 1, payload));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(QuickReply);
