import React, { Component } from 'react';
import { Tag, message } from 'antd'
import './index.less'

class AddTags extends Component {
  constructor(props) {
    super(props);

    const tags = props.tags ? props.tags : []
    console.log(tags);
    const isAdd = props.isAdd || false
    this.inputWidth = props.inputWidth || 100
    this.state = {
      tags,
      isAdd
    }
  }
  // 添加tag
  handleAddTag = (e) => {
    if (e.keyCode === 13 || e._reactName === "onBlur") {
      this.updateAddTags(null, e)
    }
  }
  // 删除tag
  handleTagClose = (index) => {
    return () => {
      const { tags } = this.state
      tags.splice(index, 1)
      this.setState({
        tags
      })
    }
  }
  // 双击tag 修改tag
  handleEditTag = (index) => {
    return (e) => {
      const target = e.target
      // 
      if (target.className.indexOf('doc_tag') !== -1) {
        this.tagNodeClassName = target.className
        target.className = ''

        const input = document.createElement("input")
        input.value = target.innerText
        input.className = "tag_input"
        input.style.width = target.offsetWidth + 'px'
        input.style.height = target.offsetHeight + 'px'

        input.onkeyup = (e) => {
          if (e.key === 'Enter') {
            this.updateAddTags(index, e)
          }
        }
        input.onblur = (e) => {
          this.updateAddTags(index, e)
        }
        setTimeout(() => {
          input.focus()
        }, 100);
        // 保存节点 如果当前只是打开修改器 没有任何修改 需要重新插入
        this.tagInner = target.innerHTML
        this.tagNode = target
        target.innerHTML = ''
        target.appendChild(input)
      }
    }
  }
  // 更新tags state 函数
  updateAddTags = (index, e) => {
    const value = e.target.value.trim()
    if (!value) {
      this.setState({
        isAdd: false
      })
      return
    }
    const { tags } = this.state
    // 判断重复tag
    const tagIndex = tags.findIndex(item => item === value)
    if (tagIndex === -1) {
      if (index) {
        tags[index] = value
        // 添加成功 删除input
        e.target.remove()
      } else {
        tags.push(value)
      }
      // 更新state
      this.setState({
        tags,
        isAdd: false
      })
    } else {
      // 没有修改 不要提示
      if (e._reactName === "onBlur" || e.type === 'blur') {
        this.setState({
          isAdd: false,
        })
        e.target.remove()
        this.tagNode.innerHTML = this.tagInner
        this.tagNode.className = this.tagNodeClassName
      } else {
        // 如果有重复的提醒
        message.warning(value + ' 重复！')
      }
    }
  }
  // 给父组件返回tags
  getTags = () => {
    return this.state.tags
  }
  componentWillReceiveProps(nextProps) {
    const { tags } = nextProps
    if (tags) {
      this.setState({
        tags
      })
    }
  }
  render() {
    const { tags, isAdd } = this.state;
    return (
      <div className="doc_tags">
        {tags.map((item, index) => (<Tag className="doc_tag" color="blue" style={{ margin: 5 }} closable key={item} onDoubleClick={this.handleEditTag(index)} onClose={this.handleTagClose(index)} >{item}</Tag>))}
        {isAdd ?
          <input onBlur={this.handleAddTag} style={{ border: '1px solid #919191', width: this.inputWidth, margin: '0 5px', height: 21 }} type="text" onKeyUp={this.handleAddTag} />
          :
          <span onClick={() => this.setState({ isAdd: true })} className="tags_add_btn" ><span className="iconfont icon-add"></span> 添加标签</span>
        }

      </div>

    );
  }
}

export default AddTags;