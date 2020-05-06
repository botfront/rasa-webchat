import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render } from 'enzyme';

import { createQuickReply } from 'helper';
import QuickReply from '../index';


describe('<QuickReply />', () => {
  const quickReply = createQuickReply({
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

  quickReply.set('docViewer', false);
  const mockStore = configureMockStore();
  const store = mockStore({ getChosenReply: () => undefined,
    inputState: false,
    messages: new Map([[1, new Map([['chosenReply', undefined]])]]),
    behavior: new Map([['disabledInput', false]]),
    metadata: new Map() });

  const quickReplyComponent = render(
    <Provider store={store}>
      <QuickReply
        params={null}
        id={1}
        message={quickReply}
        isLast
      />
    </Provider>
  );

  it('should render a quick reply with a link to google', () => {
    expect(quickReplyComponent.find('a.rw-reply')).toHaveLength(1);
    expect(quickReplyComponent.find('a.rw-reply').html()).toEqual('google');
    expect(quickReplyComponent.find('a.rw-reply').prop('href')).toEqual('http://www.google.ca');
  });
});
