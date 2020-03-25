import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Badge = ({ badge }) =>
  badge > 0 &&
  <span className="rw-badge">{badge}</span>;

Badge.propTypes = {
  badge: PropTypes.number
};

export default Badge;
