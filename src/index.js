import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import Widget from './components/Widget';
import { initStore } from '../src/store/store';
import socket from './socket';

// eslint-disable-next-line import/no-mutable-exports
export let store = null;

const ConnectedWidget = forwardRef((props, ref) => {
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
      this.marker = Math.random();
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
      // We set a function on session_confirm here so as to avoid any race condition
      // this will be called first and will set those parameters for everyone to use.
      this.socket.on('session_confirm', (sessionObject) => {
        this.sessionConfirmed = true;
        this.sessionId = (sessionObject && sessionObject.session_id)
          ? sessionObject.session_id
          : sessionObject;
      });
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
  if (!store || sock.marker !== store.socketRef) {
    store = initStore(
      props.inputTextFieldHint,
      props.connectingText,
      sock,
      storage,
      props.docViewer,
      props.onWidgetEvent,
      props.storageKey
    );
    store.socketRef = sock.marker;
  }
  return (
    <Provider store={store}>
      <Widget
        ref={ref}
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
        storageKey={props.storageKey}
        openLauncherImage={props.openLauncherImage}
        closeImage={props.closeImage}
        customComponent={props.customComponent}
        displayUnreadCount={props.displayUnreadCount}
        socket={sock}
        showMessageDate={props.showMessageDate}
        customMessageDelay={props.customMessageDelay}
        tooltipPayload={props.tooltipPayload}
        tooltipDelay={props.tooltipDelay}
        disableTooltips={props.disableTooltips}
        defaultHighlightCss={props.defaultHighlightCss}
        defaultHighlightAnimation={props.defaultHighlightAnimation}
        defaultHighlightClassname={props.defaultHighlightClassname}
      />
    </Provider>
  );
});

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
  customMessageDelay: PropTypes.func,
  tooltipPayload: PropTypes.string,
  tooltipDelay: PropTypes.number,
  onWidgetEvent: PropTypes.shape({
    onChatOpen: PropTypes.func,
    onChatClose: PropTypes.func,
    onChatVisible: PropTypes.func,
    onChatHidden: PropTypes.func
  }),
  disableTooltips: PropTypes.bool,
  storageKey: PropTypes.string,
  defaultHighlightCss: PropTypes.string,
  defaultHighlightAnimation: PropTypes.string
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
  storageKey: 'chat_session',
  docViewer: false,
  showCloseButton: true,
  showFullScreenButton: false,
  displayUnreadCount: false,
  showMessageDate: false,
  customMessageDelay: (message) => {
    let delay = message.length * 30;
    if (delay > 3 * 1000) delay = 3 * 1000;
    if (delay < 800) delay = 800;
    return delay;
  },
  tooltipPayload: null,
  tooltipDelay: 500,
  onWidgetEvent: {
    onChatOpen: () => {},
    onChatClose: () => {},
    onChatVisible: () => {},
    onChatHidden: () => {}
  },
  disableTooltips: false
};

export default ConnectedWidget;
