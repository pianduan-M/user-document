export default function stringToHtml (str) {
  var dom = new DOMParser()
  var doc = dom.parseFromString(str, 'text/html')
  return doc
}