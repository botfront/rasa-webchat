import React, { PureComponent } from 'react';
import { PROP_TYPES } from 'constants';

import './styles.scss';

class ImgReply extends PureComponent {
  render() {
    const message = this.props.message;
    const title = message.get('title');
    const image = message.get('image');
    const config = message.get('config');
    return (
      <div className="image">
        <b className="image-title">
          { title }
        </b>
        <div className="image-details">
          <img style={{ objectFit: "cover", width: config.dims.width, height: config.dims.height }} src={image} className="imageFrame" />
        </div>
      </div>
    );
  }
}

ImgReply.propTypes = {
  message: PROP_TYPES.IMGREPLY
};

export default ImgReply;
