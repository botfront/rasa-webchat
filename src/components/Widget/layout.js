import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Conversation from './components/Conversation';
import Launcher from './components/Launcher';
import './style.scss';

const WidgetLayout = (props) => {
  const classes = props.embedded ? ['rw-widget-embedded'] : ['rw-widget-container'];
  if (props.fullScreenMode) {
    classes.push('rw-full-screen');
  }
  const showCloseButton =
    props.showCloseButton !== undefined ? props.showCloseButton : !props.embedded;
  const isVisible = props.isChatVisible && !(props.hideWhenNotConnected && !props.connected);
  const chatShowing = props.isChatOpen || props.embedded;

  if (chatShowing && !props.embedded) {
    classes.push('rw-chat-open');
  }

  return isVisible ? (
    <div className={classes.join(' ')}>
      {chatShowing && (
        <Conversation
          title={props.title}
          subtitle={props.subtitle}
          sendMessage={props.onSendMessage}
          profileAvatar={props.profileAvatar}
          toggleChat={props.toggleChat}
          isChatOpen={props.isChatOpen}
          toggleFullScreen={props.toggleFullScreen}
          fullScreenMode={props.fullScreenMode}
          disabledInput={props.disabledInput}
          params={props.params}
          showFullScreenButton={props.showFullScreenButton}
          {...{ showCloseButton }}
          connected={props.connected}
          connectingText={props.connectingText}
          closeImage={props.closeImage}
          customComponent={props.customComponent}
          showMessageDate={props.showMessageDate}
          inputTextFieldHint={props.inputTextFieldHint}
        />
      )}
      {!props.embedded && (
        <Launcher
          toggle={props.toggleChat}
          isChatOpen={props.isChatOpen}
          badge={props.badge}
          fullScreenMode={props.fullScreenMode}
          openLauncherImage={props.openLauncherImage}
          closeImage={props.closeImage}
          displayUnreadCount={props.displayUnreadCount}
          tooltipPayload={props.tooltipPayload}
        />
      )}
    </div>
  ) : null;
};

const mapStateToProps = state => ({
  isChatVisible: state.behavior.get('isChatVisible'),
  isChatOpen: state.behavior.get('isChatOpen'),
  disabledInput: state.behavior.get('disabledInput'),
  connected: state.behavior.get('connected'),
  connectingText: state.behavior.get('connectingText')
});

WidgetLayout.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onSendMessage: PropTypes.func,
  toggleChat: PropTypes.func,
  toggleFullScreen: PropTypes.func,
  isChatOpen: PropTypes.bool,
  isChatVisible: PropTypes.bool,
  profileAvatar: PropTypes.string,
  showCloseButton: PropTypes.bool,
  showFullScreenButton: PropTypes.bool,
  hideWhenNotConnected: PropTypes.bool,
  disabledInput: PropTypes.bool,
  fullScreenMode: PropTypes.bool,
  badge: PropTypes.number,
  embedded: PropTypes.bool,
  inputTextFieldHint: PropTypes.string,
  params: PropTypes.object,
  connected: PropTypes.bool,
  connectingText: PropTypes.string,
  openLauncherImage: PropTypes.string,
  closeImage: PropTypes.string,
  customComponent: PropTypes.func,
  displayUnreadCount: PropTypes.bool,
  showMessageDate: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  tooltipPayload: PropTypes.string
};

export default connect(mapStateToProps)(WidgetLayout);
