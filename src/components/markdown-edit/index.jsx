import React, { Component } from "react";
import "./index.less";
import { Input } from "antd";
import showdown from "showdown";
import AddTags from '../add-tag'

const { TextArea } = Input;
class MarkdownEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      title: "",
      desc: "",
    };
    //创建实例
    this.converter = new showdown.Converter();
    this.tagsRef = React.createRef();
  }
  // 清空表单数据
  clearValue = () => {
    this.setState({
      title: '',
      value: '',
      desc: ""
    })
  }
  // 简介文本域输入事件
  handleDescValue = (e) => {
    const desc = e.target.value;
    this.setState({
      desc
    });
  };
  // 正文文本域输入事件
  handleTxetValue = (e) => {
    const value = e.target.value;
    this.setState({
      value,
    });
  };
  // 标题表单输入事件
  changeInputValue = (e) => {
    const title = e.target.value;
    this.setState({
      title,
    });
  };
  // 获取编辑器值
  getEditorValue() {
    const { value, desc } = this.state;
    const htmlStr = this.converter.makeHtml(value);
    const tags = this.tagsRef.current.getTags()
    return {
      title: this.state.title,
      htmlStr,
      desc,
      tags
    };
  }

  handleUpload = () => {
    console.log(this.uploadRef);
    const file = this.uploadRef.current.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (oFREvent) => {
      //读取完毕从中取值
      var pointsTxt = oFREvent.target.result;
      this.setState({
        value: pointsTxt,
      });
    };
  };

  render() {
    const { value, desc, title } = this.state;
    return (
      <div className="markdown_edit_container">
        <div className="markdown_content">
          <div className="doc_title">
            <input
              onInput={this.changeInputValue}
              type="text"
              placeholder="我的文章标题"
              value={title}
            />
          </div>
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
            <AddTags ref={this.tagsRef} />
          </div>
          <div className="row"><h3 style={{ marginTop: 10 }}> 正文:</h3></div>
          <TextArea
            className="markdown_text"
            bordered={false}
            autoSize
            onChange={this.handleTxetValue}
            value={value}
          />
        </div>
      </div>
    );
  }
}

export default MarkdownEdit;
