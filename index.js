import React from 'react';
import ReactDOM from 'react-dom';
import { Widget } from './index_for_react_app';


export default {

  init: (args) => {
    ReactDOM.render(
      <Widget
        socketUrl={args.socketUrl}
        interval={args.interval}
        initPayload={args.initPayload}
        title={args.title}
        subtitle={args.subtitle}
        inputTextFieldHint={args.inputTextFieldHint}
        profileAvatar={args.profileAvatar}
        showCloseButton={args.showCloseButton}
        fullScreenMode={args.fullScreenMode}
        badge={args.badge}
      />, document.querySelector(args.selector)

    );
  }
};
