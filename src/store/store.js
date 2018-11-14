import { createStore, combineReducers, applyMiddleware } from "redux";

import behavior from "./reducers/behaviorReducer";
import messages from "./reducers/messagesReducer";
import * as actionTypes from './actions/actionTypes';

let store = "call initStore first";

function initStore(hint, socket) {
  const customMiddleWare = (store) => next => (action) => {
    switch (action.type) {
      case actionTypes.EMIT_NEW_USER_MESSAGE: {
        socket.emit("user_uttered", { message: action.text, customData: socket.customData });
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
  const reducer = combineReducers({ behavior: behavior(hint), messages });

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
