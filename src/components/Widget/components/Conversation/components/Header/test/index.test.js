import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';

import Header from '../index';

const createHeader = ({ toggle, fullScreenMode, showFullScreenButton }) => render(
  <Header
    toggleFullScreen={toggle}
    fullScreenMode={fullScreenMode}
    showFullScreenButton={showFullScreenButton}
  />
);

describe('<Header />', () => {
  it('should call toggle prop when clicked', () => {
    const toggle = jest.fn();
    createHeader({ toggle, fullScreenMode: false, showFullScreenButton: true });
    fireEvent.click(screen.getByTestId('rw-toggle-fullscreen-button'));
    expect(toggle).toBeCalled();
  });

  it('should render the fullscreen image when fullScreenMode = false', () => {
    createHeader({ toggle: jest.fn(), fullScreenMode: false, showFullScreenButton: true });
    expect(screen.getByTestId('rw-fullScreenImage')).toBeInTheDocument();
  });

  it('should render the fullscreen exit image when fullScreenMode = true', () => {
    createHeader({ toggle: jest.fn(), fullScreenMode: true, showFullScreenButton: true });
    expect(screen.getByTestId('rw-fullScreenExitImage')).toBeInTheDocument();
  });

  it('should not render the fullscreen toggle button when showFullScreenButton = false', () => {
    createHeader({ toggle: jest.fn(), fullScreen: true, showFullScreenButton: false });
    expect(screen.queryByTestId('rw-toggle-fullscreen-button')).not.toBeInTheDocument();
  });
});
