import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render } from 'enzyme';

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
  const mockStore = configureMockStore();
  const store = mockStore({ getChosenReply: () => undefined,
    inputState: false,
    messages: new Map([[1, new Map([['chosenReply', undefined]])]]),
    behavior: new Map([['disabledInput', false]]),
    metadata: new Map() });

  const buttonsComponent = render(
    <Provider store={store}>
      <Buttons
        params={null}
        id={1}
        message={buttons}
        isLast
      />
    </Provider>
  );

  it('should render a quick reply with a link to google', () => {
    expect(buttonsComponent.find('a.rw-reply')).toHaveLength(1);
    expect(buttonsComponent.find('a.rw-reply').html()).toEqual('google');
    expect(buttonsComponent.find('a.rw-reply').prop('href')).toEqual('http://www.google.ca');
  });
});
