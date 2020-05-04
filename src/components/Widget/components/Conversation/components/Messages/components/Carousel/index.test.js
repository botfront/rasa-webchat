import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';

import { createCarousel } from 'helper';
import { List } from 'immutable';

import Messages from '../../index';
import { initStore } from '../../../../../../../../store/store';
import LocalStorageMock from '../../../../../../../../../mocks/localStorageMock';

describe('</Carousel />', () => {
  const carousel = createCarousel(
    {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'test',
              subtitle: 'test test test test test test test test test test test tes t',
              image_url: 'https://source.unsplash.com/random/4000x400/?portrait',
              default_action: { type: 'web_url', url: 'https://google.com' },
              buttons: [
                { title: 'bouton uno', type: 'postback', payload: '/chitchat.bye' },
                { title: 'bouton 2', type: 'postback', payload: '/get_started' },
                {
                  title: 'un dernier bouton',
                  type: 'web_url',
                  url: 'https://facebook.com'
                }
              ]
            },
            {
              title: 'test',
              subtitle: 'test',
              image_url: 'https://source.unsplash.com/random/330x300/?wine',
              default_action: null,
              buttons: []
            },
            {
              title: 'another test',
              subtitle: '',
              image_url: 'https://source.unsplash.com/random/400x400/?code',
              default_action: null,
              buttons: []
            }
          ]
        }
      },
      text: 'undefined'
    },
    'response'
  );

  const responseMessage = List([carousel]);

  const localStorage = new LocalStorageMock();

  const store = initStore('dummy', 'dummy', 'dummy', localStorage);

  store.dispatch({
    type: 'CONNECT'
  });

  const messagesComponent = shallow(
    <Provider store={store}>
      <Messages.WrappedComponent messages={responseMessage} />
    </Provider>
  );

  it('should render a Carousel component and buttons and default actions', () => {
    expect(messagesComponent.render().find('.rw-carousel-card')).toHaveLength(3);
    expect(messagesComponent.render().find('a[href^="https://google"]')).toHaveLength(3);
    expect(messagesComponent.render().find('.rw-reply')).toHaveLength(3);

    expect(messagesComponent.render().find('.rw-reply[href^="https://facebook"]')).toHaveLength(1);
  });
});
