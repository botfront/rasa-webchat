import React from 'react';
import { List } from 'immutable';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // For extended matchers like toBeInTheDocument
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import '@testing-library/jest-dom'

// Assuming these functions create appropriate mock data for your components
import {
  createNewMessage,
  createVideoSnippet,
  createImageSnippet,
  createComponentMessage,
  createButtons
} from '../../../../../../../store/reducers/helper';

import Messages from '../index';
// Assuming these components exist and render the provided data
import Video from '../components/VidReply';
import Image from '../components/ImgReply';
import Message from '../components/Message';
import Buttons from '../components/Buttons';




describe('<Messages />', () => {

  beforeAll(() => {
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };
    global.sessionStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };
  });
  
  const mockStore = configureMockStore();
  const initialState = {}; // Your initial state here
  let store = mockStore({ getChosenReply: () => undefined,
    inputState: false,
    messages: new Map([[1, new Map([['chosenReply', undefined]])]]),
    behavior: new Map([['disabledInput', false]]),
    metadata: new Map() });

  const RealDate = Date;

  const mockDate = (isoDate) => {
    global.Date = class extends RealDate {
      constructor(arg) {
        super(arg);

        if (arg) { // only overide new Date();
          return new RealDate(arg);
        }
        return new RealDate(isoDate);
      }
    };
  };

  afterEach(() => {
    global.Date = RealDate;
  });

  const message = createNewMessage('Response message 1');
  const srcVideo = createVideoSnippet({ title: 'video', video: 'video' });
  const srcImage = createImageSnippet({
    title: 'image',
    image: 'image',
    dims: { width: 100, height: 100 }
  });
  /* eslint-disable react/prop-types */
  const Dummy = ({ text }) => <div>{text}</div>;
  /* eslint-enable */
  const customComp = createComponentMessage(Dummy, {
    text: 'This is a Dummy Component!'
  });
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
        payload: 'http://www.google.ca'
      }
    ]
  });

  const responseMessages = List([
    message,
    srcVideo,
    srcImage,
    customComp,
    buttons
  ]);


  it('should render a Message component', () => {
    render(
      <Provider store={store}>
        <Messages.WrappedComponent messages={responseMessages} customComponent={Dummy} />
      </Provider>
    );
    // Adjust the query as per how the Message component renders its content
    expect(screen.getByText('Response message 1')).toBeInTheDocument();
  });

  // it('should render a Video component', () => {
  //   expect(messagesComponent.find(Video)).toHaveLength(1);
  // });

  // it('should render a Image component', () => {
  //   expect(messagesComponent.find(Image)).toHaveLength(1);
  // });

  // it('should render a custom component', () => {
  //   expect(messagesComponent.find('Connect(Dummy)')).toHaveLength(1);
  // });

  // it('should render a Buttons component', () => {
  //   expect(messagesComponent.find(Buttons)).toHaveLength(1);
  // });

  // describe('-- showMessageDate', () => {
  //   const today = new Date('2019-01-15T12:00:00');
  //   const createComponent = (showMessageDate, messageToRender = message) =>
  //     shallow(
  //       (<Messages.WrappedComponent
  //         messages={List([
  //           messageToRender
  //         ])}
  //         customComponent={Dummy}
  //         showMessageDate={showMessageDate}
  //       />)
  //     );

  //   it('should not render message\'s date', () => {
  //     expect(createComponent(false).find('.rw-message-date')).toHaveLength(0);
  //   });

  //   it('should render today\'s time', () => {
  //     mockDate(today);
  //     const messageToRender = createNewMessage('Response message 1');
  //     const renderedComponent = createComponent(true, messageToRender);
  //     const date = renderedComponent.find('.rw-message-date');
  //     expect(date).toHaveLength(1);
  //     expect(date.text()).toEqual(today.toLocaleTimeString('en-US', { timeStyle: 'short' }));
  //   });

  //   it('should render date and time', () => {
  //     const twoDaysAgo = new Date('2019-01-13T12:59:00');
  //     mockDate(twoDaysAgo);
  //     const messageToRender = createNewMessage('Response message 1');
  //     mockDate(today);
  //     const renderedComponent = createComponent(true, messageToRender);
  //     const date = renderedComponent.find('.rw-message-date');
  //     expect(date).toHaveLength(1);
  //     expect(date.text()).toEqual(`${twoDaysAgo.toLocaleDateString()} ${twoDaysAgo.toLocaleTimeString('en-US', { timeStyle: 'short' })}`);
  //   });

  //   it('should render custom date', () => {
  //     const renderedComponent = createComponent(() => 'custom date');
  //     const date = renderedComponent.find('.rw-message-date');
  //     expect(date).toHaveLength(1);
  //     expect(date.text()).toEqual('custom date');
  //   });
  // });
});
