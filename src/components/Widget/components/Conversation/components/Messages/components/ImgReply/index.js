import React, { PureComponent } from 'react';
import { PROP_TYPES } from 'constants';

import './styles.scss';

class ImgReply extends PureComponent {
  render() {
    const { params: { images: { dims = {} } = {} } } = this.props;
    const { width, height } = dims;
    // Convert map to object
    const message = [...this.props.message.entries()].reduce( (acc, e) => ( 
      acc[e[0]] = e[1], 
      acc), {});
    const { title, image } = message;
    return (
      <div className="image">
        <b className="image-title">
          { title }
        </b>
        <div className="image-details" style={{ width, height }}>
          <img className="image-frame" src={image} />
        </div>
      </div>
    );
  }
}

ImgReply.propTypes = {
  message: PROP_TYPES.IMGREPLY
};

ImgReply.defaultProps = {
  params: {}
}

export default ImgReply;
