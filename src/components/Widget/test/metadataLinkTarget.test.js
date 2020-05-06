import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import LocalStorageMock from '../../../../mocks/localStorageMock';
import QuickReply from '../components/Conversation/components/Messages/components/QuickReply';
import { initStore } from '../../../store/store';

const localStorage = new LocalStorageMock();
const stubSocket = jest.fn();
const store = initStore('dummy', 'dummy', stubSocket, localStorage);

describe('link target', () => {
  store.dispatch({ type: 'ADD_QUICK_REPLY',
    quickReply: {
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
          url: 'javascript:alert("http://www.google.ca")'
        },
        {
          type: 'web_url',
          content_type: 'text',
          title: 'mail',
          url: 'mailto:someone@somewhere.com'
        }
      ]
    } });
  const quickReplyComponent = mount(
    <Provider store={store}>
      <QuickReply
        params={null}
        id={0}
        message={store.getState().messages.get(0)}
        isLast
        getChosenReply={() => false}
      />
    </Provider>
  );

  it('should render a quick reply with a link to google targeting blank', () => {
    store.dispatch({ type: 'SET_LINK_TARGET' });
    quickReplyComponent.update();
    expect(quickReplyComponent.find('a.reply')).toHaveLength(1);
    expect(quickReplyComponent.find('a.reply').text()).toEqual('google');
    expect(quickReplyComponent.find('a.reply').prop('href')).toEqual('http://www.google.ca');
    expect(quickReplyComponent.find('a.reply').prop('target')).toEqual('_blank');
  });

  it('should render a quick reply with a link to google targeting self', () => {
    store.dispatch({ type: 'SET_LINK_TARGET' });
    quickReplyComponent.update();
    expect(quickReplyComponent.find('a.reply')).toHaveLength(1);
    expect(quickReplyComponent.find('a.reply').text()).toEqual('google');
    expect(quickReplyComponent.find('a.reply').prop('href')).toEqual('javascript:alert("http://www.google.ca")');
    expect(quickReplyComponent.find('a.reply').prop('target')).toEqual('_self');
  });
  
  it('should render a quick reply with a link to google targeting self', () => {
    store.dispatch({ type: 'SET_LINK_TARGET' });
    quickReplyComponent.update();
    expect(quickReplyComponent.find('a.reply')).toHaveLength(1);
    expect(quickReplyComponent.find('a.reply').text()).toEqual('mail');
    expect(quickReplyComponent.find('a.reply').prop('href')).toEqual('mailto:someone@somewhere.com');
    expect(quickReplyComponent.find('a.reply').prop('target')).toEqual('_self');
  });
});
