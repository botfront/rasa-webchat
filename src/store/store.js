import { createStore, combineReducers, applyMiddleware } from 'redux';

import { SESSION_NAME } from 'constants';

import behavior from './reducers/behaviorReducer';
import messages from './reducers/messagesReducer';
import { getLocalSession } from './reducers/helper';
import * as actionTypes from './actions/actionTypes';

let store = 'call initStore first';

function initStore(
  hintText,
  connectingText,
  socket,
  storage,
  docViewer = false
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
    }

    // console.log('Middleware triggered:', action);
    next(action);
  };
  const reducer = combineReducers({
    behavior: behavior(hintText, connectingText, storage, docViewer),
    messages: messages(storage)
  });

  /* eslint-disable no-underscore-dangle */
  store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(customMiddleWare)
  );
  /* eslint-enable */
}

export { initStore, store };
