import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import { createCarousel } from '../../../../../../../../store/reducers/helper';
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

  const localStorage = new LocalStorageMock();
  const responseMessage = List([carousel]);
  const store = initStore('dummy', 'dummy', localStorage);


  store.dispatch({
    type: 'CONNECT'
  });
  render(
    <Provider store={store}>
      <Messages messages={responseMessage} />
    </Provider>
  );
  
  it('should render a Carousel component and buttons and default actions', () => {


    expect(screen.getAllByTestId('rw-carousel-card')).toHaveLength(3);
    expect(screen.getAllByTestId('rw-link-google')).toHaveLength(3);
    expect(screen.getAllByTestId('rw-reply')).toHaveLength(3);
    expect(screen.getAllByTestId('rw-link-facebook')).toHaveLength(1);
  });
});
