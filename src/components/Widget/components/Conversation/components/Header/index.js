import React from 'react';
import PropTypes from 'prop-types';

import close from 'assets/clear-button.svg';
import './style.scss';

const Header = ({
  title,
  subtitle,
  toggleChat,
  showCloseButton,
  connected,
  connectingText,
  closeImage
}) =>
  <div>
    <div className="header">
      {
        showCloseButton &&
        <button className="close-button" onClick={toggleChat}>
          <img
            className={`close ${closeImage ? '' : 'default'}`}
            src={closeImage || close}
            alt="close"
          />
        </button>
      }
      <h4 className="title">{title}</h4>
      {subtitle && <span>{subtitle}</span>}
    </div>
  {
    !connected &&
    <span className="loading">
      {connectingText}
    </span>
  }
  </div>;

Header.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  toggleChat: PropTypes.func,
  showCloseButton: PropTypes.bool,
  connected: PropTypes.bool,
  connectingText: PropTypes.string,
  closeImage: PropTypes.string
};

export default Header;
