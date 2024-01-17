// jest.setup.js
import '@testing-library/jest-dom'
// Polyfill for window.matchMedia
global.window = global;
window.addEventListener = () => {};
window.matchMedia = window.matchMedia || function() {
    return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
    };
};


// Polyfill for window.requestAnimationFrame
window.requestAnimationFrame = global.requestAnimationFrame || function (callback) {
  setTimeout(callback, 0);
};

