import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

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
        toggle={() => {}}
        isChatOpen={false}
        fullScreenMode={false}
      />
    </Provider>
  );

  it('should render a tooltip', () => {
    store.dispatch({ type: 'SHOW_TOOLTIP', visible: true });
    launcherCompoment.update();
    expect(launcherCompoment.find('.tooltip-body')).toHaveLength(1);
    expect(launcherCompoment.find('.tooltip-body').text()).toEqual('hey');
  });
});
