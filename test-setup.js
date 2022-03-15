/* eslint-disable func-names */
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from "react" 
React.useLayoutEffect = React.useEffect 

Enzyme.configure({ adapter: new Adapter() });
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener() {},
      removeListener() {}
    };
  };

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  function (callback) {
    setTimeout(callback, 0);
  };

Enzyme.configure({ adapter: new Adapter() });
