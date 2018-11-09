import React, { PureComponent } from 'react';
import { PROP_TYPES } from 'constants';

import './styles.scss';

class ImgReply extends PureComponent {
  render() {
    const message = this.props.message;
    const title = message.get('title');
    const image = message.get('image');
    const params = message.get('params');
    return (
      <div className="image">
        <b className="image-title">
          { title }
        </b>
        <div className="image-details">
          <img className="imageFrame" style={{ objectFit: "cover", width: params.dims.width, height: params.dims.height }} src={image} />
        </div>
      </div>
    );
  }
}

ImgReply.propTypes = {
  message: PROP_TYPES.IMGREPLY
};

export default ImgReply;
