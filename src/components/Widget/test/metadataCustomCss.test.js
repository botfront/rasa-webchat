import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { fromJS } from 'immutable';

import LocalStorageMock from '../../../../mocks/localStorageMock';
import Message from '../components/Conversation/components/Messages/components/Message';
import { initStore } from '../../../store/store';

describe('Message custom Css', () => {
  const localStorage = new LocalStorageMock();
  const stubSocket = jest.fn();
  const store = initStore('dummy', 'dummy', stubSocket, localStorage);

  const messages = [];
  // a response with customcss of type custom
  messages.push({
    type: 'text',
    text: 'dummy',
    sender: 'response',
    showAvatar: true,
    timestamp: 1580141564886,
    customCss: { css: 'color:red;', style: 'custom' } });

  // a response with customcss of type class
  messages.push({
    type: 'text',
    text: 'dummy',
    sender: 'response',
    showAvatar: true,
    timestamp: 1580141564886,
    customCss: { css: 'test-class', style: 'class' } });

  // a user with customcss should not happen, but testing it nonetheless
  messages.push({
    type: 'text',
    text: 'dummy',
    sender: 'client',
    showAvatar: true,
    timestamp: 1580141564886,
    customCss: { css: 'color:red;', style: 'custom' } });

  it('check that a custom style is correctly applied', () => {
    const messageComponent = mount(
      <Provider store={store}>
        <Message
          params={null}
          id={0}
          message={fromJS(messages[0])}
          isLast
          getChosenReply={() => false}
        />
      </Provider>
    );
    expect(messageComponent.find('div.rw-response').prop('style')).toEqual({ cssText: 'color:red;' });
  });

  it('check that a class style is correctly applied', () => {
    const messageComponent = mount(
      <Provider store={store}>
        <Message
          params={null}
          id={0}
          message={fromJS(messages[1])}
          isLast
          getChosenReply={() => false}
        />
      </Provider>
    );
    expect(messageComponent.find('div.rw-response').prop('className')).toEqual('rw-response test-class');
    expect(messageComponent.find('div.rw-response').prop('style')).toEqual({ cssText: undefined });
  });

  it('check that a  style cannot be applied to a user message', () => {
    const messageComponent = mount(
      <Provider store={store}>
        <Message
          params={null}
          id={0}
          message={fromJS(messages[2])}
          isLast
          getChosenReply={() => false}
        />
      </Provider>
    );
    expect(messageComponent.find('div.rw-client').prop('className')).toEqual('rw-client');
    expect(messageComponent.find('div.rw-client').prop('style')).toEqual({ cssText: undefined });
  });
});
