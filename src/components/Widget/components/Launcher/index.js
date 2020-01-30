import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
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
  tooltipMessage,
  linkTarget
}) => {
  const className = ['launcher'];
  if (isChatOpen) className.push('hide-sm');
  if (fullScreenMode) className.push(`full-screen${isChatOpen ? '  hide' : ''}`);

  const renderToolTip = () => (
    <div className="tooltip-body">
      <ReactMarkdown
        className={'markdown'}
        source={tooltipMessage}
        linkTarget={(url) => {
          if (!url.startsWith('mailto') && !url.startsWith('javascript')) return '_blank';
          return undefined;
        }}
        transformLinkUri={null}
        renderers={{
          // eslint-disable-next-line react/display-name
          link: props =>
            <a href={props.href} target={linkTarget || '_blank'} rel="noopener noreferrer">{props.children}</a>
        }}
      />

      <div className="tooltip-decoration" />
    </div>
  );

  const renderOpenLauncherImage = () => (
    <div className="open-launcher__container">
      {unreadCount > 0 && displayUnreadCount && (
        <div className="unread-count-pastille">{unreadCount}</div>
      )}
      <img src={openLauncherImage || openLauncher} className="open-launcher" alt="" />
      {tooltipMessage && renderToolTip()}
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
  tooltipMessage: PropTypes.string,
  linkTarget: PropTypes.string
};

const mapStateToProps = state => ({
  unreadCount: state.behavior.get('unreadCount') || 0,
  tooltipMessage: state.metadata.get('tooltipMessage'),
  linkTarget: state.metadata.get('linkTarget')
});

export default connect(mapStateToProps)(Launcher);
