import { createStore, combineReducers, applyMiddleware } from 'redux';

import behavior from './reducers/behaviorReducer';
import messages from './reducers/messagesReducer';

let store = 'call initStore first';

function initStore(hint, socket) {
  const customMiddleWare = (store) => next => (action) => {
    if (action.type === 'EMIT_NEW_USER_MESSAGE') { socket.emit('user_uttered', action.text); }
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
