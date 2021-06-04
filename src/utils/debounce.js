export default function debounce(fn, delay) {
  let timeout
  return function () {
    const context = this
    const args = arguments
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      fn.apply(context, args)
    }, delay)
  }
}