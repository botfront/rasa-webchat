import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';

import Buttons from '../components/Conversation/components/Messages/components/Buttons';
import { initStore } from '../../../store/store';
import LocalStorageMock from '../../../../mocks/localStorageMock';

const stubSocket = jest.fn();
const localStorage = new LocalStorageMock();
const store = initStore('dummy', stubSocket, localStorage);

describe('link target', () => {
  beforeEach(() => {
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
      } 
    });
  });

  const renderButtonsComponent = (target) => {
    store.dispatch({ type: 'SET_LINK_TARGET', target });
    return render(
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
  };

  it('should render a quick reply with a link to google targeting self', () => {
    renderButtonsComponent('_self');
    const link = screen.getByText('google');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'http://www.google.ca');
    expect(link).toHaveAttribute('target', '_self');
  });

  it('should render a quick reply with a link to google targeting blank', () => {
    renderButtonsComponent('_blank');
    const link = screen.getByText('google');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'http://www.google.ca');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
