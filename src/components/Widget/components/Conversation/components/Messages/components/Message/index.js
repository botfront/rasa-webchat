import React, { PureComponent } from 'react';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { PROP_TYPES } from 'constants';
import DocViewer from '../docViewer';
import './styles.scss';
import ThemeContext from '../../../../../../ThemeContext';
import reactStringReplace from 'react-string-replace';
class Message extends PureComponent {
  render() {
    const isAgentResponse = (message) => {
      const prefix = 'agent:';
      if (typeof message === 'object') return false;
      return message ? message.startsWith(prefix) : false;
    };

    const isImageServerURL = (message) => {
      const imageServerURLPrefix = "https://chatbot-imageserver";
      if(typeof message !== 'string') return false;
      return message.startsWith(imageServerURLPrefix)
    }

    const parsedText = (message) => {
      const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/ig;
      if(typeof message !== 'string') return message
      if(!urlRegex.test(message) && !isImageServerURL(message)) return message
      if(isImageServerURL(message)) return <img alt="uploadImage" src={message} className="rw-imageFrame" />

      return reactStringReplace(message, urlRegex, (match, i) => <a key={match + i} href={match} className="urlLink" style={{color:"rgb(255, 255, 255)",textDecoration:"underline"}} rel="noopener" target="_blank">{match}</a>)
    }

    const { docViewer, linkTarget } = this.props;
    const sender = this.props.message.get('sender');
    const text = isAgentResponse(this.props.message.get('text')) ? this.props.message.get('text').substring(6) : this.props.message.get('text');
    const customCss = this.props.message.get('customCss') && this.props.message.get('customCss').toJS();

    if (customCss && customCss.style === 'class') {
      customCss.css = customCss.css.replace(/^\./, '');
    }

    const { userTextColor, userBackgroundColor, assistTextColor, assistBackgoundColor } = this.context;
    let style;
    if (sender === 'response' && customCss && customCss.style === 'class') {
      style = undefined;
    } else if (sender === 'response' && customCss && customCss.style) {
      style = { cssText: customCss.css };
    } else if (sender === 'response') {
      style = { color: assistTextColor, backgroundColor: assistBackgoundColor };
    } else if (sender === 'client') {
      style = { color: userTextColor, backgroundColor: userBackgroundColor };
    }

    return (
      <div
        className={sender === 'response' && customCss && customCss.style === 'class' ?
          `rw-response ${customCss.css}` :
          `rw-${sender}`}
        style={style}
      >
        <div
          className="rw-message-text"
        >{sender === 'response' ? (
          <ReactMarkdown
            className={'rw-markdown'}
            source={text}
            linkTarget={(url) => {
              if (!url.startsWith('mailto') && !url.startsWith('javascript')) return '_blank';
              return undefined;
            }}
            transformLinkUri={null}
            renderers={{
              link: props =>
                docViewer ? (
                  <DocViewer src={props.href}>{props.children}</DocViewer>
                ) : (
                  <a href={props.href} target={linkTarget || '_blank'} rel="noopener noreferrer" onMouseUp={e => e.stopPropagation()}>{props.children}</a>
                )
            }}
          />
        ) : (
          parsedText(text)
        )}
        </div>
      </div>
    );
  }
}


Message.contextType = ThemeContext;
Message.propTypes = {
  message: PROP_TYPES.MESSAGE,
  docViewer: PropTypes.bool,
  linkTarget: PropTypes.string
};

Message.defaultTypes = {
  docViewer: false,
  linkTarget: '_blank'
};

const mapStateToProps = state => ({
  linkTarget: state.metadata.get('linkTarget'),
  docViewer: state.behavior.get('docViewer')
});

export default connect(mapStateToProps)(Message);
