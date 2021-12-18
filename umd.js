import { func } from 'prop-types';
import { selfMount } from './index';

export default selfMount;

export function send(payload, text = '', when = 'always', tooltipSelector = false) {
    window.send(payload, text, when, tooltipSelector);
}