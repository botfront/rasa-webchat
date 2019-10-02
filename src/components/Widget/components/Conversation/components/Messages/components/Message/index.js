import React, { PureComponent } from 'react';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { PROP_TYPES } from 'constants';
import DocViewer from '../docViewer';
import './styles.scss';

class Message extends PureComponent {
  render() {
    const { docViewer } = this.props;
    const sender = this.props.message.get('sender');
    const text = this.props.message.get('text');
    return (
      <div className={sender}>
        <div className="message-text">
          {sender === 'response' ? (
            <ReactMarkdown
              className={'markdown'}
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
                    <a href={props.href} target="_blank" rel="noopener noreferrer">{props.children}</a>
                  )
              }}
            />
          ) : (
            text
          )}
        </div>
      </div>
    );
  }
}

Message.propTypes = {
  message: PROP_TYPES.MESSAGE,
  docViewer: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  docViewer: state.behavior.get('docViewer')
});

export default connect(mapStateToProps)(Message);
