import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import LocalStorageMock from '../../../../mocks/localStorageMock';
import Launcher from '../components/Launcher';
import { store, initStore } from '../../../store/store';

describe('message target store affect app behavior', () => {
  const localStorage = new LocalStorageMock();
  const stubSocket = jest.fn();
  initStore('dummy', 'dummy', stubSocket, localStorage);

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
    store.dispatch({ type: 'SET_TOOLTIP_MESSAGE', tooltipMessage: 'hey' });
    launcherCompoment.update();
    expect(launcherCompoment.find('.tooltip-body')).toHaveLength(1);
    expect(launcherCompoment.find('.tooltip-body').text()).toEqual('hey');
  });
});
