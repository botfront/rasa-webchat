import { createStore, combineReducers, applyMiddleware } from "redux";

import { SESSION_NAME } from 'constants';

import behavior from "./reducers/behaviorReducer";
import messages from "./reducers/messagesReducer";
import { getLocalSession } from './reducers/helper';
import * as actionTypes from './actions/actionTypes';

let store = "call initStore first";

function initStore(hint, initPayload, customData, socket) {

  const customMiddleWare = (store) => next => (action) => {
    switch (action.type) {
      case actionTypes.EMIT_NEW_USER_MESSAGE: {
        socket.emit("user_uttered", { message: action.text, customData: socket.customData, session_id: (getLocalSession(SESSION_NAME)? getLocalSession(SESSION_NAME).session_id: null) });
      }
      case actionTypes.GET_OPEN_STATE: {
        return store.getState().behavior.get("showChat");
      }
      case actionTypes.GET_VISIBLE_STATE: {
        return store.getState().behavior.get("showWidget");
      }
    }

    // console.log('Middleware triggered:', action);
    next(action);
  };
  const reducer = combineReducers({ 
    behavior: behavior(hint, initPayload, customData, socket), 
    messages: messages(socket) 
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
