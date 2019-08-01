import React from 'react';
import { List } from 'immutable';
import { shallow } from 'enzyme';

import { createNewMessage, createLinkSnippet, createVideoSnippet, createImageSnippet } from 'helper';
import { createComponentMessage } from 'utils/messages';

import Messages from '../index';
import Video from '../components/VidReply';
import Image from '../components/ImgReply';
import Message from '../components/Message';
import Snippet from '../components/Snippet';

describe('<Messages />', () => {
  const message = createNewMessage('Response message 1');
  const linkSnippet = createLinkSnippet({ title: 'link', link: 'link' });
  const srcVideo = createVideoSnippet({ title: 'video', video: 'video' });
  const srcImage = createImageSnippet({ title: 'image', image: 'image', dims: { 'width': 100, 'height': 100 } });
  /* eslint-disable react/prop-types */
  const Dummy = ({ text }) => <div>{text}</div>;
  /* eslint-enable */
  const customComp = createComponentMessage(Dummy, { text: 'This is a Dummy Component!' });

  const responseMessages = List([message, linkSnippet, srcVideo, srcImage, customComp]);

  const messagesComponent = shallow(
    <Messages.WrappedComponent
      messages={responseMessages}
      customComponent={Dummy}
    />
  );

  it('should render a Message component', () => {
    expect(messagesComponent.find(Message)).toHaveLength(1);
  });

  it('should render a Snippet component', () => {
    expect(messagesComponent.find(Snippet)).toHaveLength(1);
  });

  it('should render a Video component', () => {
    expect(messagesComponent.find(Video)).toHaveLength(1);
  });

  it('should render a Image component', () => {
    expect(messagesComponent.find(Image)).toHaveLength(1);
  });

  it('should render a custom component', () => {
    expect(messagesComponent.find(Dummy)).toHaveLength(1);
  });
});
