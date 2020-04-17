import { Map, fromJS } from 'immutable';
import * as actionTypes from '../actions/actionTypes';
import { getLocalSession, storeMetadataTo } from './helper';

export default function (storage, storageKey) {
  const defaultValues = Map({
    linkTarget: '',
    userInput: '',
    domHighlight: Map(),
    hintText: '',
    showTooltip: false
  });

  const initialState = Map({
    tooltipSent: Map()
  }).merge(defaultValues);

  return function reducer(state = initialState, action) {
    const storeMetadata = storeMetadataTo(storage, storageKey);
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
        return storeMetadata(state.set('tooltipSent', state.get('tooltipSent').set(action.payloadSent, true)));
      }
      case actionTypes.SHOW_TOOLTIP: {
        return storeMetadata(state.set('showTooltip', action.visible));
      }
      case actionTypes.SET_DOM_HIGHLIGHT: {
        return storeMetadata(state.set('domHighlight', fromJS(action.domHighlight)));
      }
      case actionTypes.SET_HINT_TEXT: {
        return storeMetadata(state.set('hintText', action.hint));
      }
      case actionTypes.PULL_SESSION: {
        const localSession = getLocalSession(storage, storageKey);
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
