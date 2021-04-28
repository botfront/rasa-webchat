import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { PROP_TYPES } from 'constants';
import { setButtons, toggleInputDisabled } from 'actions';
import Message from '../Message/index';

import './styles.scss';
import ThemeContext from '../../../../../../ThemeContext';

let chosenKeywords = []

class Keywords extends PureComponent {

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
  }

  renderKeywords(message, keywords, persit) {

    const { isLast, linkTarget, separateKeywords
    } = this.props;
    const { userTextColor, userBackgroundColor } = this.context;
    const keywordStyle = {
      color: userTextColor,
      backgroundColor: userBackgroundColor,
      borderColor: userBackgroundColor
    };
    return (
      <div>
        <Message message={message} />
        {separateKeywords && (<div className="rw-separator" />)}
        {(isLast || persit) && (
          <div className="rw-replies">
            {keywords.map((reply, index) => {
              if (reply.get('type') === 'web_url') {
                return (
                  <a
                    key={index}
                    href={reply.get('url')}
                    target={linkTarget || '_blank'}
                    rel="noopener noreferrer"
                    className={'rw-reply'}
                    style={keywordStyle}
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
                  style={keywordStyle}
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
    if (message.get('keywords') !== undefined) {
      let textarea = document.getElementsByClassName("rw-new-message")[0]
      let keywords = message.get('keywords')
      if (chosenReply && textarea) {
        if (!chosenKeywords.includes(chosenReply)) {
          chosenKeywords.push(chosenReply)
          if (chosenKeywords.length > 0) {
            textarea.value = chosenKeywords.join(" ")
          }
        }
        keywords = removeKeywords(keywords, chosenReply);
      }
      return this.renderKeywords(message, keywords, true);
    }
  }
}

function removeKeywords(keywords, keyword_name) {

  let output = keywords
  let keywords_list = []
  for (let i = 0; i < output._tail.array.length; i++) {
    if (keywords._tail.array[i]._root.entries[1][1] !== keyword_name) {
      keywords_list.push(keywords._tail.array[i]);
    }
    else {
      output.size = output.size - 1
      output._capacity = output._capacity - 1
    }
  }
  output._tail.array = keywords_list
  return output
}

Keywords.contextType = ThemeContext;

const mapStateToProps = state => ({
  getChosenReply: id => state.messages.get(id).get('chosenReply'),
  inputState: state.behavior.get('disabledInput'),
  linkTarget: state.metadata.get('linkTarget')
});

const mapDispatchToProps = dispatch => ({
  toggleInputDisabled: () => dispatch(toggleInputDisabled()),
  chooseReply: (payload, title, id) => {
    dispatch(setButtons(id, title));
  }
});

Keywords.propTypes = {
  getChosenReply: PropTypes.func,
  chooseReply: PropTypes.func,
  id: PropTypes.number,
  isLast: PropTypes.bool,
  message: PROP_TYPES.KEYWORDS,
  linkTarget: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(Keywords);
