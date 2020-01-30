import { createStore, combineReducers, compose, applyMiddleware } from 'redux';

import { SESSION_NAME } from 'constants';

import behavior from './reducers/behaviorReducer';
import messages from './reducers/messagesReducer';
import metadata from './reducers/metadataReducer';

import { getLocalSession } from './reducers/helper';
import * as actionTypes from './actions/actionTypes';

const cleanURL = (url) => {
  const regexProtocolHostPort = /https?:\/\/(([A-Za-z0-9-])+(\.?))+[a-z]+(:[0-9]+)?/;
  const regexLastTrailingSlash = /\/$|\/(?=\?)/;
  return url.replace(regexProtocolHostPort, '').replace(regexLastTrailingSlash, '');
};

const trimQueryString = (url) => {
  const regexQueryString = /\?.+$/;
  return url.replace(regexQueryString, '');
};

function initStore(
  hintText,
  connectingText,
  socket,
  storage,
  docViewer = false,
  onWidgetEvent,
) {
  const customMiddleWare = store => next => (action) => {
    const session_id = getLocalSession(storage, SESSION_NAME)
      ? getLocalSession(storage, SESSION_NAME).session_id
      : null;
    switch (action.type) {
      case actionTypes.EMIT_NEW_USER_MESSAGE: {
        socket.emit('user_uttered', {
          message: action.text,
          customData: socket.customData,
          session_id
        });
        break;
      }
      case actionTypes.EMIT_MESSAGE_IF_FIRST: {
        if (store.getState().messages.size === 0) {
          socket.emit('user_uttered', {
            message: action.payload,
            customData: socket.customData,
            session_id
          });
        }
        break;
      }
      case actionTypes.GET_OPEN_STATE: {
        return store.getState().behavior.get('isChatOpen');
      }
      case actionTypes.GET_VISIBLE_STATE: {
        return store.getState().behavior.get('isChatVisible');
      }
      case actionTypes.GET_FULLSCREEN_STATE: {
        return store.getState().behavior.get('fullScreenMode');
      }
      case actionTypes.EVAL_URL: {
        const pageCallbacks = store.getState().behavior.get('pageChangeCallbacks');
        const pageCallbacksJs = pageCallbacks ? pageCallbacks.toJS() : {};

        const newUrl = action.url;
        const emitMessage = (message) => {
          socket.emit('user_uttered', {
            message,
            customData: socket.customData,
            session_id
          });
        };

        if (!pageCallbacksJs.pageChanges) break;

        if (store.getState().behavior.get('oldUrl') !== newUrl) {
          const { pageChanges, errorIntent } = pageCallbacksJs;
          const matched = pageChanges.some((callback) => {
            if (callback.regex) {
              if (newUrl.match(callback.url)) {
                emitMessage(callback.callbackIntent);
                return true;
              }
            } else {
              let cleanCurrentUrl = cleanURL(newUrl);
              let cleanCallBackUrl = cleanURL(callback.url);
              if (!cleanCallBackUrl.match(/\?.+$/)) { // the callback does not have a querystring
                cleanCurrentUrl = trimQueryString(cleanCurrentUrl);
                cleanCallBackUrl = trimQueryString(cleanCallBackUrl);
              }
              if (cleanCurrentUrl === cleanCallBackUrl) {
                emitMessage(callback.callbackIntent);
                return true;
              }
              return false;
            }
          });
          if (!matched) emitMessage(errorIntent);
        }
        break;
      }
    }
    // console.log('Middleware triggered:', action);
    next(action);
  };
  const reducer = combineReducers({
    behavior: behavior(hintText, connectingText, storage, docViewer, onWidgetEvent),
    messages: messages(storage),
    metadata: metadata(storage)
  });


  // eslint-disable-next-line no-underscore-dangle
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  return createStore(
    reducer,
    composeEnhancer(applyMiddleware(customMiddleWare)),
  );
}


export { initStore };
