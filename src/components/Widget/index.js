import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  toggleFullScreen,
  toggleChat,
  openChat,
  showChat,
  addUserMessage,
  emitUserMessage,
  addResponseMessage,
  addLinkSnippet,
  addVideoSnippet,
  addImageSnippet,
  addQuickReply,
  renderCustomComponent,
  initialize,
  connectServer,
  disconnectServer,
  pullSession,
  newUnreadMessage,
  triggerMessageDelayed
} from 'actions';

import { SESSION_NAME, NEXT_MESSAGE } from 'constants';
import { isSnippet, isVideo, isImage, isQR, isText } from './msgProcessor';
import WidgetLayout from './layout';
import { storeLocalSession, getLocalSession } from '../../store/reducers/helper';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.messages = [];
    this.onGoingMessageDelay = false;
  }

  componentDidMount() {
    const {
      connectOn,
      autoClearCache,
      storage,
      dispatch
    } = this.props;

    if (connectOn === 'mount') {
      this.initializeWidget();
      return;
    }

    const localSession = getLocalSession(storage, SESSION_NAME);
    const lastUpdate = localSession ? localSession.lastUpdate : 0;

    if (autoClearCache) {
      if ((Date.now() - lastUpdate) < (30 * 60 * 1000)) {
        this.initializeWidget();
      } else {
        localStorage.removeItem(SESSION_NAME);
      }
    } else {
      dispatch(pullSession());
      if (lastUpdate) this.initializeWidget();
    }
  }

  componentDidUpdate() {
    const {
      connectOn,
      isChatOpen,
      dispatch,
      embedded,
      initialized
    } = this.props;

    dispatch(pullSession());

    if (connectOn === 'mount') {
      this.trySendInitPayload();
    } else if (isChatOpen) {
      if (!initialized) {
        this.initializeWidget();
      }
      this.trySendInitPayload();
    }

    if (embedded && initialized) {
      dispatch(showChat());
      dispatch(openChat());
    }
  }

  componentWillUnmount() {
    const {
      socket
    } = this.props;

    if (socket) {
      socket.close();
    }
  }

  getSessionId() {
    const { storage } = this.props;
    // Get the local session, check if there is an existing session_id
    const localSession = getLocalSession(storage, SESSION_NAME);
    const localId = localSession ? localSession.session_id : null;
    return localId;
  }

  handleMessageReceived(message) {
    const { dispatch } = this.props;
    if (!this.onGoingMessageDelay) {
      this.onGoingMessageDelay = true;
      dispatch(triggerMessageDelayed(true));
      this.newMessageTimeout(message);
    } else {
      this.messages.push(message);
    }
  }

  popLastMessage() {
    const { dispatch } = this.props;
    if (this.messages.length) {
      this.onGoingMessageDelay = true;
      dispatch(triggerMessageDelayed(true));
      this.newMessageTimeout(this.messages.shift());
    }
  }

  newMessageTimeout(message) {
    const { dispatch, isChatOpen, customMessageDelay } = this.props;
    setTimeout(() => {
      this.dispatchMessage(message);
      if (!isChatOpen) {
        dispatch(newUnreadMessage());
      }
      dispatch(triggerMessageDelayed(false));
      this.onGoingMessageDelay = false;
      this.popLastMessage();
    }, customMessageDelay(message.text || ''));
  }

  initializeWidget() {
    const {
      storage,
      socket,
      dispatch,
      embedded,
      initialized
    } = this.props;

    if (!socket.isInitialized()) {
      socket.createSocket();

      socket.on('bot_uttered', (botUttered) => {
        const newMessage = { ...botUttered, text: String(botUttered.text) };
        this.handleMessageReceived(newMessage);
      });

      dispatch(pullSession());

      // Request a session from server
      const localId = this.getSessionId();
      socket.on('connect', () => {
        socket.emit('session_request', ({ session_id: localId }));
      });

      // When session_confirm is received from the server:
      socket.on('session_confirm', (remoteId) => {
        // eslint-disable-next-line no-console
        console.log(`session_confirm:${socket.socket.id} session_id:${remoteId}`);

        // Store the initial state to both the redux store and the storage, set connected to true
        dispatch(connectServer());

        /*
        Check if the session_id is consistent with the server
        If the localId is null or different from the remote_id,
        start a new session.
        */
        if (localId !== remoteId) {
          // storage.clear();
          // Store the received session_id to storage

          storeLocalSession(storage, SESSION_NAME, remoteId);
          dispatch(pullSession());
          this.trySendInitPayload();
        } else {
          // If this is an existing session, it's possible we changed pages and want to send a
          // user message when we land.
          const nextMessage = window.localStorage.getItem(NEXT_MESSAGE);

          if (nextMessage !== null) {
            const { message, expiry } = JSON.parse(nextMessage);
            window.localStorage.removeItem(NEXT_MESSAGE);

            if (expiry === 0 || expiry > Date.now()) {
              dispatch(addUserMessage(message));
              dispatch(emitUserMessage(message));
            }
          }
        }
      });

      socket.on('disconnect', (reason) => {
        // eslint-disable-next-line no-console
        console.log(reason);
        if (reason !== 'io client disconnect') {
          dispatch(disconnectServer());
        }
      });
    }

    if (embedded && initialized) {
      dispatch(showChat());
      dispatch(openChat());
    }
  }

  // TODO: Need to erase redux store on load if localStorage
  // is erased. Then behavior on reload can be consistent with
  // behavior on first load

  trySendInitPayload() {
    const {
      initPayload,
      customData,
      socket,
      initialized,
      isChatOpen,
      isChatVisible,
      embedded,
      connected,
      dispatch
    } = this.props;

    // Send initial payload when chat is opened or widget is shown
    if (!initialized && connected && (((isChatOpen && isChatVisible) || embedded))) {
      // Only send initial payload if the widget is connected to the server but not yet initialized

      const sessionId = this.getSessionId();

      // check that session_id is confirmed
      if (!sessionId) return;

      // eslint-disable-next-line no-console
      console.log('sending init payload', sessionId);
      socket.emit('user_uttered', { message: initPayload, customData, session_id: sessionId });
      dispatch(initialize());
    }
  }

  toggleConversation() {
    this.props.dispatch(toggleChat());
  }

  toggleFullScreen() {
    this.props.dispatch(toggleFullScreen());
  }

  dispatchMessage(message) {
    if (Object.keys(message).length === 0) {
      return;
    }

    if (isText(message)) {
      this.props.dispatch(addResponseMessage(message.text));
    } else if (isQR(message)) {
      this.props.dispatch(addQuickReply(message));
    } else if (isSnippet(message)) {
      const element = message.attachment.payload.elements[0];
      this.props.dispatch(addLinkSnippet({
        title: element.title,
        content: element.buttons[0].title,
        link: element.buttons[0].url,
        target: '_blank'
      }));
    } else if (isVideo(message)) {
      const element = message.attachment.payload;
      this.props.dispatch(addVideoSnippet({
        title: element.title,
        video: element.src
      }));
    } else if (isImage(message)) {
      const element = message.attachment.payload;
      this.props.dispatch(addImageSnippet({
        title: element.title,
        image: element.src
      }));
    } else {
      // some custom message
      const props = message;
      if (this.props.customComponent) {
        this.props.dispatch(renderCustomComponent(this.props.customComponent, props, true));
      }
    }
  }

  handleMessageSubmit(event) {
    event.preventDefault();
    const userUttered = event.target.message.value;
    if (userUttered) {
      this.props.dispatch(addUserMessage(userUttered));
      this.props.dispatch(emitUserMessage(userUttered));
    }
    event.target.message.value = '';
  }

  render() {
    return (
      <WidgetLayout
        toggleChat={() => this.toggleConversation()}
        toggleFullScreen={() => this.toggleFullScreen()}
        onSendMessage={event => this.handleMessageSubmit(event)}
        title={this.props.title}
        subtitle={this.props.subtitle}
        customData={this.props.customData}
        profileAvatar={this.props.profileAvatar}
        showCloseButton={this.props.showCloseButton}
        showFullScreenButton={this.props.showFullScreenButton}
        hideWhenNotConnected={this.props.hideWhenNotConnected}
        fullScreenMode={this.props.fullScreenMode}
        isChatOpen={this.props.isChatOpen}
        isChatVisible={this.props.isChatVisible}
        badge={this.props.badge}
        embedded={this.props.embedded}
        params={this.props.params}
        openLauncherImage={this.props.openLauncherImage}
        closeImage={this.props.closeImage}
        customComponent={this.props.customComponent}
        displayUnreadCount={this.props.displayUnreadCount}
        showMessageDate={this.props.showMessageDate}
      />
    );
  }
}

const mapStateToProps = state => ({
  initialized: state.behavior.get('initialized'),
  connected: state.behavior.get('connected'),
  isChatOpen: state.behavior.get('isChatOpen'),
  isChatVisible: state.behavior.get('isChatVisible'),
  fullScreenMode: state.behavior.get('fullScreenMode')
});

Widget.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  customData: PropTypes.shape({}),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  initPayload: PropTypes.string,
  profileAvatar: PropTypes.string,
  showCloseButton: PropTypes.bool,
  showFullScreenButton: PropTypes.bool,
  hideWhenNotConnected: PropTypes.bool,
  connectOn: PropTypes.oneOf(['mount', 'open']),
  autoClearCache: PropTypes.bool,
  fullScreenMode: PropTypes.bool,
  isChatVisible: PropTypes.bool,
  isChatOpen: PropTypes.bool,
  badge: PropTypes.number,
  socket: PropTypes.shape({}),
  embedded: PropTypes.bool,
  params: PropTypes.object,
  connected: PropTypes.bool,
  initialized: PropTypes.bool,
  openLauncherImage: PropTypes.string,
  closeImage: PropTypes.string,
  customComponent: PropTypes.func,
  displayUnreadCount: PropTypes.bool,
  showMessageDate: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  customMessageDelay: PropTypes.func.isRequired
};

Widget.defaultProps = {
  isChatOpen: false,
  isChatVisible: true,
  fullScreenMode: false,
  connectOn: 'mount',
  autoClearCache: false,
  displayUnreadCount: false
};

export default connect(mapStateToProps)(Widget);
