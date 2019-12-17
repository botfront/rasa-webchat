import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import Sender from '../components/Conversation/components/Sender';
import { store, initStore } from '../../../store/store';


describe('Metadata store affect input behavior', () => {
  class LocalStorageMock {
    constructor() {
      this.store = {};
    }

    clear() {
      this.store = {};
    }

    getItem(key) {
      return this.store[key] || null;
    }

    setItem(key, value) {
      this.store[key] = value.toString();
    }

    removeItem(key) {
      delete this.store[key];
    }
  }

  const localStorage = new LocalStorageMock();
  const stubSocket = jest.fn();
  initStore('dummy', 'dummy', stubSocket, localStorage);
  const senderCompoment = mount(
    <Provider store={store}>
      <Sender
        sendMessage={() => {}}
        inputTextFieldHint="dummy"
        disabledInput={false}
      />
    </Provider>
  );

  beforeEach(() => { store.dispatch({ type: 'CLEAR_METADATA' }); });

  it('should disable the input', () => {
    expect(senderCompoment.find('.new-message')).toHaveLength(1);
    expect(senderCompoment.find('.new-message').prop('disabled')).toEqual(false);
    store.dispatch({ type: 'SET_USER_INPUT', userInputState: 'disable' });
    expect(senderCompoment.find('.new-message')).toHaveLength(1);
    expect(senderCompoment.find('.new-message').prop('disabled')).toEqual(true);
  });


  it('should hide the input', () => {
    expect(senderCompoment.find('.new-message')).toHaveLength(1);
    expect(senderCompoment.find('.new-message').prop('disabled')).toEqual(false);
    store.dispatch({ type: 'SET_USER_INPUT', userInputState: 'hide' });
    expect(senderCompoment.find('.new-message')).toHaveLength(0);
  });
});

