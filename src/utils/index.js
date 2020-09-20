export function debounce(fn, wait, immediate) {
  let timeout, result;
  let bounced = function() {
    let context = this;
    let args = arguments;
    let callnow = !timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    if (immediate) {
      timeout = setTimeout(() => {
        timeout = null;
      });
      if (callnow) {
        result = fn.apply(context, args);
        return result;
      }
    } else {
      timeout = setTimeout(function() {
        result = fn.apply(context, args);
        return result;
      }, wait);
    }
  };
  return bounced;
}
