import React from 'react';
import { Provider } from 'react-redux';
import { Map } from 'immutable';
import { mount, shallow } from 'enzyme';

import LocalStorageMock from '../../../../mocks/localStorageMock';
import Launcher from '../components/Launcher';
import { initStore } from '../../../store/store';

const localStorage = new LocalStorageMock();
const stubSocket = jest.fn();
const store = initStore('dummy', 'dummy', stubSocket, localStorage);


describe('message target store affect app behavior', () => {
  const launcherCompoment = mount(
    <Provider store={store}>
      <Launcher
        toggle={() => { }}
        isChatOpen={false}
        fullScreenMode={false}
      />
    </Provider>
  );

  it('should render a tooltip', () => {
    store.dispatch({ type: 'SHOW_TOOLTIP', visible: true });
    store.dispatch({ type: 'ADD_NEW_RESPONSE_MESSAGE', text: 'hey' });
    launcherCompoment.update();
    expect(launcherCompoment.find('.rw-tooltip-body')).toHaveLength(1);
    expect(launcherCompoment.find('.rw-tooltip-body').text()).toEqual('hey');
  });
});
