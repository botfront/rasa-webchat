export function onRemove(element, callback) {
  const parent = element.parentNode;
  if (!parent) throw new Error('The node must already be attached');

  const obs = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.removedNodes.forEach((el) => {
        if (el === element) {
          obs.disconnect();
          callback();
        }
      });
    });
  });
  obs.observe(parent, {
    childList: true
  });
}
