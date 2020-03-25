import React, { PureComponent } from 'react';
import { PROP_TYPES } from 'constants';

import './styles.scss';

class ImgReply extends PureComponent {
  render() {
    const { params: { images: { dims = {} } = {} } } = this.props;
    const { width, height } = dims;
    // Convert map to object
    const message = this.props.message.toJS();
    const { title, image } = message;
    const customCss = this.props.message.get('customCss') && this.props.message.get('customCss').toJS();

    if (customCss && customCss.style === 'class') {
      customCss.css = customCss.css.replace(/^\./, '');
    }

    return (

      <div
        className={customCss && customCss.style === 'class' ?
          `image ${customCss.css}` :
          'image'}
        style={{ cssText: customCss && customCss.style === 'custom' ?
          customCss.css :
          undefined }}
      >
        <b className="rw-image-title">
          { title }
        </b>
        <div className="rw-image-details" style={{ width, height }}>
          <img className="rw-image-frame" src={image} />
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
};

export default ImgReply;
