import React from 'react';
import { List } from 'immutable';
import { shallow } from 'enzyme';

import {
  createNewMessage,
  createVideoSnippet,
  createImageSnippet,
  createComponentMessage,
  createQuickReply
} from 'helper';

import Messages from '../index';
import Video from '../components/VidReply';
import Image from '../components/ImgReply';
import Message from '../components/Message';
import QuickReply from '../components/QuickReply';

describe('<Messages />', () => {
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
        payload: 'http://www.google.ca'
      }
    ]
  });

  const responseMessages = List([
    message,
    srcVideo,
    srcImage,
    customComp,
    quickReply
  ]);

  const messagesComponent = shallow(
    <Messages.WrappedComponent
      messages={responseMessages}
      customComponent={Dummy}
    />
  );

  it('should render a Message component', () => {
    expect(messagesComponent.find(Message)).toHaveLength(1);
  });

  it('should render a Video component', () => {
    expect(messagesComponent.find(Video)).toHaveLength(1);
  });

  it('should render a Image component', () => {
    expect(messagesComponent.find(Image)).toHaveLength(1);
  });

  it('should render a custom component', () => {
    expect(messagesComponent.find('Connect(Dummy)')).toHaveLength(1);
  });

  it('should render a QuickReply component', () => {
    expect(messagesComponent.find(QuickReply)).toHaveLength(1);
  });

  describe('-- showMessageDate', () => {
    const today = new Date('2019-01-15T12:00:00');
    const createComponent = (showMessageDate, messageToRender = message) =>
      shallow(
        (<Messages.WrappedComponent
          messages={List([
            messageToRender
          ])}
          customComponent={Dummy}
          showMessageDate={showMessageDate}
        />)
      );

    it('should not render message\'s date', () => {
      expect(createComponent(false).find('.rw-message-date')).toHaveLength(0);
    });

    it('should render today\'s time', () => {
      mockDate(today);
      const messageToRender = createNewMessage('Response message 1');
      const renderedComponent = createComponent(true, messageToRender);
      const date = renderedComponent.find('.rw-message-date');
      expect(date).toHaveLength(1);
      expect(date.text()).toEqual(today.toLocaleTimeString('en-US', { timeStyle: 'short' }));
    });

    it('should render date and time', () => {
      const twoDaysAgo = new Date('2019-01-13T12:59:00');
      mockDate(twoDaysAgo);
      const messageToRender = createNewMessage('Response message 1');
      mockDate(today);
      const renderedComponent = createComponent(true, messageToRender);
      const date = renderedComponent.find('.rw-message-date');
      expect(date).toHaveLength(1);
      expect(date.text()).toEqual(`${twoDaysAgo.toLocaleDateString()} ${twoDaysAgo.toLocaleTimeString('en-US', { timeStyle: 'short' })}`);
    });

    it('should render custom date', () => {
      const renderedComponent = createComponent(() => 'custom date');
      const date = renderedComponent.find('.rw-message-date');
      expect(date).toHaveLength(1);
      expect(date.text()).toEqual('custom date');
    });
  });
});
