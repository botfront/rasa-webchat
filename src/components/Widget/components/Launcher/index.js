import React from 'react';
import PropTypes from 'prop-types';
import openLauncher from 'assets/launcher_button.svg';
import close from 'assets/clear-button.svg';
import Badge from './components/Badge';

import './style.scss';

const Launcher = ({
  toggle,
  isChatOpen,
  badge,
  fullScreenMode,
  openLauncherImage,
  closeImage
}) => {
  const className = ['launcher'];
  if (isChatOpen) className.push('hide-sm');
  if (fullScreenMode) className.push(`full-screen${isChatOpen ? '  hide' : ''}`);
  return (
    <button
      type="button"
      className={className.join(' ')}
      onClick={toggle}
    >
      <Badge badge={badge} />
      {isChatOpen ?
        <img src={closeImage || close} className={`close-launcher ${closeImage ? '' : 'default'}`} alt="" /> :
        <img src={openLauncherImage || openLauncher} className="open-launcher" alt="" />
      }
    </button>
  );
};

Launcher.propTypes = {
  toggle: PropTypes.func,
  isChatOpen: PropTypes.bool,
  badge: PropTypes.number,
  fullScreenMode: PropTypes.bool,
  openLauncherImage: PropTypes.string,
  closeImage: PropTypes.string
};

export default Launcher;
