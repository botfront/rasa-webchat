import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import ThemeContext from '../src/components/Widget/ThemeContext';

function Send({ ready }) {
  const { mainColor } = useContext(ThemeContext);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      enableBackground="new 0 0 535.5 535.5"
      version="1.1"
      viewBox="0 0 535.5 535.5"
      xmlSpace="preserve"
    >
      <path
        className={ready ? 'rw-send-icon-ready' : 'rw-send-icon'}
        style={{ fill: ready && mainColor }}
        d="M0 497.25L535.5 267.75 0 38.25 0 216.75 382.5 267.75 0 318.75z"
      />
    </svg>
  );
}


Send.propTypes = {
  ready: PropTypes.bool
};

export default Send;
