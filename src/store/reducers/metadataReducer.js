import { Map } from 'immutable';
import * as actionTypes from '../actions/actionTypes';
import { storeParamsTo } from './helper';

export default function (storage) {
  const defaultValues = Map({
    linkTarget: '',
    userInput: '',
    messageTarget: '',
    pageChangeCallback: '',
    domHighlight: {},
    messageContainerCss: '',
    messageTextCss: '',
    hintText: '',
    tooltipMessage: ''
  });

  const initialState = Map({
    tooltipDisplayed: false,
    tooltipSent: false
  }).merge(defaultValues);

  return function reducer(state = initialState, action) {
    const storeParams = storeParamsTo(storage);
    switch (action.type) {
      // Each change to the redux store's behavior Map gets recorded to storage
      case actionTypes.CLEAR_METADATA: {
        return storeParams(state.merge(defaultValues)); // reset metadata state to its default values
      }
      case actionTypes.SET_LINK_TARGET: {
        return storeParams(state.set('linkTarget', action.target));
      }
      case actionTypes.SET_USER_INPUT: {
        return storeParams(state.set('userInput', action.userInputState));
      }
      case actionTypes.TRIGGER_TOOLTIP_SENT: {
        return storeParams(state.set('tooltipSent', true));
      }
      case actionTypes.SET_TOOLTIP_MESSAGE: {
        return storeParams(state.set('tooltipMessage', action.tooltipMessage));
      }
      case actionTypes.SET_TOOLTIP_DISPLAYED: {
        return storeParams(state.set('tooltipDisplayed', action.displayed));
      }
      case actionTypes.SET_PAGECHANGE_REGEX: {
        return storeParams(state.set('pageChangeCallback', action.regex));
      }
      case actionTypes.SET_DOM_HIGHLIGHT: {
        return storeParams(state.set('domHighlight', action.domHighlight));
      }
      case actionTypes.SET_CONTAINER_CSS: {
        return storeParams(state.set('messageContainerCss', action.css));
      }
      case actionTypes.SET_TEXT_CSS: {
        return storeParams(state.set('messageTextCss', action.css));
      }
      case actionTypes.SET_HINT_TEXT: {
        return storeParams(state.set('hintText', action.hint));
      }
      default:
        return state;
    }
  };
}
