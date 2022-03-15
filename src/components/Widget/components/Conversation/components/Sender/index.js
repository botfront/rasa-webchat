import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import Send from 'assets/send_button';
import sendButton from 'assets/Send.svg';


import SVG, { Props as SVGProps } from 'react-inlinesvg';

import './style.scss';

const Sender = ({ sendMessage, inputTextFieldHint, disabledInput, userInput }) => {
  const [inputValue, setInputValue] = useState('');
  const formRef = useRef('');
  function handleChange(e) {
    setInputValue(e.target.value);
  }

  function handleSubmit(e) {
    sendMessage(e);
    setInputValue('');
    return false;
  }


  function onEnterPress(e) {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      // by dispatching the event we trigger onSubmit
      formRef.current.requestSubmit(); //would not trigger onSubmit
      // formRef.current.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  }
  return (
    userInput === 'hide' ? <div /> : (
      <form ref={formRef} className="rw-sender" onSubmit={handleSubmit}>

        <TextareaAutosize type="text" minRows={1} onKeyDown={onEnterPress} maxRows={3} onChange={handleChange} className="rw-new-message" name="message" placeholder={inputTextFieldHint} disabled={disabledInput || userInput === 'disable'} autoFocus autoComplete="off" />
        <button type="submit" className="rw-send" disabled={!(inputValue && inputValue.length > 0)}>
          <SVG width="24" height="24" className="rw-send-icon" src={sendButton} />
          {/* <Send className="rw-send-icon" ready={!!(inputValue && inputValue.length > 0)} alt="send" /> */}
        </button>
      </form>));
};
const mapStateToProps = state => ({
  userInput: state.metadata.get('userInput')
});

Sender.propTypes = {
  sendMessage: PropTypes.func,
  inputTextFieldHint: PropTypes.string,
  disabledInput: PropTypes.bool,
  userInput: PropTypes.string
};

export default connect(mapStateToProps)(Sender);
