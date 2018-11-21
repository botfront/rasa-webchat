import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Conversation from './components/Conversation';
import Launcher from './components/Launcher';
import './style.scss';

const WidgetLayout = (props) => {
  const classes = props.embedded ? ['widget-embedded'] : ['widget-container'];
  if (props.fullScreenMode) {
    classes.push('full-screen');
  }
  const showCloseButton = props.showCloseButton !== undefined ? props.showCloseButton : (
    !props.fullScreenMode && !props.embedded
  );

  return (
    props.showWidget ? 
    <div className={classes.join(' ')}>
      {
        (props.fullScreenMode || props.showChat || props.embedded) &&
        <Conversation
          title={props.title}
          subtitle={props.subtitle}
          sendMessage={props.onSendMessage}
          profileAvatar={props.profileAvatar}
          toggleChat={props.onToggleConversation}
          showChat={props.showChat}
          disabledInput={props.disabledInput}
          params={props.params}
          {...{ showCloseButton }}
          connected={props.connected}
          connectingText={props.connectingText}
        />
      }
      {
        !props.fullScreenMode && !props.embedded &&
        <Launcher
          toggle={props.onToggleConversation}
          badge={props.badge}
        />
      }
    </div>
    : null
  );
};

WidgetLayout.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onSendMessage: PropTypes.func,
  onToggleConversation: PropTypes.func,
  showChat: PropTypes.bool,
  profileAvatar: PropTypes.string,
  showCloseButton: PropTypes.bool,
  disabledInput: PropTypes.bool,
  fullScreenMode: PropTypes.bool,
  badge: PropTypes.number,
  embedded: PropTypes.bool,
  params: PropTypes.object,
  connected: PropTypes.bool,
  connectingText: PropTypes.string,
};

export default connect(store => ({
  showWidget: store.behavior.get('showWidget'),
  showChat: store.behavior.get('showChat'),
  disabledInput: store.behavior.get('disabledInput'),
  connected: store.behavior.get('connected'),
  connectingText: store.behavior.get('connectingText')
}))(WidgetLayout);
