

import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import ThemeContext from '../src/components/Widget/ThemeContext';

function Arrow() {
  const { assistBackgoundColor } = useContext(ThemeContext);

  return (
    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 11L1 6L6 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  );
}


Arrow.propTypes = {
  ready: PropTypes.bool
};

export default Arrow;
