import React from 'react';
import PropTypes from 'prop-types';

import close from 'assets/clear-button.svg';
import fullscreen from 'assets/fullscreen_button.svg';
import fullscreenExit from 'assets/fullscreen_exit_button.svg';
import './style.scss';

const Header = ({
  title,
  subtitle,
  fullScreenMode,
  toggleFullScreen,
  toggleChat,
  showCloseButton,
  showFullScreenButton,
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
      {
        showFullScreenButton &&
        <button className="toggle-fullscreen-button" onClick={toggleFullScreen}>
          <img
            className="toggle-fullscreen"
            src={fullScreenMode ? fullscreenExit : fullscreen}
            alt="toggle fullscreen"
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
  fullScreenMode: PropTypes.bool,
  toggleFullScreen: PropTypes.func,
  toggleChat: PropTypes.func,
  showCloseButton: PropTypes.bool,
  showFullScreenButton: PropTypes.bool,
  connected: PropTypes.bool,
  connectingText: PropTypes.string,
  closeImage: PropTypes.string
};

export default Header;
