import { Map } from 'immutable';
import * as actionTypes from '../actions/actionTypes';
import { storeParamsTo } from './helper';

export default function (storage) {
  const initialState = Map({
    linkTarget: '',
    disableInputField: false,
    hideInputField: false,
    messageTarget: '',
    pageChangeCallback: '',
    domHighlight: {},
    messageContainerCss: '',
    messageTextCss: '',
    hintText: ''
  });

  return function reducer(state = initialState, action) {
    const storeParams = storeParamsTo(storage);
    switch (action.type) {
      // Each change to the redux store's behavior Map gets recorded to storage
      case actionTypes.CLEAR_METADATA: {
        return storeParams(state.merge(initialState)); // reset the metadata state to its inital state
      }
      case actionTypes.SET_LINK_TARGET: {
        return storeParams(state.set('linkTarget', action.target));
      }
      case actionTypes.DISABLE_INPUT: {
        return storeParams(state.set('disableInputField', true));
      }
      case actionTypes.HIDE_INPUT: {
        return storeParams(state.set('hideInputField', true));
      }
      case actionTypes.SET_MESSAGE_TARGET: {
        return storeParams(state.set('messageTarget', action.target));
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
