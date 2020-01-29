import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';

import assetMock from 'tests-mocks/fileMock';
import Widget from '../index';
import { initStore } from '../../../store/store';
import LocalStorageMock from '../../../../mocks/localStorageMock';

const localStorage = new LocalStorageMock();
const store = initStore('dummy', 'dummy', 'dummy', localStorage);

describe('Messages metadata affect store', () => {
  const profile = assetMock;
  const handleUserMessage = jest.fn();


  store.dispatch({
    type: 'CONNECT' });
  const widgetComponent = shallow(
    <Provider store={store}>
      <Widget
        store={store}
        handleNewUserMessage={handleUserMessage}
        profileAvatar={profile}
        dispatch={store.dispatch}
        connectOn="open"
        customMessageDelay={() => {}}
        connected
        isChatOpen={false}
      />
    </Provider>, { disableLifecycleMethods: true }
  );

  it('userinput metaData should change input info in store', () => {
    let botUtter = {
      metadata: {
        userInput: 'disable'
      }
    };
    widgetComponent.dive().dive().dive().dive()
      .dive()
      .instance()
      .handleBotUtterance(botUtter);
    expect(store.getState().metadata.get('userInput')).toEqual('disable');
    botUtter = {
      metadata: {
        userInput: 'hide'
      }
    };
    widgetComponent.dive().dive().dive().dive()
      .dive()
      .instance()
      .handleBotUtterance(botUtter);
    expect(store.getState().metadata.get('userInput')).toEqual('hide');
  });

  it('linktarget metaData should change link targets info in store', () => {
    let botUtter = {
      metadata: {
        linkTarget: '_self'
      }
    };
    widgetComponent.dive().dive().dive().dive()
      .dive()
      .instance()
      .handleBotUtterance(botUtter);
    expect(store.getState().metadata.get('linkTarget')).toEqual('_self');

    botUtter = {
      metadata: {
        linkTarget: '_blank'
      }
    };
    widgetComponent.dive().dive().dive().dive()
      .dive()
      .instance()
      .handleBotUtterance(botUtter);
    expect(store.getState().metadata.get('linkTarget')).toEqual('_blank');
  });

  it('pageCallback metaData should change pageCallback info in store', () => {
    const botUtter = {
      text: 'dummy',
      metadata: {
        pageChangeCallbacks: {
          pageChanges: [
            {
              url: 'http://google.com',
              callbackIntent: 'new_intent',
              regex: true
            }
          ],
          errorIntent: 'error'
        }
      }
    };
    widgetComponent.dive().dive().dive().dive()
      .dive()
      .instance()
      .handleBotUtterance(botUtter);
    expect(store.getState().behavior.get('pageChangeCallbacks').toJS()).toEqual({
      pageChanges: [
        {
          url: 'http://google.com',
          callbackIntent: 'new_intent',
          regex: true
        }
      ],
      errorIntent: 'error'
    });
  });

  it('domHighlight metaData should change domHighlight info in store', () => {
    const botUtter = {
      text: 'dummy',
      metadata: {
        domHighlight: {
          selector: '.test',
          style: 'color: red'
        }
      }
    };
    widgetComponent.dive().dive().dive().dive()
      .dive()
      .instance()
      .handleBotUtterance(botUtter);
    expect(store.getState().metadata.get('domHighlight').toJS()).toEqual({
      selector: '.test',
      style: 'color: red'
    });
  });
});
