import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import ThemeContext from '../src/components/Widget/ThemeContext';

function Send({ ready }) {
  const { mainColor } = useContext(ThemeContext);

  return (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 4L17.4245 17.9317L3 11.6438L21 4Z" stroke-width="2" stroke-linejoin="round"
      className={ready ? 'rw-send-icon-ready' : 'rw-send-icon'}
      style={{ fill: ready && mainColor }}/>/>
    <path d="M21.0001 4L10.2124 14.7877V19.5719L12.7717 15.8776" stroke-width="2" stroke-linejoin="round"
      className={ready ? 'rw-send-icon-ready' : 'rw-send-icon'}
      style={{ fill: ready && mainColor }}/>
  </svg>
  );
}


Send.propTypes = {
  ready: PropTypes.bool
};

export default Send;
