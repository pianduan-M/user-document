export default function createMenuList(doc) {

  const menuList = []
  // var categoryId = -1
  // var subCategoryId = -1
  // var thirdlyCategoryID = -1

  function createMenu(node) {
    // 如果是 标题
    if (/^h[\d*]$/.test(node.localName)) {
      let id = node.innerText
      menuList.push({
        title: id,
        level: node.localName
      })

      // return `<${node.localName}  ></${node.localName}>`
      // 一级id
      // if (node.localName === 'h1') {
      //   menuList.push({
      //     id,
      //     title: node.innerText,
      //     children: []
      //   })
      //   subCategoryId = -1
      //   thirdlyCategoryID = -1
      //   categoryId++
      // }
      // // 二级id
      // if (node.localName === 'h2') {
      //   // 当第一个不是h1 元素 自动创建一个空的对象
      //   if (categoryId === -1) {
      //     categoryId++
      //     menuList[categoryId] = {
      //       title: '',
      //       id: '',
      //       children: []
      //     }
      //   }
      //   // 
      //   if (menuList[categoryId].children.children) {
      //     menuList[categoryId].children = []
      //   }
      //   subCategoryId++

      //   menuList[categoryId].children[subCategoryId] = {
      //     id,
      //     title: node.innerText,
      //     children: []
      //   }
      // }
      // // h3标题以下 都标为三级id
      // if (Number(node.localName.slice(1)) >= 3) {
      //   thirdlyCategoryID++
      //   // 如果当前没有一级分类
      //   if (categoryId === -1) {
      //     categoryId++
      //     menuList[categoryId] = {
      //       title: '',
      //       children: []
      //     }
      //     // 如果没有二级分类
      //     if (subCategoryId === -1) {
      //       subCategoryId++
      //       menuList[categoryId].children = [{
      //         title: '',
      //         children: []
      //       }]
      //     }
      //   }
      //   menuList[categoryId].children[subCategoryId] = {
      //     id,
      //     title: node.innerText
      //   }
      // }
    }
  }
  for (let i = 3; i < doc.all.length; i++) {
    const item = doc.all[i]
    createMenu(item)
  }
  return menuList
}