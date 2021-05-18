// 解析dom
export default function parseDomFn(doc, type = "md") {
  var result = []
  var menuList = []
  function parseDom(node) {
    if (!node) return
    let atr = ''
    // 解析attr 属性
    if (node.attributes.length > 0) {
      for (let i = 0; i < node.attributes.length; i++) {
        const item = node.attributes[i]
        if (item.localName !== 'id') {
          atr += ` ${item.localName}='${item.nodeValue}'`
        }
      }
    }
    let htmlStr = '';
    if (/^h[\d*]$/.test(node.localName)) {
      var id = node.innerText
      //去重
      for (let i = 0; i < menuList.length; i++) {
        const item = menuList[i]
        if (item.id === id) {
          id = id + "1"
        }

      }
      menuList.push({
        title: node.innerText,
        level: node.localName.substring(1),
        id,
      })
      htmlStr = `<${node.localName} ${atr} id="${id}">${node.innerHTML}</${node.localName}>`

    } else {
      htmlStr = `<${node.localName}${atr}>${node.innerHTML}</${node.localName}>`
    }
    return htmlStr

  }
  for (let i = 0; i < doc.all.length; i++) {
    // 根据编辑器选择不同节点
    const item = doc.body.children[i]
    result.push(parseDom(item))

  }
  return {
    content: result.join(""),
    menuList
  }
};
