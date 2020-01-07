import React from 'react';
import { Map } from 'immutable';
import { createStore, combineReducers } from 'redux';
import { mount } from 'enzyme';
import behavior from '../../../../../store/reducers/behaviorReducer';
import metadata from '../../../../../store/reducers/metadataReducer';


import Launcher from '../index';

const appReducer = combineReducers({ behavior: behavior(), metadata: metadata() });
const rootReducer = (state, action) => appReducer(state, action);

const storeFactory = initialState => createStore(rootReducer, { behavior: Map(initialState), metadata: Map() });

describe('<Launcher />', () => {
  const createLauncherComponent = ({
    toggle,
    chatOpened,
    unreadCount = 0,
    displayUnreadCount = false
  }) =>
    mount(<Launcher
      store={storeFactory({
        unreadCount
      })}
      toggle={toggle}
      isChatOpen={chatOpened}
      displayUnreadCount={displayUnreadCount}
    />);

  it('should call toggle prop when clicked', () => {
    const toggle = jest.fn();
    const chatOpened = false;
    const launcherComponent = createLauncherComponent({ toggle, chatOpened });
    launcherComponent.find('.launcher').simulate('click');
    expect(toggle).toBeCalled();
  });

  describe('Rendering open-launcher image when chatOpened = false', () => {
    const toggle = jest.fn();
    const chatOpened = false;

    it('should not display unreadCount when count is 0', () => {
      const unreadCount = 0;
      const displayUnreadCount = true;
      const launcherComponent = createLauncherComponent({
        toggle,
        chatOpened,
        unreadCount,
        displayUnreadCount
      });
      expect(launcherComponent.find('.open-launcher')).toHaveLength(1);
      expect(launcherComponent.find('.close-launcher')).toHaveLength(0);
      expect(launcherComponent.find('.unread-count-pastille')).toHaveLength(0);
    });

    it('should not display unreadCount when displayUnreadCount = false', () => {
      const unreadCount = 4;
      const displayUnreadCount = false;
      const launcherComponent = createLauncherComponent({
        toggle,
        chatOpened,
        unreadCount,
        displayUnreadCount
      });
      expect(launcherComponent.find('.open-launcher')).toHaveLength(1);
      expect(launcherComponent.find('.close-launcher')).toHaveLength(0);
      expect(launcherComponent.find('.unread-count-pastille')).toHaveLength(0);
    });

    it('should display unreadCount when count is superior to 0 and displayUnreadCount = true', () => {
      const unreadCount = 2;
      const displayUnreadCount = true;
      const launcherComponent = createLauncherComponent({
        toggle,
        chatOpened,
        unreadCount,
        displayUnreadCount
      });
      expect(launcherComponent.find('.open-launcher')).toHaveLength(1);
      expect(launcherComponent.find('.close-launcher')).toHaveLength(0);
      expect(launcherComponent.find('.unread-count-pastille')).toHaveLength(1);
    });
  });

  it('should render the close-launcher image when chatOpened = true', () => {
    const toggle = jest.fn();
    const chatOpened = true;
    const launcherComponent = createLauncherComponent({ toggle, chatOpened });
    expect(launcherComponent.find('.open-launcher')).toHaveLength(0);
    expect(launcherComponent.find('.close-launcher')).toHaveLength(1);
  });
});
