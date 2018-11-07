import React, { PureComponent } from 'react';
import { PROP_TYPES } from 'constants';

import './styles.scss';

class ImgReply extends PureComponent {
  render() {
    const message = this.props.message;
    return (
      <div className="image">
        <b className="image-title">
          { message.get('title') }
        </b>
        <div className="image-details">
          <img style={{ objectFit: "cover", width: message.get('dims')[0], height: message.get('dims')[1] }} src={message.get('image')} className="imageFrame" />
        </div>
      </div>
    );
  }
}

ImgReply.propTypes = {
  message: PROP_TYPES.IMGREPLY
};

export default ImgReply;
