import React, { Component } from "react";
import "./index.less";
import { Input, Row, Col } from "antd";
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
      htmlStr: ''
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
    const htmlStr = this.converter.makeHtml(value);
    this.setState({
      value,
      htmlStr
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
    const { desc, htmlStr } = this.state;
    const tags = this.tagsRef.current.getTags()
    return {
      title: this.state.title,
      htmlStr,
      desc,
      tags
    };
  }

  handleUpload = () => {
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
    const { value, desc, title, htmlStr } = this.state;
    return (
      <Row className="markdown_edit_container">
        <Col className="markdown_content" xs={24} sm={24} md={24} lg={16} xl={15} xxl={15} >
          <div className="content_head">
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
              <AddTags ref={this.tagsRef} />
            </div>
          </div>


          <div className="row"><h3 style={{ marginTop: 10 }}> 正文:</h3></div>

          <TextArea
            className="markdown_text"
            bordered={false}
            autoSize
            onChange={this.handleTxetValue}
            value={value}
            placeholder="文章正文。。。。。。"
          />
        </Col>

        <Col xs={24} sm={24} md={24} lg={9} xl={9} xxl={9} >
          <div className="content_preview_wrap markdown-body" >
            {htmlStr.length > 0 ? "" : <div  className="row"><h3>预览:</h3></div>}
            <div className="content_preview " dangerouslySetInnerHTML={{ __html: htmlStr }} >
            </div>
          </div>
        </Col>
      </Row >
    );
  }
}

export default MarkdownEdit;
