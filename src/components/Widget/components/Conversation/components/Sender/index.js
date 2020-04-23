import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Send from 'assets/send_button';
import './style.scss';

const Sender = ({ sendMessage, inputTextFieldHint, disabledInput, userInput }) => {
  const [inputValue, setInputValue] = useState('');

  function handleChange(e) {
    setInputValue(e.target.value);
  }

  function handleSubmit(e) {
    sendMessage(e);
    setInputValue('');
  }

  return (
    userInput === 'hide' ? <div /> : (
      <form className="rw-sender" onSubmit={handleSubmit}>
        <input type="text" onChange={handleChange} className="rw-new-message" name="message" placeholder={inputTextFieldHint} disabled={disabledInput || userInput === 'disable'} autoFocus autoComplete="off" />
        <button type="submit" className="rw-send" disabled={!(inputValue && inputValue.length > 0)}>
          <Send className="rw-send-icon" ready={!!(inputValue && inputValue.length > 0)} alt="send" />
        </button>
      </form>));
};
const mapStateToProps = state => ({
  inputTextFieldHint: state.behavior.get('inputTextFieldHint'),
  userInput: state.metadata.get('userInput')
});

Sender.propTypes = {
  sendMessage: PropTypes.func,
  inputTextFieldHint: PropTypes.string,
  disabledInput: PropTypes.bool,
  userInput: PropTypes.string
};

export default connect(mapStateToProps)(Sender);
