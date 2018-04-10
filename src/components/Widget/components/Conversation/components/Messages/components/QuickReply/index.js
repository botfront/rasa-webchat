import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { PROP_TYPES } from 'constants';
import { addUserMessage, setQuickReply, toggleInputDisabled, changeInputFieldHint } from 'actions';

import './styles.scss';

class QuickReply extends PureComponent {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    const hint = this.props.message.get('hint');
    const chosenReply = this.props.getChosenReply(this.props.id);
    if (!chosenReply && !this.props.inputState) {
      this.props.toggleInputDisabled();
      this.props.changeInputFieldHint(hint);
    }
  }

  handleClick(reply) {
    const message = reply.payload;
    const title = reply.title;
    const id = this.props.id;
    this.props.chooseReply(message, title, id);
    this.props.changeInputFieldHint('Type a message...');
  }


  render() {
    const chosenReply = this.props.getChosenReply(this.props.id);
    if (chosenReply) {
      return (
        <div className={this.props.message.get('sender')}>
          <div className="message-text">{this.props.message.get('item')}</div>
        </div>);
    }
    return (
      <div>
        <div className={this.props.message.get('sender')}>
          <div className="message-text">{this.props.message.get('item')}</div>
        </div>
        <div className="replies">
          {this.props.message.get('replies').map((reply, index) => <div key={index} className={'reply'} onClick={this.handleClick.bind(this, reply)}>{reply.title}</div>)}
        </div>
      </div>);
  }
  }

const mapStateToProps = state => ({
  getChosenReply: id => state.messages.get(id).get('chosenReply'),
  inputState: state.behavior.get('disabledInput')
});

const mapDispatchToProps = dispatch => ({
  toggleInputDisabled: _ => dispatch(toggleInputDisabled()),
  changeInputFieldHint: hint => dispatch(changeInputFieldHint(hint)),
  chooseReply: (payload, title, id) => {
    dispatch(setQuickReply(id, title));
    dispatch(addUserMessage(payload));
    dispatch(toggleInputDisabled());
  }
});

QuickReply.propTypes = {
  message: PROP_TYPES.QUICK_REPLY
};

export default connect(mapStateToProps, mapDispatchToProps)(QuickReply);
