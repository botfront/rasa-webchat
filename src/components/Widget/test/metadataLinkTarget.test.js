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
          type: 'web_url',
          content_type: 'text',
          title: 'google',
          url: 'http://www.google.ca'
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
  
  quickReplyComponent.update();
  
  it('should render a quick reply with a link to google targeting blank', () => {    
    var cmps = quickReplyComponent.find('a.rw-reply');
    expect(cmps).toHaveLength(3);
    
    var cmp = cmps.at(0);
    expect(cmp.text()).toEqual('google');
    expect(cmp.prop('href')).toEqual('http://www.google.ca');
    expect(cmp.prop('target')).toEqual('_blank');
  });

  it('should render a quick reply with a link to google targeting self', () => {    
    var cmps = quickReplyComponent.find('a.rw-reply');
    expect(cmps).toHaveLength(3);
    
    var cmp = cmps.at(1);
    expect(cmp.text()).toEqual('google');
    expect(cmp.prop('href')).toEqual('javascript:alert("http://www.google.ca")');
    expect(cmp.prop('target')).toEqual('_self');
  });
  
  it('should render a quick reply with a link to mail targeting self', () => {    
    var cmps = quickReplyComponent.find('a.rw-reply');
    expect(cmps).toHaveLength(3);
    
    var cmp = cmps.at(2);
    expect(cmp.text()).toEqual('mail');
    expect(cmp.prop('href')).toEqual('mailto:someone@somewhere.com');
    expect(cmp.prop('target')).toEqual('_self');
  });
});
