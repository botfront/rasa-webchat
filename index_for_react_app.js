import ConnectedWidget, { NotConnectedWidget } from './src';
import {
  addUserMessage,
  addResponseMessage,
  addLinkSnippet,
  addVideoSnippet,
  addImageSnippet,
  addQuickReply,
  renderCustomComponent,
  isOpen,
  isVisible,
  openChat,
  closeChat,
  toggleChat,
  showChat,
  hideChat,
  toggleFullScreen,
  toggleInputDisabled,
  dropMessages,
  send
} from './src/store/actions/dispatcher';

export {
  ConnectedWidget as Widget,
  NotConnectedWidget,
  addUserMessage,
  addResponseMessage,
  addLinkSnippet,
  addVideoSnippet,
  addImageSnippet,
  addQuickReply,
  renderCustomComponent,
  isOpen,
  isVisible,
  openChat,
  closeChat,
  toggleChat,
  showChat,
  hideChat,
  toggleFullScreen,
  toggleInputDisabled,
  dropMessages,
  send
};
