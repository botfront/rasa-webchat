import React from 'react';
import ReactDOM from 'react-dom';
import { Widget, toggleWidget, openWidget, closeWidget } from './index_for_react_app';

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
  toggleWidget,
  openWidget,
  closeWidget
};

