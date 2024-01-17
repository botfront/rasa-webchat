import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import Widget from '../index';
import WidgetLayout from '../layout';
import { initStore } from '../../../store/store';
import LocalStorageMock from '../../../../mocks/localStorageMock';
import { emitUserMessage} from 'actions';
import assetMock from 'tests-mocks/fileMock';

describe('<Widget />', () => {
  const profile = assetMock;
  let store, mockSocket, localStorageMock, handleUserMessage, dispatch, newMessageEvent;

  beforeEach(() => {
    handleUserMessage = jest.fn();
    dispatch = jest.fn();
    newMessageEvent = {
      target: {
        message: {
          value: 'New message'
        }
      },
      preventDefault() {}
    };
    localStorageMock = new LocalStorageMock();
    mockSocket = {
      emit: jest.fn((action, message) => sentToSocket.push({ action, message })),
      on: () => {},
      close: jest.fn(),
      sessionConfirmed: true
    };
    store = initStore('dummy', mockSocket, localStorageMock);
  });
  const renderWidgetComponent = () => render(
    <Provider store={store}>
      <Widget
        handleNewUserMessage={handleUserMessage}
        profileAvatar={profile}
        dispatch={dispatch}
        customMessageDelay={() => {}}
        tooltipSent
        tooltipDelay={0}
        socket={{
          isInitialized: () => true,
          emit: jest.fn((action, message) => sentToSocket.push({ action, message })),
          on: () =>{},
          close: jest.fn(),
          sessionConfirmed: true
        }}
      />
    </Provider>
  );

  it('should render WidgetLayout', () => {
    const { getByTestId } = renderWidgetComponent();
    expect(getByTestId('widget-layout')).toBeInTheDocument();
  });

  it('should prevent events default behavior', () => {
  
    const { getByTestId } = renderWidgetComponent();
    const messageInput = getByTestId('message-input');
    fireEvent.change(messageInput, { target: { value: 'New message' } });
    fireEvent.submit(messageInput);
    expect(messageInput.value).toBe('New message');
  });

  it('should clear the message input when new message is submitted', () => {
    const { getByTestId } = renderWidgetComponent();
    const messageInput = getByTestId('message-input');
    fireEvent.change(messageInput, { target: { value: 'New message' } });
    fireEvent.submit(messageInput);
    screen.debug()
    expect(messageInput.value).toBe('');
  });
});
