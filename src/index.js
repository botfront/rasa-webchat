import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import Widget from './components/Widget';
import { store, initStore } from '../src/store/store';
import socket from './socket';

const ConnectedWidget = (props) => {
  const sock = socket(props.socketUrl);
  initStore(props.inputTextFieldHint, sock);
  return (<Provider store={store}>
    <Widget
      socket={sock}
      initPayload={props.initPayload}
      title={props.title}
      subtitle={props.subtitle}
      handleNewUserMessage={props.handleNewUserMessage}
      profileAvatar={props.profileAvatar}
      showCloseButton={props.showCloseButton}
      fullScreenMode={props.fullScreenMode}
      badge={props.badge}
    />
  </Provider>);
};

ConnectedWidget.propTypes = {
  initPayload: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  socketUrl: PropTypes.string.isRequired,
  handleNewUserMessage: PropTypes.func.isRequired,
  profileAvatar: PropTypes.string,
  inputTextFieldHint: PropTypes.string,
  showCloseButton: PropTypes.bool,
  fullScreenMode: PropTypes.bool,
  badge: PropTypes.number
};

ConnectedWidget.defaultProps = {
  title: 'Welcome',
  inputTextFieldHint: 'Type a message...',
  showCloseButton: true,
  fullScreenMode: false,
  socketUrl: 'http://localhost:5005',
  badge: 0
};

export default ConnectedWidget;
