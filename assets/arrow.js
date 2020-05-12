

import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import ThemeContext from '../src/components/Widget/ThemeContext';

function Arrow() {
  const { assistBackgoundColor } = useContext(ThemeContext);

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 103 101"
      version="1.1" space="preserve"
      style={{
        fillRule: 'evenodd', clipRule: 'evenodd', strokeLinecap: 'square', strokeMiterlimit: '6.15854'
      }}
    >
      <g transform="matrix(1,0,0,1,-356,-1154)">
        <g transform="matrix(5.99661e-17,-0.957639,0.335797,2.41269e-17,4.64282,1609.73)">
          <path
            d="M439.982,1223.38L412.224,1146.67L384.467,1223.38"
            style={{ fill: 'none', stroke: assistBackgoundColor !== '' ? assistBackgoundColor : 'rgb(107, 153, 255)', strokeWidth: '14.94px' }}
          />
        </g>
      </g>
    </svg>
  );
}


Arrow.propTypes = {
  ready: PropTypes.bool
};

export default Arrow;
