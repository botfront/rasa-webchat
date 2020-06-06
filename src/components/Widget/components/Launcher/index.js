import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { MESSAGES_TYPES } from 'constants';
import { Image, Message, Buttons } from 'messagesComponents';
import { showTooltip as showTooltipAction } from 'actions';
import openLauncher from 'assets/launcher_button.svg';
import closeIcon from 'assets/clear-button-grey.svg';
import close from 'assets/clear-button.svg';
import Badge from './components/Badge';

import './style.scss';
import ThemeContext from '../../ThemeContext';

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
  lastMessage,
  closeTooltip
}) => {
  const { mainColor, assistBackgoundColor } = useContext(ThemeContext);

  const className = ['rw-launcher'];
  if (isChatOpen) className.push('rw-hide-sm');
  if (fullScreenMode && isChatOpen) className.push('rw-full-screen rw-hide');


  const getComponentToRender = (message) => {
    const ComponentToRender = (() => {
      switch (message.get('type')) {
        case MESSAGES_TYPES.TEXT: {
          return Message;
        }
        case MESSAGES_TYPES.IMGREPLY.IMAGE: {
          return Image;
        }
        case MESSAGES_TYPES.BUTTONS: {
          return Buttons;
        }
        default:
          return null;
      }
    })();
    if (ComponentToRender) { return <ComponentToRender id={-1} params={{}} message={message} isLast />; }
    toggle(); // open the chat if the tooltip do not know how to display the compoment
  };


  const renderToolTip = () => (
    <div className="rw-tooltip-body" style={{ backgroundColor: assistBackgoundColor }}>
      <div className="rw-tooltip-close" >
        <button onClick={(e) => { e.stopPropagation(); closeTooltip(); }}>
          <img
            src={closeIcon}
            alt="close"
          />
        </button>
      </div>
      <div className="rw-tooltip-response">
        {getComponentToRender(lastMessage)}
      </div>
      <div className="rw-tooltip-decoration" style={{ backgroundColor: assistBackgoundColor }} />
    </div>
  );

  const renderOpenLauncherImage = () => (
    <div className="rw-open-launcher__container">
      {unreadCount > 0 && displayUnreadCount && (
        <div className="rw-unread-count-pastille">{unreadCount}</div>
      )}
      <img src={openLauncherImage || openLauncher} className="rw-open-launcher" alt="" />
      {showTooltip && lastMessage.get('sender') === 'response' && renderToolTip()}
    </div>
  );

  return (
    <button type="button" style={{ backgroundColor: mainColor }} className={className.join(' ')} onClick={toggle}>
      <Badge badge={badge} />
      {isChatOpen ? (
        <img
          src={closeImage || close}
          className={`rw-close-launcher ${closeImage ? '' : 'rw-default'}`}
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
  lastMessage: (state.messages && state.messages.get(-1)) || new Map(),
  unreadCount: state.behavior.get('unreadCount') || 0,
  showTooltip: state.metadata.get('showTooltip'),
  linkTarget: state.metadata.get('linkTarget')
});

const mapDispatchToProps = dispatch => ({
  closeTooltip: () => dispatch(showTooltipAction(false))
});

export default connect(mapStateToProps, mapDispatchToProps)(Launcher);
