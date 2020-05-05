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

    const payload = reply.get('payload');
    const title = reply.get('title');
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
      <div>
        <Message message={message} />
        {isLast && (
          <div className="rw-replies">
            {message.get('quick_replies').map((reply, index) => {
              if (reply.get('type') === 'web_url') {
                return (
                  <a
                    key={index}
                    href={reply.get('url')}
                    target={linkTarget || '_blank'}
                    rel="noopener noreferrer"
                    className={'rw-reply'}
                  >
                    {reply.get('title')}
                  </a>
                );
              }
              return (
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <div
                  key={index}
                  className={'rw-reply'}
                  onClick={(e) => { e.stopPropagation(); this.handleClick(reply); }}
                >
                  {reply.get('title')}
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
