import React, { Component } from "react";
import { Input } from 'antd'
import { reqDocumentDetail } from '@/api'
import AddTags from '../add-tag'

import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./index.less";
const { TextArea } = Input;

class RichTextEidt extends Component {
  constructor(props) {
    super(props);
    const { id } = props
    let editorState;
    editorState = EditorState.createEmpty();
    // 初始化状态
    this.state = {
      editorState,
      title: "",
      htmlStr: "",
      desc: '',
      tags: []
    };
    if (id) {
      this.getDocument(id)
    }
    this.tagsRef = React.createRef();
  }
  getDocument = async (id) => {
    const res = await reqDocumentDetail(id)
    if (res.code === 0) {
      const { content, title, desc, tags } = res.data
      const blocksFromHtml = htmlToDraft(content);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );
      const editorState = EditorState.createWithContent(contentState);

      this.setState({
        title,
        desc,
        editorState,
        htmlStr: content,
        tags
      })
    }
  }
  // 清空表单数据
  clearValue = () => {
    const editorState = EditorState.createEmpty();
    this.setState({
      title: '',
      htmlStr: '',
      editorState,
      desc: ''
    })
  }
  // 简介文本域输入
  handleDescValue = (e) => {
    const desc = e.target.value;
    this.setState({
      desc,
    });
  }

  // 标题表单输入事件
  changeInputValue = (e) => {
    const title = e.target.value;
    this.setState({
      title,
    });
  };

  /*当输入改变时立即保存状态数据 */
  onEditorStateChange = (editorState) => {
    const htmlStr = draftToHtml(
      convertToRaw(this.state.editorState.getCurrentContent())
    );
    this.setState({ editorState, htmlStr });
  };
  // 父组件获取值
  getEditorValue() {
    const { title, htmlStr, desc } = this.state
    const tags = this.tagsRef.current.getTags()
    return {
      title,
      htmlStr,
      desc,
      tags
    };
  }
  render() {
    const { editorState, title, desc, tags } = this.state;
    return (
      <div className="rich_text_edit">
        <div className="doc_title">
          <input
            value={title}
            onInput={this.changeInputValue}
            type="text"
            placeholder="我的文章标题"
          />
        </div>
        <div className="doc_content">
          <div className="row">
            <h3>简介:</h3>
            <TextArea
              bordered={false}
              onChange={this.handleDescValue}
              value={desc}
              maxLength="500"
              placeholder="文章简介"
              showCount
              rows="4"
              style={{ width: "100%", resize: "none" }}
            />
          </div>
          <div className="row">
            <h3>添加标签：</h3>
            <AddTags tags={tags} ref={this.tagsRef} />
          </div>
          <div className="row">
            <h3>正文:</h3>
          </div>
          <Editor
            style={{ width: "100%" }}
            editorState={editorState}
            onEditorStateChange={this.onEditorStateChange}
          />
        </div>
      </div>
    );
  }
}

export default RichTextEidt;
