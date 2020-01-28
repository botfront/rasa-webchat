import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { PROP_TYPES } from 'constants';
import { addUserMessage, emitUserMessage, setQuickReply, toggleInputDisabled, changeInputFieldHint } from 'actions';
import Message from '../Message/index';

import './styles.scss';

class QuickReply extends PureComponent {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    const {
      message,
      getChosenReply,
      inputState,
      id
    } = this.props;

    const hint = message.get('hint');
    const chosenReply = getChosenReply(id);
    if (!chosenReply && !inputState) {
      // this.props.toggleInputDisabled();
      // this.props.changeInputFieldHint(hint);
    }
  }

  handleClick(reply) {
    const {
      chooseReply,
      id
    } = this.props;

    const payload = reply.payload;
    const title = reply.title;
    chooseReply(payload, title, id);
    // this.props.changeInputFieldHint('Type a message...');
  }

  render() {
    const {
      message,
      getChosenReply,
      isLast,
      id,
      linkTarget
    } = this.props;
    const chosenReply = getChosenReply(id);
    if (chosenReply) {
      return <Message message={message} />;
    }
    return (
      <div className="quickReplies-container">
        <Message message={message} />
        {isLast && (
          <div className="replies">
            {message.get('quick_replies').map((reply, index) => {
              if (reply.type === 'web_url') {
                return (
                  <a
                    key={index}
                    href={reply.url}
                    target={linkTarget}
                    rel="noopener noreferrer"
                    className={'reply'}
                  >
                    {reply.title}
                  </a>
                );
              }
              return (
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <div
                  key={index}
                  className={'reply'}
                  onClick={() => this.handleClick(reply)}
                >
                  {reply.title}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}


const mapStateToProps = state => ({
  getChosenReply: id => state.messages.get(id).get('chosenReply'),
  inputState: state.behavior.get('disabledInput'),
  linkTarget: state.metadata.get('linkTarget')
});

const mapDispatchToProps = dispatch => ({
  toggleInputDisabled: () => dispatch(toggleInputDisabled()),
  changeInputFieldHint: hint => dispatch(changeInputFieldHint(hint)),
  chooseReply: (payload, title, id) => {
    dispatch(setQuickReply(id, title));
    dispatch(addUserMessage(title));
    dispatch(emitUserMessage(payload));
    // dispatch(toggleInputDisabled());
  }
});

QuickReply.propTypes = {
  getChosenReply: PropTypes.func,
  chooseReply: PropTypes.func,
  id: PropTypes.number,
  isLast: PropTypes.bool,
  message: PROP_TYPES.QUICK_REPLY,
  linkTarget: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(QuickReply);
