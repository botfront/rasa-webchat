import React from 'react';
import { initStore } from '../../../../../store/store';
import LocalStorageMock from '../../../.././../../mocks/localStorageMock';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { render, fireEvent, screen } from '@testing-library/react';

import behaviorReducer from '../../../../../store/reducers/behaviorReducer';
import metadataReducer from '../../../../../store/reducers/metadataReducer';
import Launcher from '../index';

const rootReducer = combineReducers({
  behavior: behaviorReducer(),
  metadata: metadataReducer()
});

const storeFactory = initialState => initStore(rootReducer, initialState, LocalStorageMock);

describe('<Launcher />', () => {
  const   createLauncherComponent = ({
    toggle,
    chatOpened,
    unreadCount = 0,
    displayUnreadCount = false
  }) => render(
    <Provider store={storeFactory({
      behavior: { unreadCount },
      metadata: {}
    })}>
      <Launcher
        toggle={toggle}
        isChatOpen={chatOpened}
        displayUnreadCount={displayUnreadCount}
      />
    </Provider>
  );

  it('should call toggle prop when clicked', () => {
    const toggle = jest.fn();
    createLauncherComponent({ toggle, chatOpened: false });
    fireEvent.click(screen.getByTestId('message-input'));
    expect(toggle).toBeCalled();
  });

  describe('Rendering open-launcher image when chatOpened = false', () => {
    it('should not display unreadCount when count is 0', () => {
      createLauncherComponent({ toggle: jest.fn(), chatOpened: false, unreadCount: 0, displayUnreadCount: true });
      expect(screen.getByTestId('rw-open-launcher')).toBeInTheDocument();
      expect(screen.queryByTestId('rw-close-launcher')).not.toBeInTheDocument();
      expect(screen.queryByTestId('rw-unread-count-pastille')).not.toBeInTheDocument();
    });

    it('should not display unreadCount when displayUnreadCount = false', () => {
      createLauncherComponent({ toggle: jest.fn(), chatOpened: false, unreadCount: 4, displayUnreadCount: false });
      expect(screen.getByTestId('rw-open-launcher')).toBeInTheDocument();
      expect(screen.queryByTestId('rw-close-launcher')).not.toBeInTheDocument();
      expect(screen.queryByTestId('rw-unread-count-pastille')).not.toBeInTheDocument();
    });

    it('should display unreadCount when count is more than 0 and displayUnreadCount = true', () => {
      createLauncherComponent({ toggle: jest.fn(), chatOpened: false, unreadCount: 2, displayUnreadCount: true });
      expect(screen.getByTestId('rw-open-launcher')).toBeInTheDocument();
      expect(screen.queryByTestId('rw-close-launcher')).not.toBeInTheDocument();
    });
  });
});
