import React from 'react';
import ReactDOM from 'react-dom';
import { Widget } from './index';


export default {

  init: (args) => {
    ReactDOM.render(
      <Widget
        socketUrl={args.socketUrl}
        title={args.title}
        subtitle={args.subtitle}
        senderPlaceHolder={args.senderPlaceHolder}
        profileAvatar={args.profileAvatar}
        showCloseButton={args.showCloseButton}
        fullScreenMode={args.fullScreenMode}
        badge={args.badge}
      />, document.querySelector(args.selector)

    );
  }
};
