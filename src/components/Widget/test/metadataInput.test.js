import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import Sender from '../components/Conversation/components/Sender';
import { initStore } from '../../../store/store';
import LocalStorageMock from '../../../../mocks/localStorageMock';

const localStorage = new LocalStorageMock();
const stubSocket = jest.fn();
const store = initStore('dummy', 'dummy', stubSocket, localStorage);

describe('Metadata store affect input behavior', () => {
  const senderCompoment = mount(
    <Provider store={store}>
      <Sender
        sendMessage={() => {}}
        inputTextFieldHint="dummy"
        disabledInput={false}
      />
    </Provider>
  );

  beforeEach(() => {
    store.dispatch({ type: 'CLEAR_METADATA' });
    senderCompoment.update(); // propagate new store to the compoment
  });

  it('should disable the input', () => {
    expect(senderCompoment.find('.rw-new-message')).toHaveLength(1);
    expect(senderCompoment.find('.rw-new-message').prop('disabled')).toEqual(false);
    store.dispatch({ type: 'SET_USER_INPUT', userInputState: 'disable' });
    senderCompoment.update(); // propagate new store to the compoment
    expect(senderCompoment.find('.rw-new-message')).toHaveLength(1);
    expect(senderCompoment.find('.rw-new-message').prop('disabled')).toEqual(true);
  });


  it('should hide the input', () => {
    expect(senderCompoment.find('.rw-new-message')).toHaveLength(1);
    expect(senderCompoment.find('.rw-new-message').prop('disabled')).toEqual(false);
    store.dispatch({ type: 'SET_USER_INPUT', userInputState: 'hide' });
    senderCompoment.update(); // propagate new store to the compoment
    expect(senderCompoment.find('.rw-new-message')).toHaveLength(0);
  });
});

