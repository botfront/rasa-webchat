import React, { PureComponent } from 'react';
import { PROP_TYPES } from 'constants';

import './styles.scss';

class ImgReply extends PureComponent {
  render() {
    return (
      <div className="image">
        <b className="image-title">
          { this.props.message.get('title') }
        </b>
        <div className="image-details">
          <img src={this.props.message.get('image')} className="imageFrame" />
        </div>
      </div>
    );
  }
}

ImgReply.propTypes = {
  message: PROP_TYPES.IMGREPLY
};

export default ImgReply;
