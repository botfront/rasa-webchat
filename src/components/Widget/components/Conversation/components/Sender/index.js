import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import send from 'assets/send_button.svg';
import './style.scss';

const Sender = ({ sendMessage, inputFieldTextHint, disabledInput }) =>
  <form className="sender" onSubmit={sendMessage}>
    <input type="text" className="new-message" name="message" placeholder={inputFieldTextHint} disabled={disabledInput} autoFocus autoComplete="off" />
    <button type="submit" className="send">
      <img src={send} className="send-icon" alt="send" />
    </button>
  </form>;

const mapStateToProps = state => ({
  inputFieldTextHint: state.behavior.get('inputFieldTextHint')
});

Sender.propTypes = {
  sendMessage: PropTypes.func,
  inputFieldTextHint: PropTypes.string,
  disabledInput: PropTypes.bool
};

export default connect(mapStateToProps)(Sender);
