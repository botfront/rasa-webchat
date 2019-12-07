import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import Widget from './components/Widget';
import { store, initStore } from '../src/store/store';
import socket from './socket';

const ConnectedWidget = (props) => {
  class Socket {
    constructor(
      url,
      customData,
      path,
      protocol,
      protocolOptions,
      onSocketEvent
    ) {
      this.url = url;
      this.customData = customData;
      this.path = path;
      this.protocol = protocol;
      this.protocolOptions = protocolOptions;
      this.onSocketEvent = onSocketEvent;
      this.socket = null;
      this.onEvents = [];
    }

    isInitialized() {
      return this.socket !== null && this.socket.connected;
    }

    on(event, callback) {
      if (!this.socket) {
        this.onEvents.push({ event, callback });
      } else {
        this.socket.on(event, callback);
      }
    }

    emit(message, data) {
      if (this.socket) {
        this.socket.emit(message, data);
      }
    }

    close() {
      if (this.socket) {
        this.socket.close();
      }
    }

    createSocket() {
      this.socket = socket(
        this.url,
        this.customData,
        this.path,
        this.protocol,
        this.protocolOptions
      );
      this.onEvents.forEach((event) => {
        this.socket.on(event.event, event.callback);
      });

      this.onEvents = [];
      Object.keys(this.onSocketEvent).forEach((event) => {
        this.socket.on(event, this.onSocketEvent[event]);
      });
    }
  }

  const sock = new Socket(
    props.socketUrl,
    props.customData,
    props.socketPath,
    props.protocol,
    props.protocolOptions,
    props.onSocketEvent
  );

  const storage =
    props.params.storage === 'session' ? sessionStorage : localStorage;
  initStore(
    props.inputTextFieldHint,
    props.connectingText,
    sock,
    storage,
    props.docViewer,
    props.connectOn
  );
  return (
    <Provider store={store}>
      <Widget
        initPayload={props.initPayload}
        title={props.title}
        subtitle={props.subtitle}
        customData={props.customData}
        handleNewUserMessage={props.handleNewUserMessage}
        profileAvatar={props.profileAvatar}
        showCloseButton={props.showCloseButton}
        showFullScreenButton={props.showFullScreenButton}
        hideWhenNotConnected={props.hideWhenNotConnected}
        connectOn={props.connectOn}
        autoClearCache={props.autoClearCache}
        fullScreenMode={props.fullScreenMode}
        badge={props.badge}
        embedded={props.embedded}
        params={props.params}
        storage={storage}
        openLauncherImage={props.openLauncherImage}
        closeImage={props.closeImage}
        customComponent={props.customComponent}
        displayUnreadCount={props.displayUnreadCount}
        socket={sock}
        showMessageDate={props.showMessageDate}
        linksOpenTab={props.linksOpenTab}
        customMessageDelay={props.customMessageDelay}
        tooltipPayload={props.tooltipPayload}
        tooltipDelay={props.tooltipDelay}
      />
    </Provider>
  );
};

ConnectedWidget.propTypes = {
  initPayload: PropTypes.string,
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
  connectOn: PropTypes.oneOf(['mount', 'open']),
  autoClearCache: PropTypes.bool,
  onSocketEvent: PropTypes.objectOf(PropTypes.func),
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
  showMessageDate: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  linksOpenTab: PropTypes.bool,
  customMessageDelay: PropTypes.func,
  tooltipPayload: PropTypes.string,
  tooltipDelay: PropTypes.number
};

ConnectedWidget.defaultProps = {
  title: 'Welcome',
  customData: {},
  inputTextFieldHint: 'Type a message...',
  connectingText: 'Waiting for server...',
  fullScreenMode: false,
  hideWhenNotConnected: true,
  autoClearCache: false,
  connectOn: 'mount',
  onSocketEvent: {},
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
  showMessageDate: false,
  linksOpenTab: false,
  customMessageDelay: (message) => {
    let delay = message.length * 30;
    if (delay > 2 * 1000) delay = 3 * 1000;
    if (delay < 400) delay = 1000;
    return delay;
  },
  tooltipPayload: null,
  tooltipDelay: 500
};

export default ConnectedWidget;
