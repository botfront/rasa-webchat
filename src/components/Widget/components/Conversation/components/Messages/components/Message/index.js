import React, { PureComponent } from 'react';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { PROP_TYPES } from 'constants';
import DocViewer from '../docViewer';
import './styles.scss';
import ThemeContext from '../../../../../../ThemeContext';

class Message extends PureComponent {
  render() {
    const { docViewer, linkTarget } = this.props;
    const sender = this.props.message.get('sender');
    let text = this.props.message.get('text');

    if (sender === 'response') {
      const re = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}\b/gi;
      text = text.replace(re, 'mailto:$&');
    }

    const customCss =
      this.props.message.get('customCss') && this.props.message.get('customCss').toJS();

    if (customCss && customCss.style === 'class') {
      customCss.css = customCss.css.replace(/^\./, '');
    }

    const {
      userTextColor,
      userBackgroundColor,
      assistTextColor,
      assistBackgoundColor
    } = this.context;
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
        className={
          sender === 'response' && customCss && customCss.style === 'class'
            ? `rw-response ${customCss.css}`
            : `rw-${sender}`
        }
        style={style}>
        <div className="rw-message-text">
          <ReactMarkdown
            className={'rw-markdown'}
            source={text}
            linkTarget={(url) => {
              if (!url.startsWith('mailto') && !url.startsWith('javascript')) {
                return '_blank';
              }
              return undefined;
            }}
            transformLinkUri={null}
            renderers={{
              link: (props) =>
                docViewer ? (
                  <DocViewer src={props.href}>{props.children}</DocViewer>
                ) : (
                  <a href={props.href} target={linkTarget || '_blank'} rel="noopener noreferrer">
                    {props.children}
                  </a>
                )
            }}
          />
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

const mapStateToProps = (state) => ({
  linkTarget: state.metadata.get('linkTarget'),
  docViewer: state.behavior.get('docViewer')
});

export default connect(mapStateToProps)(Message);
