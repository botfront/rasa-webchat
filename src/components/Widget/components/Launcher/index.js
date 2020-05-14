import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { usePopper } from 'react-popper';

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
  closeTooltip,
  lastUserMessage
}) => {
  const { mainColor, assistBackgoundColor } = useContext(ThemeContext);

  const [referenceElement, setReferenceElement] = useState(null);
  useEffect(() => {
    if (lastUserMessage && lastUserMessage.get('nextMessageIsTooltip')) {
      const reference = document.querySelector(lastUserMessage.get('nextMessageIsTooltip'));
      setReferenceElement(reference);
    } else {
      setReferenceElement(null);
    }
  }, [lastUserMessage]);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
    placement: 'right'
  });
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

  const renderTooltipContent = () => (
    <React.Fragment>
      <div className="rw-tooltip-close">
        <button
          onClick={(e) => {
            e.stopPropagation();
            closeTooltip();
          }}
        >
          <img src={closeIcon} alt="close" />
        </button>
      </div>
      <div className="rw-tooltip-response">{getComponentToRender(lastMessage)}</div>
    </React.Fragment>
  );

  const renderPlacedTooltip = () => (
    <div
      className="rw-tooltip-body"
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
    >
      {renderTooltipContent()}
      <div
        className="rw-tooltip-decoration rw-popper-arrow"
        ref={setArrowElement}
        style={styles.arrow}
      />
    </div>
  );

  const renderToolTip = () => (
    <div className="rw-tooltip-body" style={{ backgroundColor: assistBackgoundColor }}>
      {renderTooltipContent()}
      <div className="rw-tooltip-decoration" style={{ backgroundColor: assistBackgoundColor }} />
    </div>
  );

  const renderOpenLauncherImage = () => (
    <div className="rw-open-launcher__container">
      {unreadCount > 0 && displayUnreadCount && (
        <div className="rw-unread-count-pastille">{unreadCount}</div>
      )}
      <img src={openLauncherImage || openLauncher} className="rw-open-launcher" alt="" />
      {showTooltip &&
        lastMessage.get('sender') === 'response' &&
        (referenceElement ? renderPlacedTooltip() : renderToolTip())}
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
  lastMessage: ImmutablePropTypes.map,
  lastUserMessage: PropTypes.oneOfType([ImmutablePropTypes.map, PropTypes.bool])
};

const mapStateToProps = state => ({
  lastMessage: (state.messages && state.messages.get(-1)) || new Map(),
  unreadCount: state.behavior.get('unreadCount') || 0,
  showTooltip: state.metadata.get('showTooltip'),
  linkTarget: state.metadata.get('linkTarget'),
  lastUserMessage: (function getLastUserMessage() {
    if (!state.messages) return false;
    let index = -1;
    while (index > -10) {
      const lastMessage = state.messages.get(index);
      if (lastMessage) {
        if (lastMessage.get('sender') === 'client') return lastMessage;
      } else {
        return false;
      }
      index -= 1;
    }
    return false;
  }())
});

const mapDispatchToProps = dispatch => ({
  closeTooltip: () => dispatch(showTooltipAction(false))
});

export default connect(mapStateToProps, mapDispatchToProps)(Launcher);
