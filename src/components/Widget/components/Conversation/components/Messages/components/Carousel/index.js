import React from 'react';
import { PROP_TYPES } from 'constants';

import './styles.scss';

const Carousel = (props) => {
  const carousel = props.message.toJS();
  return (
    <div className="rw-carousel-container">
      {carousel.elements.map((carouselCard, index) => (
        <div className="rw-carousel-card" key={index}>
          <img
            className="rw-carousel-card-image"
            src={carouselCard.image_url}
            alt={`${carouselCard.title} ${carouselCard.subtitle}}}`}
          />
          <span className="rw-carousel-card-title">{carouselCard.title}</span>
          <span className="rw-carousel-card-subtitle">{carouselCard.subtitle}</span>
          <div className="rw-carousel-buttons-container">
            {carouselCard.buttons.map((button, buttonIndex) => (
              <div key={buttonIndex} className="rw-reply">{button.title}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

Carousel.propTypes = {
  message: PROP_TYPES.CAROUSEL
};

export default Carousel;
