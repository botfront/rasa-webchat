import { createStore, combineReducers } from 'redux';

import behavior from './reducers/behaviorReducer';
import messages from './reducers/messagesReducer';

let store = 'call initStore first';

function initStore(hint) {
  const reducer = combineReducers({ behavior: behavior(hint), messages });

/* eslint-disable no-underscore-dangle */
  store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
  window.__REDUX_DEVTOOLS_EXTENSION__()
);
/* eslint-enable */
}

export { initStore, store };
