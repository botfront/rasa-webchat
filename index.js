import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import RasaWebchatPro from './src/pro-src/rules-wrapper';

import './src/pro-src/index.css';

class RasaWebchatProWithRules extends React.Component {
  constructor(props) {
    super(props);
    const { connectOn } = props;
    let { withRules } = props;
    if (connectOn === 'open' && withRules === true) {
      throw new Error(
        "You can't use rules and connect on open, you have to use connect on mount"
      );
    }
    this.webchatRef = null;
    if (withRules === undefined) {
      withRules = true;
    }
    this.state = {
      propsRetrieved: !withRules,
      rulesApplied: !withRules
    };
    this.setRef = this.setRef.bind(this);
    this.handleSessionConfirm = this.handleSessionConfirm.bind(this);
  }

  setRef(element) {
    const { innerRef } = this.props;
    if (!innerRef) {
      this.webchatRef = element;
    } else if (innerRef && innerRef.constructor && innerRef.call && innerRef.apply) {
      // if this is true, innerRef is a function and thus it's a callback ref
      this.webchatRef = element;
      innerRef(element);
    } else {
      innerRef.current = element;
    }
  }

  handleSessionConfirm(sessionObject) {
    const { innerRef } = this.props;
    this.setState({
      // The OR makes it work even without the augmented webchat channel
      propsRetrieved: { ...sessionObject.props }
    });
    if (
      ((innerRef && innerRef.current) || this.webchatRef.updateRules) &&
              sessionObject.props &&
              sessionObject.props.rules
    ) {
      setTimeout(() => {
        if (innerRef && innerRef.current) {
          innerRef.current.updateRules(sessionObject.props.rules);
        } else {
          this.webchatRef.updateRules(sessionObject.props.rules);
        }
      }, 100);
      this.setState({ rulesApplied: true });
    }
  }

  render() {
    const { onSocketEvent } = this.props;
    let { withRules } = this.props;
    if (withRules === undefined) {
      withRules = true;
    }
    const { propsRetrieved } = this.state;
    let propsToApply = {};
    if (propsRetrieved) propsToApply = propsRetrieved;
    delete propsToApply.rules;
    return (
      <div
        style={{ display: propsRetrieved ? undefined : 'none' }}
        className={this.props.embedded || (propsToApply && propsToApply.embedded) ? 'rw-pro-widget-embedded' : ''}
      >
        <RasaWebchatPro
          ref={this.setRef}
          {...{
            ...propsToApply,
            ...this.props
          }}
          onSocketEvent={
            withRules
              ? {
                session_confirm: this.handleSessionConfirm,
                ...onSocketEvent
              }
              : { ...onSocketEvent }
          }
        />
      </div>
    );
  }
}

export const rasaWebchatProTypes = {
  initPayload: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  protocol: PropTypes.string,
  socketUrl: PropTypes.string.isRequired,
  socketPath: PropTypes.string,
  protocolOptions: PropTypes.shape({}),
  customData: PropTypes.shape({}),
  handleNewUserMessage: PropTypes.func,
  profileAvatar: PropTypes.string,
  inputTextFieldHint: PropTypes.string,
  connectingText: PropTypes.string,
  showCloseButton: PropTypes.bool,
  showFullScreenButton: PropTypes.bool,
  hideWhenNotConnected: PropTypes.bool,
  connectOn: PropTypes.oneOf(['mount', 'open']),
  autoClearCache: PropTypes.bool,
  onSocketEvent: PropTypes.objectOf(PropTypes.func),
  fullScreenMode: PropTypes.bool,
  badge: PropTypes.number,
  embedded: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  params: PropTypes.object,
  openLauncherImage: PropTypes.string,
  closeImage: PropTypes.string,
  docViewer: PropTypes.bool,
  customComponent: PropTypes.func,
  displayUnreadCount: PropTypes.bool,
  showMessageDate: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  customMessageDelay: PropTypes.func,
  tooltipPayload: PropTypes.string,
  tooltipDelay: PropTypes.number,
  withRules: PropTypes.bool,
  rules: PropTypes.arrayOf(
    PropTypes.shape({
      payload: PropTypes.string.isRequired,
      text: PropTypes.string,
      trigger: PropTypes.shape({
        url: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
        timeOnPage: PropTypes.number,
        numberOfVisits: PropTypes.number,
        numberOfPageVisits: PropTypes.number,
        device: PropTypes.string,
        when: PropTypes.oneOf(['always', 'init']),
        queryString: PropTypes.arrayOf(
          PropTypes.shape({
            param: PropTypes.string,
            value: PropTypes.string,
            sendAsEntity: PropTypes.bool
          })
        ),
        eventListeners: PropTypes.arrayOf(
          PropTypes.shape({
            selector: PropTypes.string.isRequired,
            event: PropTypes.string.isRequired
          })
        )
      })
    })
  ),
  triggerEventListenerUpdateRate: PropTypes.number
};

RasaWebchatProWithRules.propTypes = {
  ...rasaWebchatProTypes,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.object })])
};

export const rasaWebchatProDefaultTypes = {
  title: 'Welcome',
  customData: {},
  inputTextFieldHint: 'Type a message...',
  connectingText: 'Waiting for server...',
  fullScreenMode: false,
  hideWhenNotConnected: true,
  autoClearCache: false,
  connectOn: 'mount',
  onSocketEvent: {},
  protocol: 'socketio',
  socketUrl: 'http://localhost',
  protocolOptions: {},
  badge: 0,
  embedded: false,
  params: {
    storage: 'local'
  },
  docViewer: false,
  showCloseButton: true,
  showFullScreenButton: false,
  displayUnreadCount: false,
  showMessageDate: false,
  customMessageDelay: (message) => {
    let delay = message.length * 30;
    if (delay > 3 * 1000) delay = 3 * 1000;
    if (delay < 800) delay = 800;
    return delay;
  },
  tooltipPayload: null,
  tooltipDelay: 500,
  withRules: true,
  rules: null,
  triggerEventListenerUpdateRate: 500
};

export default React.forwardRef((props, ref) => (
  <RasaWebchatProWithRules innerRef={ref} {...props} />
));

export const selfMount = (props, element = null) => {
  const load = () => {
    if (element === null) {
      const node = document.createElement('div');
      node.setAttribute('id', 'rasaWebchatPro');
      document.body.appendChild(node);
    }
    const mountElement = element || document.getElementById('rasaWebchatPro')
    const webchatPro = React.createElement(RasaWebchatProWithRules, props);
    ReactDOM.render(webchatPro, mountElement);
  };
  if (document.readyState === 'complete') {
    load();
  } else {
    window.addEventListener('load', () => {
      load();
    });
  }
};
