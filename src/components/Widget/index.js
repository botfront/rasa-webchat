import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  toggleFullScreen,
  toggleChat,
  openChat,
  closeChat,
  showChat,
  addUserMessage,
  emitUserMessage,
  addResponseMessage,
  addCarousel,
  addVideoSnippet,
  addImageSnippet,
  addQuickReply,
  renderCustomComponent,
  initialize,
  connectServer,
  disconnectServer,
  pullSession,
  newUnreadMessage,
  triggerMessageDelayed,
  triggerTooltipSent,
  showTooltip,
  emitMessageIfFirst,
  clearMetadata,
  setUserInput,
  setLinkTarget,
  setPageChangeCallbacks,
  changeOldUrl,
  setDomHighlight,
  evalUrl,
  setCustomCss
} from 'actions';

import { SESSION_NAME, NEXT_MESSAGE } from 'constants';
import { isVideo, isImage, isQR, isText, isCarousel } from './msgProcessor';
import WidgetLayout from './layout';
import { storeLocalSession, getLocalSession } from '../../store/reducers/helper';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.messages = [];
    this.delayedMessage = null;
    this.messageDelayTimeout = null;
    this.onGoingMessageDelay = false;
    this.sendMessage = this.sendMessage.bind(this);
    this.intervalId = null;
    this.eventListenerCleaner = () => { };
  }


  componentDidMount() {
    const { connectOn, autoClearCache, storage, dispatch, defaultHighlightAnimation } = this.props;

    // add the default highlight css to the document
    const styleNode = document.createElement('style');
    styleNode.innerHTML = defaultHighlightAnimation;
    document.body.appendChild(styleNode);

    this.intervalId = setInterval(() => dispatch(evalUrl(window.location.href)), 500);
    if (connectOn === 'mount') {
      this.initializeWidget();
      return;
    }


    const localSession = getLocalSession(storage, SESSION_NAME);
    const lastUpdate = localSession ? localSession.lastUpdate : 0;

    if (autoClearCache) {
      if (Date.now() - lastUpdate < 30 * 60 * 1000) {
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
    const { isChatOpen, dispatch, embedded, initialized } = this.props;

    if (isChatOpen) {
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
    const { socket } = this.props;

    if (socket) {
      socket.close();
    }
    clearTimeout(this.tooltipTimeout);
    clearInterval(this.intervalId);
  }

  getSessionId() {
    const { storage } = this.props;
    // Get the local session, check if there is an existing session_id
    const localSession = getLocalSession(storage, SESSION_NAME);
    const localId = localSession ? localSession.session_id : null;
    return localId;
  }

  sendMessage(payload, text = '', when = 'always') {
    const { dispatch, initialized } = this.props;
    const emit = () => {
      if (when === 'always') {
        dispatch(emitUserMessage(payload));
        if (text !== '') dispatch(addUserMessage(text));
      } else if (when === 'init') {
        dispatch(emitMessageIfFirst(payload, text));
      }
    };
    if (!initialized) {
      this.initializeWidget(false);
      dispatch(initialize());
      emit();
    } else {
      emit();
    }
  }

  handleMessageReceived(messageWithMetadata) {
    const { dispatch, isChatOpen, disableTooltips } = this.props;
    // we extract metadata so we are sure it does not interfer with type checking of the message
    const { metadata, ...message } = messageWithMetadata;
    if (!isChatOpen) {
      this.dispatchMessage(message);
      dispatch(newUnreadMessage());
      if (!disableTooltips) {
        dispatch(showTooltip(true));
        this.applyCustomStyle();
      }
    } else if (!this.onGoingMessageDelay) {
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
    const { dispatch, customMessageDelay } = this.props;
    this.delayedMessage = message;
    this.messageDelayTimeout = setTimeout(() => {
      this.dispatchMessage(message);
      this.delayedMessage = null;
      this.applyCustomStyle();
      dispatch(triggerMessageDelayed(false));
      this.onGoingMessageDelay = false;
      this.popLastMessage();
    }, customMessageDelay(message.text || ''));
  }

  propagateMetadata(metadata) {
    const {
      dispatch
    } = this.props;
    const { linkTarget,
      userInput,
      pageChangeCallbacks,
      domHighlight,
      forceOpen,
      forceClose,
      pageEventCallbacks
    } = metadata;
    if (linkTarget) {
      dispatch(setLinkTarget(linkTarget));
    }
    if (userInput) {
      dispatch(setUserInput(userInput));
    }
    if (pageChangeCallbacks) {
      dispatch(changeOldUrl(window.location.href));
      dispatch(setPageChangeCallbacks(pageChangeCallbacks));
    }
    if (domHighlight) {
      dispatch(setDomHighlight(domHighlight));
    }
    if (forceOpen) {
      dispatch(openChat());
    }
    if (forceClose) {
      dispatch(closeChat());
    }
    if (pageEventCallbacks) {
      this.eventListenerCleaner = this.addCustomsEventListeners(pageEventCallbacks.pageEvents);
    }
  }

  handleBotUtterance(botUtterance) {
    const { dispatch } = this.props;
    this.clearCustomStyle();
    this.eventListenerCleaner();
    dispatch(clearMetadata());
    if (botUtterance.metadata) this.propagateMetadata(botUtterance.metadata);
    const newMessage = { ...botUtterance, text: String(botUtterance.text) };
    if (botUtterance.metadata && botUtterance.metadata.customCss) {
      newMessage.customCss = botUtterance.metadata.customCss;
    }
    this.handleMessageReceived(newMessage);
  }

  addCustomsEventListeners(pageEventCallbacks) {
    const eventsListeners = [];

    pageEventCallbacks.forEach((pageEvent) => {
      const { event, payload, selector } = pageEvent;
      const sendPayload = () => {
        this.sendMessage(payload);
      };

      if (event && payload && selector) {
        const elemList = document.querySelectorAll(selector);
        if (elemList.length > 0) {
          elemList.forEach((elem) => {
            eventsListeners.push({ elem, event, sendPayload });
            elem.addEventListener(event, sendPayload);
          });
        }
      }
    });

    const cleaner = () => {
      eventsListeners.forEach((eventsListener) => {
        eventsListener.elem.removeEventListener(eventsListener.event, eventsListener.sendPayload);
      });
    };

    return cleaner;
  }

  clearCustomStyle() {
    const { domHighlight, defaultHighlightClassname } = this.props;
    const domHighlightJS = domHighlight.toJS() || {};
    if (domHighlightJS.selector) {
      const elements = document.querySelectorAll(domHighlightJS.selector);
      elements.forEach((element) => {
        switch (domHighlightJS.style) {
          case 'custom':
            element.setAttribute('style', '');
            break;
          case 'class':
            element.classList.remove(domHighlightJS.css);
            break;
          default:
            if (defaultHighlightClassname !== '') {
              element.classList.remove(defaultHighlightClassname);
            } else {
              element.setAttribute('style', '');
            }
        }
      });
    }
  }

  applyCustomStyle() {
    const { domHighlight, defaultHighlightCss, defaultHighlightClassname } = this.props;
    const domHighlightJS = domHighlight.toJS() || {};
    if (domHighlightJS.selector) {
      const elements = document.querySelectorAll(domHighlightJS.selector);
      elements.forEach((element) => {
        switch (domHighlightJS.style) {
          case 'custom':
            element.setAttribute('style', domHighlightJS.css);
            break;
          case 'class':
            element.classList.add(domHighlightJS.css);
            break;
          default:
            if (defaultHighlightClassname !== '') {
              element.classList.add(defaultHighlightClassname);
            } else {
              element.setAttribute('style', defaultHighlightCss);
            }
        }
      });
      // We check that the method is here to prevent crashes on unsupported browsers.
      if (elements[0] && elements[0].scrollIntoView) {
        // If I don't use a timeout, the scrollToBottom in messages.jsx
        // seems to override that scrolling
        setTimeout(() => {
          if (/Mobi/.test(navigator.userAgent)) {
            elements[0].scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
          } else {
            const rectangle = elements[0].getBoundingClientRect();

            const ElemIsInViewPort = (
              rectangle.top >= 0 &&
                rectangle.left >= 0 &&
                rectangle.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rectangle.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
            if (!ElemIsInViewPort) {
              elements[0].scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
            }
          }
        }, 50);
      }
    }
  }

  initializeWidget(sendInitPayload = true) {
    const {
      storage,
      socket,
      dispatch,
      embedded,
      initialized,
      connectOn,
      tooltipPayload,
      tooltipDelay
    } = this.props;
    if (!socket.isInitialized()) {
      socket.createSocket();

      socket.on('bot_uttered', (botUttered) => {
        // botUttered.attachment.payload.elements = [botUttered.attachment.payload.elements];
        // console.log(botUttered);
        this.handleBotUtterance(botUttered);
      });

      dispatch(pullSession());

      // Request a session from server
      const localId = this.getSessionId();
      socket.on('connect', () => {
        socket.emit('session_request', { session_id: localId });
      });

      // When session_confirm is received from the server:
      socket.on('session_confirm', (sessionObject) => {
        const remoteId = (sessionObject && sessionObject.session_id)
          ? sessionObject.session_id
          : sessionObject;

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
          if (sendInitPayload) {
            this.trySendInitPayload();
          }
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
        } if (connectOn === 'mount' && tooltipPayload) {
          this.tooltipTimeout = setTimeout(() => {
            this.trySendTooltipPayload();
          }, parseInt(tooltipDelay, 10));
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
    if (!initialized && connected && ((isChatOpen && isChatVisible) || embedded)) {
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

  trySendTooltipPayload() {
    const {
      tooltipPayload,
      socket,
      customData,
      connected,
      isChatOpen,
      dispatch,
      tooltipSent
    } = this.props;

    if (connected && !isChatOpen && !tooltipSent.get(tooltipPayload)) {
      const sessionId = this.getSessionId();

      if (!sessionId) return;

      socket.emit('user_uttered', { message: tooltipPayload, customData, session_id: sessionId });

      dispatch(triggerTooltipSent(tooltipPayload));
      dispatch(initialize());
    }
  }

  toggleConversation() {
    const {
      isChatOpen,
      dispatch,
      disableTooltips
    } = this.props;
    if (isChatOpen && this.delayedMessage) {
      if (!disableTooltips) dispatch(showTooltip(true));
      clearTimeout(this.messageDelayTimeout);
      this.dispatchMessage(this.delayedMessage);
      dispatch(newUnreadMessage());
      this.onGoingMessageDelay = false;
      dispatch(triggerMessageDelayed(false));
      this.messages.forEach((message) => {
        this.dispatchMessage(message);
        dispatch(newUnreadMessage());
      });
      this.applyCustomStyle();

      this.messages = [];
      this.delayedMessage = null;
    } else {
      this.props.dispatch(showTooltip(false));
    }
    clearTimeout(this.tooltipTimeout);
    dispatch(toggleChat());
  }

  toggleFullScreen() {
    this.props.dispatch(toggleFullScreen());
  }

  dispatchMessage(message) {
    if (Object.keys(message).length === 0) {
      return;
    }
    const { customCss, ...messageClean } = message;

    if (isText(messageClean)) {
      this.props.dispatch(addResponseMessage(messageClean.text));
    } else if (isQR(messageClean)) {
      this.props.dispatch(addQuickReply(messageClean));
    } else if (isCarousel(messageClean)) {
      this.props.dispatch(
        addCarousel(messageClean)
      );
    } else if (isVideo(messageClean)) {
      const element = messageClean.attachment.payload;
      this.props.dispatch(
        addVideoSnippet({
          title: element.title,
          video: element.src
        })
      );
    } else if (isImage(messageClean)) {
      const element = messageClean.attachment.payload;
      this.props.dispatch(
        addImageSnippet({
          title: element.title,
          image: element.src
        })
      );
    } else {
      // some custom message
      const props = messageClean;
      if (this.props.customComponent) {
        this.props.dispatch(renderCustomComponent(this.props.customComponent, props, true));
      }
    }
    if (customCss) {
      this.props.dispatch(setCustomCss(message.customCss));
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
        tooltipPayload={this.props.tooltipPayload}
      />
    );
  }
}

const mapStateToProps = state => ({
  initialized: state.behavior.get('initialized'),
  connected: state.behavior.get('connected'),
  isChatOpen: state.behavior.get('isChatOpen'),
  isChatVisible: state.behavior.get('isChatVisible'),
  fullScreenMode: state.behavior.get('fullScreenMode'),
  tooltipSent: state.metadata.get('tooltipSent'),
  oldUrl: state.behavior.get('oldUrl'),
  pageChangeCallbacks: state.behavior.get('pageChangeCallbacks'),
  domHighlight: state.metadata.get('domHighlight')
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
  params: PropTypes.shape({}),
  connected: PropTypes.bool,
  initialized: PropTypes.bool,
  openLauncherImage: PropTypes.string,
  closeImage: PropTypes.string,
  customComponent: PropTypes.func,
  displayUnreadCount: PropTypes.bool,
  showMessageDate: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  customMessageDelay: PropTypes.func.isRequired,
  tooltipPayload: PropTypes.string,
  tooltipSent: PropTypes.shape({}),
  tooltipDelay: PropTypes.number.isRequired,
  domHighlight: PropTypes.shape({}),
  storage: PropTypes.shape({}),
  disableTooltips: PropTypes.bool,
  defaultHighlightAnimation: PropTypes.string,
  defaultHighlightCss: PropTypes.string,
  defaultHighlightClassname: PropTypes.string
};

Widget.defaultProps = {
  isChatOpen: false,
  isChatVisible: true,
  fullScreenMode: false,
  connectOn: 'mount',
  autoClearCache: false,
  displayUnreadCount: false,
  tooltipPayload: null,
  oldUrl: '',
  disableTooltips: false,
  defaultHighlightClassname: '',
  defaultHighlightCss: 'animation: 0.5s linear infinite alternate default-botfront-blinker-animation; outline-style: solid;',
  // unfortunately it looks like outline-style is not an animatable property on Safari
  defaultHighlightAnimation: `@keyframes default-botfront-blinker-animation {
    0% {
      outline-color: rgba(0,255,0,0);
    }
    49% {
      outline-color: rgba(0,255,0,0);
    }
    50% {
      outline-color:green;
    }
    100% {
      outline-color: green;
    }
  }`
};

export default connect(mapStateToProps, null, null, { forwardRef: true })(Widget);
