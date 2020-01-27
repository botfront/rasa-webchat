import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { fromJS } from 'immutable';

import LocalStorageMock from '../../../../mocks/localStorageMock';
import Message from '../components/Conversation/components/Messages/components/Message';
import { store, initStore } from '../../../store/store';


describe('Message custom Css', () => {
  const localStorage = new LocalStorageMock();
  const stubSocket = jest.fn();
  initStore('dummy', 'dummy', stubSocket, localStorage);
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

  it('should render a quick reply with a link to google targeting self', () => {
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
    expect(messageComponent.find('div.response').prop('style')).toEqual({ cssText: 'color:red;' });
    expect(messageComponent.find('div.response').prop('className')).toEqual('response');
  });

  it('should render a quick reply with a link to google targeting self', () => {
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
    expect(messageComponent.find('div.response').prop('className')).toEqual('response test-class');
    expect(messageComponent.find('div.response').prop('style')).toEqual({ cssText: undefined });
  });

  it('should render a quick reply with a link to google targeting self', () => {
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
    expect(messageComponent.find('div.client').prop('className')).toEqual('client');
    expect(messageComponent.find('div.client').prop('style')).toEqual({ cssText: undefined });
  });
});
