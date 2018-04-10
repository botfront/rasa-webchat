import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import Widget from './components/Widget';
import { store, initStore } from '../src/store/store';


const ConnectedWidget = (props) => {
  initStore(props.inputTextFieldHint);
  return (<Provider store={store}>
    <Widget
      title={props.title}
      subtitle={props.subtitle}
      handleNewUserMessage={props.handleNewUserMessage}
      profileAvatar={props.profileAvatar}
      showCloseButton={props.showCloseButton}
      fullScreenMode={props.fullScreenMode}
      socketUrl={props.socketUrl}
      badge={props.badge}
    />
  </Provider>);
};

ConnectedWidget.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  socketUrl: PropTypes.string.isRequired,
  handleNewUserMessage: PropTypes.func.isRequired,
  profileAvatar: PropTypes.string,
  inputTextFieldHint: PropTypes.string,
  showCloseButton: PropTypes.bool,
  fullScreenMode: PropTypes.bool,
  badge: PropTypes.number
};

ConnectedWidget.defaultProps = {
  title: 'Welcome',
  subtitle: 'This is your chat subtitle',
  inputTextFieldHint: 'Type a message...',
  showCloseButton: true,
  fullScreenMode: false,
  socketUrl: 'http://localhost:5005',
  badge: 0
};

export default ConnectedWidget;
