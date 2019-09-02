import React from 'react';
import { shallow } from 'enzyme';

import Header from '../index';

describe('<Header />', () => {
  const createHeader = ({ toggle, fullScreenMode, showFullScreenButton }) =>
    shallow(<Header
      toggleFullScreen={toggle}
      fullScreenMode={fullScreenMode}
      showFullScreenButton={showFullScreenButton}
    />);

  it('should call toggle prop when clicked', () => {
    const toggle = jest.fn();
    const fullScreenMode = false;
    const showFullScreenButton = true;
    const headerComponent = createHeader({ toggle, fullScreenMode, showFullScreenButton });
    headerComponent.find('.toggle-fullscreen-button').simulate('click');
    expect(toggle).toBeCalled();
  });

  it('should render the fullscreen image when fullScreenMode = false', () => {
    const toggle = jest.fn();
    const fullScreenMode = false;
    const showFullScreenButton = true;
    const headerComponent = createHeader({ toggle, fullScreenMode, showFullScreenButton });
    expect(headerComponent.find('.fullScreenImage')).toHaveLength(1);
  });

  it('should render the fullscreen exit image when fullScreenMode = true', () => {
    const toggle = jest.fn();
    const fullScreenMode = true;
    const showFullScreenButton = true;
    const headerComponent = createHeader({ toggle, fullScreenMode, showFullScreenButton });
    expect(headerComponent.find('.fullScreenExitImage')).toHaveLength(1);
  });

  it('should not render the fullscreen toggle button when showFullScreenButton = false', () => {
    const toggle = jest.fn();
    const fullScreen = true;
    const showFullScreenButton = false;
    const headerComponent = createHeader({ toggle, fullScreen, showFullScreenButton });
    expect(headerComponent.find('.toggle-fullscreen-button')).toHaveLength(0);
  });
});
