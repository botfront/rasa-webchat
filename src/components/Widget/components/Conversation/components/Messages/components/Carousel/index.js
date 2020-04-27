import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import { addUserMessage, emitUserMessage } from 'actions';
import { PROP_TYPES } from 'constants';

import './styles.scss';

const Carousel = (props) => {
  const carousel = props.message.toJS();

  const handleClick = (action) => {
    const { chooseReply } = props;
    chooseReply(action.payload, action.title);
  };

  return (
    <div className="rw-carousel-container">
      {carousel.elements.map((carouselCard, index) => (
        <div className="rw-carousel-card" key={index}>
          {carouselCard.image_url ? (
            <img
              className="rw-carousel-card-image"
              src={carouselCard.image_url}
              alt={`${carouselCard.title} ${carouselCard.subtitle}}}`}
            />
          ) : (
            <div className="rw-carousel-card-image" />
          )}
          <span className="rw-carousel-card-title">{carouselCard.title}</span>
          <span className="rw-carousel-card-subtitle">{carouselCard.subtitle}</span>
          <div className="rw-carousel-buttons-container">
            {carouselCard.buttons.map((button, buttonIndex) => {
              if (button.type === 'web_url') {
                return (
                  <a
                    key={buttonIndex}
                    href={button.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rw-reply"
                  >
                    <span>{button.title}</span>
                  </a>
                );
              }
              return (
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <div
                  key={buttonIndex}
                  className="rw-reply"
                  onClick={() => handleClick(button)}
                  role="button"
                  tabIndex={0}
                >
                  <span>{button.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

Carousel.propTypes = {
  message: PROP_TYPES.CAROUSEL,
  // completely bugged, it's actually used in handle click
  // eslint-disable-next-line react/no-unused-prop-types
  chooseReply: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  chooseReply: (payload, title) => {
    dispatch(addUserMessage(title));
    dispatch(emitUserMessage(payload));
  }
});

export default connect(() => ({}), mapDispatchToProps)(Carousel);
