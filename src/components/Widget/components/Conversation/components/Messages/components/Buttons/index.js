import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { PROP_TYPES } from 'constants';
import { addUserMessage, emitUserMessage, setButtons, toggleInputDisabled, changeInputFieldHint } from 'actions';
import Message from '../Message/index';

import './styles.scss';
import ThemeContext from '../../../../../../ThemeContext';


class Buttons extends PureComponent {
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

  renderButtons(message, buttons, persit) {
    const { isLast, linkTarget, separateButtons
    } = this.props;
    const { mainColor } = this.context;
    return (
      <div>
        <Message message={message} />
        {separateButtons && (<div className="rw-separator"/>) }
        {(isLast || persit) && (
          <div className="rw-replies">
            {buttons.map((reply, index) => {
              if (reply.get('type') === 'web_url') {
                return (
                  <a
                    key={index}
                    href={reply.get('url')}
                    target={linkTarget || '_blank'}
                    rel="noopener noreferrer"
                    className={'rw-reply'}
                    style={{ borderColor: mainColor, color: mainColor }}
                    onMouseUp={e => e.stopPropagation()}
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
                  style={{ borderColor: mainColor, color: mainColor }}
                  onMouseUp={e => e.stopPropagation()}
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


  render() {
    const {
      message,
      getChosenReply,
      id
    } = this.props;
    const chosenReply = getChosenReply(id);
    if (message.get('quick_replies') !== undefined) {
      const buttons = message.get('quick_replies');
      if (chosenReply) {
        return <Message message={message} />;
      }
      return this.renderButtons(message, buttons, false);
    } else if (message.get('buttons') !== undefined) {
      const buttons = message.get('buttons');
      return this.renderButtons(message, buttons, true);
    }
    return <Message message={message} />;
  }
}

Buttons.contextType = ThemeContext;

const mapStateToProps = state => ({
  getChosenReply: id => state.messages.get(id).get('chosenReply'),
  inputState: state.behavior.get('disabledInput'),
  linkTarget: state.metadata.get('linkTarget')
});

const mapDispatchToProps = dispatch => ({
  toggleInputDisabled: () => dispatch(toggleInputDisabled()),
  changeInputFieldHint: hint => dispatch(changeInputFieldHint(hint)),
  chooseReply: (payload, title, id) => {
    dispatch(setButtons(id, title));
    dispatch(addUserMessage(title));
    dispatch(emitUserMessage(payload));
    // dispatch(toggleInputDisabled());
  }
});

Buttons.propTypes = {
  getChosenReply: PropTypes.func,
  chooseReply: PropTypes.func,
  id: PropTypes.number,
  isLast: PropTypes.bool,
  message: PROP_TYPES.BUTTONS,
  linkTarget: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(Buttons);
