import { SESSION_NAME } from 'constants';
import { Map, fromJS } from 'immutable';
import * as actionTypes from '../actions/actionTypes';
import { getLocalSession, storeMetadataTo } from './helper';

export default function (storage) {
  const defaultValues = Map({
    linkTarget: '',
    userInput: '',
    pageChangeCallbacks: Map(),
    domHighlight: Map(),
    hintText: '',
    tooltipMessage: ''
  });

  const initialState = Map({
    tooltipDisplayed: false,
    tooltipSent: false
  }).merge(defaultValues);

  return function reducer(state = initialState, action) {
    const storeMetadata = storeMetadataTo(storage);
    switch (action.type) {
      // Each change to the redux store's behavior Map gets recorded to storage
      case actionTypes.CLEAR_METADATA: {
        return storeMetadata(state.merge(defaultValues)); // reset metadata to its default values
      }
      case actionTypes.SET_LINK_TARGET: {
        return storeMetadata(state.set('linkTarget', action.target));
      }
      case actionTypes.SET_USER_INPUT: {
        return storeMetadata(state.set('userInput', action.userInputState));
      }
      case actionTypes.TRIGGER_TOOLTIP_SENT: {
        return storeMetadata(state.set('tooltipSent', true));
      }
      case actionTypes.SET_TOOLTIP_MESSAGE: {
        return storeMetadata(state.set('tooltipMessage', action.tooltipMessage));
      }
      case actionTypes.SET_TOOLTIP_DISPLAYED: {
        return storeMetadata(state.set('tooltipDisplayed', action.displayed));
      }
      case actionTypes.SET_PAGECHANGE_CALLBACKS: {
        return storeMetadata(state.set('pageChangeCallbacks', fromJS(action.pageChangeCallbacks)));
      }
      case actionTypes.SET_DOM_HIGHLIGHT: {
        return storeMetadata(state.set('domHighlight', fromJS(action.domHighlight)));
      }
      case actionTypes.SET_HINT_TEXT: {
        return storeMetadata(state.set('hintText', action.hint));
      }
      case actionTypes.PULL_SESSION: {
        const localSession = getLocalSession(storage, SESSION_NAME);
        if (localSession && localSession.metadata) {
          return fromJS({ ...state.toJS(), ...localSession.metadata });
        }
        return state;
      }
      default:
        return state;
    }
  };
}
