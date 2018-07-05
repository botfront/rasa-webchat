import React, { PureComponent } from 'react';
import { PROP_TYPES } from 'constants';

import './styles.scss';

class VidReply extends PureComponent {
  render() {
    return (
      <div className="video">
        <b className="video-title">
          { this.props.message.get('title') }
        </b>
        <div className="video-details">
          <iframe src={this.props.message.get('video')} className="videoFrame"></iframe>
        </div>
      </div>
    );
  }
}

VidReply.propTypes = {
  message: PROP_TYPES.VIDREPLY
};

export default VidReply;
