import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import Widget from './components/Widget';
import { store, initStore } from '../src/store/store';
import socket from './socket';

const ConnectedWidget = (props) => {
  const sock = socket(
    props.socketUrl,
    props.customData,
    props.socketPath,
    props.protocol,
    props.protocolOptions
  );
  const storage = props.params.storage === 'session' ? sessionStorage : localStorage;
  initStore(
    props.inputTextFieldHint,
    props.connectingText,
    sock,
    storage,
    props.docViewer,
  );
  return (<Provider store={store}>
    <Widget
      socket={sock}
      interval={props.interval}
      initPayload={props.initPayload}
      title={props.title}
      subtitle={props.subtitle}
      customData={props.customData}
      handleNewUserMessage={props.handleNewUserMessage}
      profileAvatar={props.profileAvatar}
      showCloseButton={props.showCloseButton}
      showFullScreenButton={props.showFullScreenButton}
      hideWhenNotConnected={props.hideWhenNotConnected}
      fullScreenMode={props.fullScreenMode}
      badge={props.badge}
      embedded={props.embedded}
      params={props.params}
      storage={storage}
      openLauncherImage={props.openLauncherImage}
      closeImage={props.closeImage}
      customComponent={props.customComponent}
      displayUnreadCount={props.displayUnreadCount}
      showMessageDate={props.showMessageDate}
    />
  </Provider>);
};

ConnectedWidget.propTypes = {
  initPayload: PropTypes.string,
  interval: PropTypes.number,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  protocol: PropTypes.string,
  socketUrl: PropTypes.string.isRequired,
  socketPath: PropTypes.string,
  protocolOptions: PropTypes.shape({}),
  customData: PropTypes.shape({}),
  handleNewUserMessage: PropTypes.func,
  profileAvatar: PropTypes.string,
  inputTextFieldHint: PropTypes.string,
  connectingText: PropTypes.string,
  showCloseButton: PropTypes.bool,
  showFullScreenButton: PropTypes.bool,
  hideWhenNotConnected: PropTypes.bool,
  fullScreenMode: PropTypes.bool,
  badge: PropTypes.number,
  embedded: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  params: PropTypes.object,
  openLauncherImage: PropTypes.string,
  closeImage: PropTypes.string,
  docViewer: PropTypes.bool,
  customComponent: PropTypes.func,
  displayUnreadCount: PropTypes.bool,
  showMessageDate: PropTypes.oneOfType([PropTypes.bool, PropTypes.func])
};

ConnectedWidget.defaultProps = {
  title: 'Welcome',
  customData: {},
  interval: 2000,
  inputTextFieldHint: 'Type a message...',
  connectingText: 'Waiting for server...',
  fullScreenMode: false,
  hideWhenNotConnected: true,
  protocol: 'socketio',
  socketUrl: 'http://localhost',
  protocolOptions: {},
  badge: 0,
  embedded: false,
  params: {
    storage: 'local'
  },
  docViewer: false,
  showCloseButton: true,
  showFullScreenButton: false,
  displayUnreadCount: false,
  showMessageDate: false
};

export default ConnectedWidget;
