import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render } from 'enzyme';

import { createKeywords } from 'helper';
import Keywords from '../index';


describe('<Keywords />', () => {
  const keywords = createKeywords({
    text: 'test',
    keywords: [
      {
        type: 'postback',
        content_type: 'text',
        title: 'Keyword title 1',
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

  keywords.set('docViewer', false);
  const mockStore = configureMockStore();
  const store = mockStore({
    getChosenReply: () => undefined,
    inputState: false,
    messages: new Map([[1, new Map([['chosenReply', undefined]])]]),
    behavior: new Map([['disabledInput', false]]),
    metadata: new Map()
  });

  const keywordsComponent = render(
    <Provider store={store}>
      <Keywords
        params={null}
        id={1}
        message={keywords}
        isLast
      />
    </Provider>
  );

  it('should render a quick reply with a link to google', () => {
    expect(keywordsComponent.find('a.rw-reply')).toHaveLength(1);
    expect(keywordsComponent.find('a.rw-reply').html()).toEqual('google');
    expect(keywordsComponent.find('a.rw-reply').prop('href')).toEqual('http://www.google.ca');
  });
});
