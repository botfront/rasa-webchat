export function onRemove(element, callback) {
  const obs = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.removedNodes.forEach((el) => {
        if (el.contains(element)) {
          obs.disconnect();
          callback();
        }
      });
    });
  });
  obs.observe(document, {
    childList: true,
    subtree: true
  });
}
