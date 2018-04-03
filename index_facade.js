import React from 'react';
import ReactDOM from 'react-dom';
import { Widget } from './index';


export default {

  init: (args) => {
    ReactDOM.render(
      <Widget
        socketUrl={args.socketUrl}
      />, document.querySelector(args.selector)

    );
  }
};
