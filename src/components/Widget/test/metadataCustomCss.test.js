import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { fromJS } from 'immutable';

import Message from '../components/Conversation/components/Messages/components/Message';
import { initStore } from '../../../store/store';

describe('Message custom Css', () => {
  const stubSocket = jest.fn();
  const store = initStore('dummy', stubSocket);

  const messages = [
    // a response with customcss of type custom
    {
      type: 'text',
      text: 'dummy',
      sender: 'response',
      showAvatar: true,
      timestamp: 1580141564886,
      customCss: { css: 'color:red', style: 'custom' }
    },
    // a response with customcss of type class
    {
      type: 'text',
      text: 'dummy',
      sender: 'response',
      showAvatar: true,
      timestamp: 1580141564886,
      customCss: { css: 'test-class', style: 'class' }
    },
    // a user with customcss should not happen, but testing it nonetheless
    {
      type: 'text',
      text: 'dummy',
      sender: 'client',
      showAvatar: true,
      timestamp: 1580141564886,
      customCss: { css: 'color:red', style: 'custom' }
    }
  ];

  const renderMessageComponent = (message) => render(
    <Provider store={store}>
      <Message
        params={null}
        id={0}
        message={fromJS(message)}
        isLast
        getChosenReply={() => false}
      />
    </Provider>
  );

  it('check that a custom style is correctly applied', () => {
    const { container } = renderMessageComponent(messages[0]);
    expect(container.querySelector('.rw-response').style.cssText).toEqual('color: red;');
  });

  it('check that a class style is correctly applied', () => {
    const { container } = renderMessageComponent(messages[1]);
    const responseElement = container.querySelector('.rw-response');
    expect(responseElement.className).toContain('test-class');
  });

  it('check that a style cannot be applied to a user message', () => {
    const { container } = renderMessageComponent(messages[2]);
    const clientElement = container.querySelector('.rw-client');
    expect(clientElement.className).toEqual(expect.stringContaining('rw-client'));
    expect(clientElement.style.backgroundColor).toBe('');
    expect(clientElement.style.color).toBe('');
  });
});
