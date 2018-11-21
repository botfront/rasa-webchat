import React from 'react';
import ReactDOM from 'react-dom';
import { Widget, toggleWidget, openWidget, closeWidget, showWidget, hideWidget, isOpen, isVisible } from './index_for_react_app';

const plugin = {
  init: (args) => {

    ReactDOM.render(
      <Widget
        socketUrl={args.socketUrl}
        socketPath={args.socketPath}
        interval={args.interval}
        initPayload={args.initPayload}
        title={args.title}
        subtitle={args.subtitle}
        customData={args.customData}
        inputTextFieldHint={args.inputTextFieldHint}
        connectingText={args.connectingText}
        profileAvatar={args.profileAvatar}
        showCloseButton={args.showCloseButton}
        fullScreenMode={args.fullScreenMode}
        badge={args.badge}
        params={args.params}
      />, document.querySelector(args.selector)
    );
  }
};

export {
  plugin as default,
  Widget,
  toggleWidget as toggle,
  openWidget as open,
  closeWidget as close,
  showWidget as show,
  hideWidget as hide,
  isOpen, 
  isVisible
};

