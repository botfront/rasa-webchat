import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import LocalStorageMock from '../../../../mocks/localStorageMock';
import Buttons from '../components/Conversation/components/Messages/components/Buttons';
import { initStore } from '../../../store/store';

const localStorage = new LocalStorageMock();
const stubSocket = jest.fn();
const store = initStore('dummy', stubSocket, localStorage);

describe('link target', () => {
  store.dispatch({ type: 'ADD_BUTTONS',
    buttons: {
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
    } });
  const buttonsComponent = mount(
    <Provider store={store}>
      <Buttons
        params={null}
        id={0}
        message={store.getState().messages.get(0)}
        isLast
        getChosenReply={() => false}
      />
    </Provider>
  );

  it('should render a quick reply with a link to google targeting self', () => {
    store.dispatch({ type: 'SET_LINK_TARGET', target: '_self' });
    buttonsComponent.update();
    expect(buttonsComponent.find('a.rw-reply')).toHaveLength(1);
    expect(buttonsComponent.find('a.rw-reply').text()).toEqual('google');
    expect(buttonsComponent.find('a.rw-reply').prop('href')).toEqual('http://www.google.ca');
    expect(buttonsComponent.find('a.rw-reply').prop('target')).toEqual('_self');
  });

  it('should render a quick reply with a link to google targeting blank', () => {
    store.dispatch({ type: 'SET_LINK_TARGET', target: '_blank' });
    buttonsComponent.update();
    expect(buttonsComponent.find('a.rw-reply')).toHaveLength(1);
    expect(buttonsComponent.find('a.rw-reply').text()).toEqual('google');
    expect(buttonsComponent.find('a.rw-reply').prop('href')).toEqual('http://www.google.ca');
    expect(buttonsComponent.find('a.rw-reply').prop('target')).toEqual('_blank');
  });
});
