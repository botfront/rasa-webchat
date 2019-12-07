import React from 'react';
import ReactDOM from 'react-dom';
import { Widget, toggleChat, openChat, closeChat, showChat, hideChat, isOpen, isVisible } from './index_for_react_app';

const plugin = {
  init: (args) => {
    ReactDOM.render(
      <Widget
        protocol={args.protocol}
        socketUrl={args.socketUrl}
        socketPath={args.socketPath}
        protocolOptions={args.protocolOptions}
        initPayload={args.initPayload}
        title={args.title}
        subtitle={args.subtitle}
        customData={args.customData}
        inputTextFieldHint={args.inputTextFieldHint}
        connectingText={args.connectingText}
        profileAvatar={args.profileAvatar}
        showCloseButton={args.showCloseButton}
        showFullScreenButton={args.showFullScreenButton}
        hideWhenNotConnected={args.hideWhenNotConnected}
        autoClearCache={args.autoClearCache}
        connectOn={args.connectOn}
        onSocketEvent={args.onSocketEvent}
        fullScreenMode={args.fullScreenMode}
        badge={args.badge}
        params={args.params}
        embedded={args.embedded}
        openLauncherImage={args.openLauncherImage}
        closeImage={args.closeImage}
        docViewer={args.docViewer}
        displayUnreadCount={args.displayUnreadCount}
        showMessageDate={args.showMessageDate}
        linksOpenTab={args.linksOpenTab}
        customMessageDelay={args.customMessageDelay}
        tooltipPayload={args.tooltipPayload}
        tooltipDelay={args.tooltipDelay}
        linksOpenTab={args.linksOpenTab}
      />, document.querySelector(args.selector)
    );
  }
};

export {
  plugin as default,
  Widget,
  toggleChat as toggle,
  openChat as open,
  closeChat as close,
  showChat as show,
  hideChat as hide,
  isOpen,
  isVisible
};

