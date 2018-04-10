import { store } from '../store';
import * as actions from './index';

export function addUserMessage(text) {
  store.dispatch(actions.addUserMessage(text));
}

export function addResponseMessage(text) {
  store.dispatch(actions.addResponseMessage(text));
}

export function addLinkSnippet(link) {
  store.dispatch(actions.addLinkSnippet(link));
}

export function addQuickReply(quickReply) {
  store.dispatch(actions.addQuickReply(quickReply));
}

export function setQuickReply(id, title) {
  store.dispatch(actions.setQuickReply(id, title));
}

export function insertUserMessage(id, text) {
  store.dispatch(actions.insertUserMessage(id, text));
}

export function renderCustomComponent(component, props, showAvatar = false) {
  store.dispatch(actions.renderCustomComponent(component, props, showAvatar));
}

export function toggleWidget() {
  store.dispatch(actions.toggleChat());
}

export function toggleInputDisabled() {
  store.dispatch(actions.toggleInputDisabled());
}

export function changeInputFieldHint(hint) {
  store.dispatch(actions.changeInputFieldHint(hint));
}

export function dropMessages() {
  store.dispatch(actions.dropMessages());
}
