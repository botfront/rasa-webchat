import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { MESSAGES_TYPES } from 'constants';
import { Image, Message, QuickReply } from 'messagesComponents';
import openLauncher from 'assets/launcher_button.svg';
import close from 'assets/clear-button.svg';
import Badge from './components/Badge';

import './style.scss';

const Launcher = ({
  toggle,
  isChatOpen,
  badge,
  fullScreenMode,
  openLauncherImage,
  closeImage,
  unreadCount,
  displayUnreadCount,
  showTooltip,
  lastMessage
}) => {
  const className = ['launcher'];
  if (isChatOpen) className.push('hide-sm');
  if (fullScreenMode) className.push(`full-screen${isChatOpen ? '  hide' : ''}`);


  const getComponentToRender = (message) => {
    const ComponentToRender = (() => {
      switch (message.get('type')) {
        case MESSAGES_TYPES.TEXT: {
          return Message;
        }
        case MESSAGES_TYPES.IMGREPLY.IMAGE: {
          return Image;
        }
        case MESSAGES_TYPES.QUICK_REPLY: {
          return QuickReply;
        }
        default:
          return null;
      }
    })();
    return <ComponentToRender id={-1} params={{}} message={message} isLast />;
  };

  const renderToolTip = () => (
    <div className="tooltip-body">

      {getComponentToRender(lastMessage)}
      <div className="tooltip-decoration" />
    </div>
  );

  const renderOpenLauncherImage = () => (
    <div className="open-launcher__container">
      {unreadCount > 0 && displayUnreadCount && (
        <div className="unread-count-pastille">{unreadCount}</div>
      )}
      <img src={openLauncherImage || openLauncher} className="open-launcher" alt="" />
      {showTooltip && renderToolTip()}
    </div>
  );

  return (
    <button type="button" className={className.join(' ')} onClick={toggle}>
      <Badge badge={badge} />
      {isChatOpen ? (
        <img
          src={closeImage || close}
          className={`close-launcher ${closeImage ? '' : 'default'}`}
          alt=""
        />
      ) : (
        renderOpenLauncherImage()
      )}
    </button>
  );
};

Launcher.propTypes = {
  toggle: PropTypes.func,
  isChatOpen: PropTypes.bool,
  badge: PropTypes.number,
  fullScreenMode: PropTypes.bool,
  openLauncherImage: PropTypes.string,
  closeImage: PropTypes.string,
  unreadCount: PropTypes.number,
  displayUnreadCount: PropTypes.bool,
  showTooltip: PropTypes.bool,
  lastMessage: ImmutablePropTypes.map
};

const mapStateToProps = state => ({
  lastMessage: state.messages.get(-1) || new Map(),
  unreadCount: state.behavior.get('unreadCount') || 0,
  showTooltip: state.metadata.get('showTooltip'),
  linkTarget: state.metadata.get('linkTarget')
});

export default connect(mapStateToProps)(Launcher);
