const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  global.localStorage = localStorageMock;

  global.matchMedia = global.matchMedia || function () {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {}
    };
  };
  
  // Polyfill for window.requestAnimationFrame
  global.requestAnimationFrame = global.requestAnimationFrame || function (callback) {
    setTimeout(callback, 0);
  };
  