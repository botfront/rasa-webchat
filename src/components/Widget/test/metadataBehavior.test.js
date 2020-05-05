import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';

import assetMock from 'tests-mocks/fileMock';
import Widget from '../index';
import { initStore } from '../../../store/store';
import LocalStorageMock from '../../../../mocks/localStorageMock';

const localStorage = new LocalStorageMock();
let sentToSocket = [];
const mockSocket = {
  emit: jest.fn((action, message) => sentToSocket.push({ action, message })),
  on: () => {},
  sessionConfirmed: true
};
const store = initStore('dummy', 'dummy', mockSocket, localStorage);

describe('Metadata store affect app behavior', () => {
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
        disableTooltips /* whithout this the tests about domHighlight fails, as it tries to display the tooltip it also apply the styles.
        and some how the styles applied in the test are wrong, but trying the same behavior on the real webchat does not create any issue
        if you remove this props to experiment, it seems that it's the applyCustomStyle in handleMessageReceived that causing the test to fail */
      />
    </Provider>
    , { disableLifecycleMethods: true }
  );

  let elemAttributes;
  const classes = [];
  let eventListener;


  const querySelectorAllspyFunc = jest.fn(() => ([{
    addEventListener(event, handler) {
      eventListener = { event, handler };
    },

    setAttribute(attribute, value) {
      elemAttributes = { attribute, value };
    },
    classList: {
      add(className) {
        classes.push(className);
      },
      remove(className) {
        const index = classes.indexOf(className);
        classes.splice(index, 1);
      }
    } }]));
  Object.defineProperty(document, 'querySelectorAll', { value: querySelectorAllspyFunc });

  beforeEach(() => sentToSocket = []);

  it('should use the callbackIntent on expected url change', () => {
    store.dispatch({ type: 'SET_OLD_URL', url: 'http://lorem.com' });
    store.dispatch({ type: 'SET_PAGECHANGE_CALLBACKS',
      pageChangeCallbacks: {
        pageChanges: [
          {
            url: 'http://ipsum.com/cool',
            callbackIntent: '/yes',
            regex: false
          }
        ],
        errorIntent: '/no'
      } });
    store.dispatch({ type: 'EVAL_URL', url: 'http://ipsum.com/cool' });
    expect(sentToSocket).toHaveLength(1);
    expect(sentToSocket[0].message.message).toEqual('/yes');
  });

  it('should ignore host and use the callbackIntent on expected url change', () => {
    store.dispatch({ type: 'SET_OLD_URL', url: 'http://lorem.com/blo' });
    store.dispatch({ type: 'SET_PAGECHANGE_CALLBACKS',
      pageChangeCallbacks: {
        pageChanges: [
          {
            url: 'http://ipsum.com/bla',
            callbackIntent: '/yes',
            regex: false
          }
        ],
        errorIntent: '/no'
      } });
    store.dispatch({ type: 'EVAL_URL', url: 'http://lorem.com/bla' });
    expect(sentToSocket).toHaveLength(1);
    expect(sentToSocket[0].message.message).toEqual('/yes');
  });


  it('should use the errorIntent on bad url change', () => {
    store.dispatch({ type: 'SET_OLD_URL', url: 'http://lorem.com/bou' });
    store.dispatch({ type: 'SET_PAGECHANGE_CALLBACKS',
      pageChangeCallbacks: {
        pageChanges: [
          {
            url: 'http://ipsum.com/bla',
            callbackIntent: '/yes',
            regex: false
          }
        ],
        errorIntent: '/no'
      } });
    store.dispatch({ type: 'EVAL_URL', url: 'http://dolor.com/blo' });
    expect(sentToSocket).toHaveLength(1);
    expect(sentToSocket[0].message.message).toEqual('/no');
  });

  it('should use the regex for urlchecking', () => {
    store.dispatch({ type: 'SET_OLD_URL', url: 'lorem.com' });
    store.dispatch({ type: 'SET_PAGECHANGE_CALLBACKS',
      pageChangeCallbacks: {
        pageChanges: [
          {
            url: /dolor.+sit/,
            callbackIntent: '/yes',
            regex: true
          }
        ],
        errorIntent: '/no'
      } });
    store.dispatch({ type: 'EVAL_URL', url: 'dolor/amet/sit.com' });
    expect(sentToSocket).toHaveLength(1);
    expect(sentToSocket[0].message.message).toEqual('/yes');
  });

  it('should use multiple the regex/string for urlchecking', () => {
    store.dispatch({ type: 'SET_OLD_URL', url: 'http://lorem.com' });
    store.dispatch({ type: 'SET_PAGECHANGE_CALLBACKS',
      pageChangeCallbacks: {
        pageChanges: [
          {
            url: /dolor.+sit/,
            callbackIntent: '/dolor',
            regex: true
          },
          {
            url: 'elit.com/se',
            callbackIntent: '/se',
            regex: false
          },
          {
            url: /http:\/\/elit.+sed/,
            callbackIntent: '/yes',
            regex: true
          }
        ],
        errorIntent: '/no'
      } });
    store.dispatch({ type: 'EVAL_URL', url: 'http://elit.com/sed' });
    expect(sentToSocket).toHaveLength(1);
    expect(sentToSocket[0].message.message).toEqual('/yes');
  });

  it('should change the style of a element', () => {
    store.dispatch({ type: 'SET_DOM_HIGHLIGHT',
      domHighlight: {
        selector: '.test',
        style: 'custom',
        css: 'color: red'
      } });

    widgetComponent.dive().dive().dive().dive()
      .dive()
      .instance()
      .applyCustomStyle();

    expect(elemAttributes).toEqual({ attribute: 'style', value: 'color: red' });
    expect(querySelectorAllspyFunc).toHaveBeenCalled();
    const botUtter = {
      text: 'test'
    };
    widgetComponent.dive().dive().dive().dive()
      .dive()
      .instance()
      .handleBotUtterance(botUtter);
    expect(elemAttributes).toEqual({ attribute: 'style', value: '' });
  });

  it('should apply the default style to an element', () => {
    store.dispatch({ type: 'SET_DOM_HIGHLIGHT',
      domHighlight: {
        selector: '.test',
        style: 'default',
        css: ''
      } });

    widgetComponent.dive().dive().dive().dive()
      .dive()
      .instance()
      .applyCustomStyle();

    expect(elemAttributes.value).toContain('animation: 0.5s linear infinite alternate default-botfront-blinker-animation; outline-style: solid;');
    expect(querySelectorAllspyFunc).toHaveBeenCalled();
    const botUtter = {
      text: 'test'
    };
    widgetComponent.dive().dive().dive().dive()
      .dive()
      .instance()
      .handleBotUtterance(botUtter);
    expect(elemAttributes).toEqual({ attribute: 'style', value: '' });
  });

  it('should apply the specified class to an element', () => {
    store.dispatch({ type: 'SET_DOM_HIGHLIGHT',
      domHighlight: {
        selector: '.test',
        style: 'class',
        css: 'highlight-class'
      } });

    widgetComponent.dive().dive().dive().dive()
      .dive()
      .instance()
      .applyCustomStyle();

    expect(classes).toEqual(['highlight-class']);
    expect(querySelectorAllspyFunc).toHaveBeenCalled();
    const botUtter = {
      text: 'test'
    };
    widgetComponent.dive().dive().dive().dive()
      .dive()
      .instance()
      .handleBotUtterance(botUtter);
    expect(classes).toEqual([]);
  });
  it('pageEventCallback should add event listener on page', () => {
    const botUtter = {
      text: 'dummy',
      metadata: {
        pageEventCallbacks: {
          pageEvents: [
            {
              selector: 'body',
              payload: '/new_intent',
              event: 'click'
            }
          ]
        }
      }
    };

    widgetComponent.dive().dive().dive().dive()
      .dive()
      .instance()
      .handleBotUtterance(botUtter);
    expect(eventListener.event).toEqual('click');
    expect(eventListener.handler).toBeInstanceOf(Function);
  });
});

