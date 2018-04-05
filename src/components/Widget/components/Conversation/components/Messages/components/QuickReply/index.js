import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { PROP_TYPES } from 'constants';
import { addUserMessage, setQuickReply, toggleInputDisabled } from 'actions';

import './styles.scss';

class QuickReply extends PureComponent {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    const chosenReply = this.props.getChosenReply(this.props.id);
    if (!chosenReply && !this.props.inputState) {
      this.props.toggleInputDisabled();
    }
  }

  handleClick(reply) {
    const message = reply.payload;
    const title = reply.title;
    const id = this.props.id;
    this.props.chooseReply(message, title, id);
  }


  render() {
    const chosenReply = this.props.getChosenReply(this.props.id);
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

const mapStateToProps = state => ({
  getChosenReply: id => state.messages.get(id).get('chosenReply'),
  inputState: state.behavior.get('disabledInput')
});

const mapDispatchToProps = dispatch => ({
  toggleInputDisabled: _ => dispatch(toggleInputDisabled()),
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
