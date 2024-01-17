import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'

import { createButtons } from 'helper';
import Buttons from '../index';

describe('<Buttons />', () => {
  const buttons = createButtons({
    text: 'test',
    quick_replies: [
      {
        type: 'postback',
        content_type: 'text',
        title: 'Button title 1',
        payload: '/payload1'
      },
      {
        type: 'web_url',
        content_type: 'text',
        title: 'google',
        url: 'http://www.google.ca'
      }
    ]
  });

  buttons.set('docViewer', false);
  const mockStore = configureStore([]);
  const store = mockStore({ getChosenReply: () => undefined,
    inputState: false,
    messages: new Map([[1, new Map([['chosenReply', undefined]])]]),
    behavior: new Map([['disabledInput', false]]),
    metadata: new Map() });

  it('should render a quick reply with a link to google', () => {
    render(
      <Provider store={store}>
        <Buttons
          params={null}
          id={1}
          message={buttons}
          isLast
        />
      </Provider>
    );

    const linkElement = screen.getByText('google');
    expect(linkElement).toHaveAttribute('href', 'http://www.google.ca');
  });
});
