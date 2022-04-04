import React, { useRef, useState, useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addUserMessage, emitUserMessage } from 'actions';
import { PROP_TYPES } from 'constants';
import ThemeContext from '../../../../../../ThemeContext';

import SVG, { Props as SVGProps } from 'react-inlinesvg';
import arrowSvg from 'assets/arrow.svg';

import './styles.scss';

const Carousel = (props) => {
  const CARD_WIDTH = 234;

  const carousel = props.message.toJS();

  const handleClick = (action) => {
    if (!action || action.type !== 'postback') return;
    const { chooseReply } = props;
    chooseReply(action.payload, action.title);
  };

  const scrollContainer = useRef();

  // reset carousel position after page reload
  useEffect(() => {
    scrollContainer.current.scrollTo({left: 0});
  }, []);

  const [leftButton, setLeftButton] = useState(false);
  const [rightButton, setRightButton] = useState(true);
  const { mainColor, assistTextColor } = useContext(ThemeContext);
  const [activeCard, setActiveCard] = useState(0);

  const handleScroll = () => {
    const current = scrollContainer.current;
    if (current.scrollLeft > 0) {
      setLeftButton(true);
    } else {
      setLeftButton(false);
    }
    if (current.clientWidth === current.scrollWidth - current.scrollLeft) {
      setRightButton(false);
    } else {
      setRightButton(true);
    }
  };

  const handleLeftArrow = () => {
    scrollContainer.current.scrollTo({
      left: scrollContainer.current.scrollLeft - CARD_WIDTH,
      behavior: 'smooth'
    });

    activeCard > 0 ? setActiveCard(activeCard - 1): setActiveCard(0);
  };

  const handleRightArrow = () => {
    scrollContainer.current.scrollTo({
      left: scrollContainer.current.scrollLeft + CARD_WIDTH,
      behavior: 'smooth'
    });

    console.log({rightButton})
    activeCard < carousel.elements.length - 1 ? setActiveCard(activeCard + 1) : setActiveCard(carousel.elements.length - 1);
    console.log({rightButton})
  };

  const { linkTarget } = props;


  return (
    <React.Fragment>
      <div className="rw-carousel-container" ref={scrollContainer} onScroll={() => handleScroll()}>
        {carousel.elements.map((carouselCard, index) => {
          const defaultActionUrl =
            carouselCard.default_action && carouselCard.default_action.type === 'web_url'
              ? carouselCard.default_action.url
              : null;
          return (
            <div className="rw-carousel-card" key={index}>
                <a
                  className="rw-carousel-card-title"
                  href={defaultActionUrl}
                  target={linkTarget || '_blank'}
                  rel="noopener noreferrer"
                  onClick={() => handleClick(carouselCard.default_action)}
                  style={{ color: assistTextColor }}
                >
                  {carouselCard.title}
                </a>
                <a
                  className="rw-carousel-card-image"
                  href={defaultActionUrl}
                  target={linkTarget || '_blank'}
                  rel="noopener noreferrer"
                  onClick={() => handleClick(carouselCard.default_action)}
                  style={{backgroundImage: `url('${carouselCard.image_url}')`}}
                >
                </a>
                <a
                className="rw-carousel-card-subtitle"
                href={defaultActionUrl}
                target={linkTarget || '_blank'}
                rel="noopener noreferrer"
                onClick={() => handleClick(carouselCard.default_action)}
                style={{ color: assistTextColor }}
                title={carouselCard.subtitle}
              >
                {carouselCard.subtitle}
              </a>
              <div className="rw-carousel-buttons-container">
                {carouselCard.buttons.map((button, buttonIndex) => {
                  if (button.type === 'web_url') {
                    return (
                      <a
                        key={buttonIndex}
                        href={button.url}
                        target={linkTarget || '_blank'}
                        rel="noopener noreferrer"
                        className="rw-reply"
                        style={{ borderColor: mainColor, color: mainColor }}
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
                      style={{ borderColor: mainColor, color: mainColor }}
                    >
                      <span>{button.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="rw-carousel-arrows-container">
        {leftButton && (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <div
            className="rw-left-arrow rw-carousel-arrow"
            onClick={handleLeftArrow}
            role="button"
            tabIndex={0}
          >
            <div className="rw-arrow" alt="left carousel arrow" >
              <SVG
                src={arrowSvg}
                alt="left"
              /></div>
          </div>
        )}
        {rightButton && (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <div
            className="rw-right-arrow rw-carousel-arrow"
            onClick={handleRightArrow}
            role="button"
            tabIndex={0}
          >
            <div className="rw-arrow" alt="right carousel arrow">
              <SVG
                src={arrowSvg}
                alt="right"
              /></div>
          </div>
        )}
      </div>
      <div className="rw-carousel-navigation-dots">
      {carousel.elements.map((carouselCard, index) => {
          const defaultActionUrl =
            carouselCard.default_action && carouselCard.default_action.type === 'web_url'
              ? carouselCard.default_action.url
              : null;
          return (
            <div className={`rw-carousel-navigation-dot ${index === activeCard ? 'active' : ''}`} key={index}>
              
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};


Carousel.propTypes = {
  message: PROP_TYPES.CAROUSEL,
  // completely bugged, it's actually used in handle click
  // eslint-disable-next-line react/no-unused-prop-types
  chooseReply: PropTypes.func.isRequired,
  linkTarget: PropTypes.string
};

const mapStateToProps = state => ({
  linkTarget: state.metadata.get('linkTarget')
});

const mapDispatchToProps = dispatch => ({
  chooseReply: (payload, title) => {
    if (title) dispatch(addUserMessage(title));
    dispatch(emitUserMessage(payload));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Carousel);
