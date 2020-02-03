import { createStore, combineReducers, compose, applyMiddleware } from 'redux';

import { SESSION_NAME } from 'constants';

import behavior from './reducers/behaviorReducer';
import messages from './reducers/messagesReducer';
import metadata from './reducers/metadataReducer';

import { getLocalSession } from './reducers/helper';
import * as actionTypes from './actions/actionTypes';

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

        const payloadFormat = pl => (pl.match(/^\//) ? pl : `/${pl}`);

        if (!pageCallbacksJs.pageChanges) break;

        if (store.getState().behavior.get('oldUrl') !== newUrl) {
          const { pageChanges, errorIntent } = pageCallbacksJs;
          const matched = pageChanges.some((callback) => {
            if (callback.regex) {
              if (newUrl.match(callback.url)) {
                const payload = callback.callbackIntent;
                emitMessage(payloadFormat(callback.callbackIntent));
                return true;
              }
            } else if (newUrl === callback.url) {
              emitMessage(payloadFormat(callback.callbackIntent));
              return true;
            }
            return false;
          });
          if (!matched) emitMessage(payloadFormat(errorIntent));
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
