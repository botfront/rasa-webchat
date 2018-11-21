import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Badge from './components/Badge';

import openLauncher from 'assets/launcher_button.svg';
import close from 'assets/clear-button.svg';
import './style.scss';

const Launcher = ({ toggle, isChatOpen, badge, fullScreenMode }) =>
  <button type="button" className={(isChatOpen ? 'launcher hide-sm' : 'launcher') + (fullScreenMode ? ` full-screen${isChatOpen ? '  hide' : ''}` : '')} onClick={toggle}>
    <Badge badge ={badge} />
    {
      isChatOpen ?
        <img src={close} className="close-launcher" alt="" /> :
        <img src={openLauncher} className="open-launcher" alt="" />
    }
  </button>;

Launcher.propTypes = {
  toggle: PropTypes.func,
  isChatOpen: PropTypes.bool,
  badge: PropTypes.number,
  fullScreenMode: PropTypes.bool
};

export default Launcher;
