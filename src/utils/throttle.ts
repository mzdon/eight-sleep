export const throttle = (
  func: Function,
  limit: number,
): ((...args: any[]) => unknown) => {
  let lastFunc = 0;
  let lastRan = 0;
  return function () {
    // @ts-ignore
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};
