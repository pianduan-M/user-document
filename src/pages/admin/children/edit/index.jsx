import React, { Component } from "react";
import { Button, Modal, message,BackTop } from "antd";
// 两个编辑器
import MarkdownEdit from "@/components/markdown-edit";
import RichTextEidt from "@/components/rich-text-edit";
// 转换工具
import stringToHtml from "@/utils/stringToHtml";
import parseDom from "@/utils/parseDom";
// 后台请求
import { reqAddDocment, reqUpdateDoc } from '@/api/index'
// 样式
import "./index.less";

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "md",
      docObj: {},
    };
    this.EditorRef = React.createRef();
  }
  // 上传服务器
  saveDoc = async () => {
    // 收集数据
    const doc = this.EditorRef.current.getEditorValue();
    const { desc, title, htmlStr, tags } = doc
    const { type } = this.state

    // 没值 直接返回
    if (!title || !htmlStr) {
      return message.error("空值！")
    }
    const htmlNode = stringToHtml(htmlStr);
    const parseResult = parseDom(htmlNode, type)
    const contentHtml = parseResult.content;
    const menuList = parseResult.menuList;
    const docObj = {
      title,
      menuList,
      desc,
      content: contentHtml,
      tags
    };
    // 如果有id 说明是更新文档
    if (this.id) {
      const res = await reqUpdateDoc(this.id, docObj)
      if (res.code === 0) {
        message.success('修改成功!')
        this.props.history.goBack()
      }
    } else {
      // 发送后台请求
      const res = await reqAddDocment(docObj)
      if (res.code === 0) {
        message.success("上传成功")
      }
    }

    // 清空表单数据
    this.EditorRef.current.clearValue()
  }
  // 切换编辑模式
  changeEditor = (type) => {
    return () => {
      // 提醒用户 切换会丢失当前内容
      Modal.confirm({
        title: "切换编辑器会丢失当前内容，是否继续？",
        autoFocusButton: "ok",
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          this.setState({
            type,
          });
        },
      });
    };
  };
  render() {
    const { type } = this.state;
    this.id = this.props.location.query ? this.props.location.query.id : null
    return (
      <div className="edit_container">
        <div className="edit_wrap">
          <div className="edit_tools_btn" style={{height:type === "text"?"":50}} >
            <div className="switch_eidt_btn">
              <Button
                type={type === "text" ? "primary" : ""}
                onClick={this.changeEditor("text")}
              >
                文本编辑
              </Button>
              &nbsp; &nbsp; &nbsp;
              <Button
                type={type !== "text" ? "primary" : ""}
                onClick={this.changeEditor("md")}
                disabled={this.id}
              >
                Markdown编辑
              </Button>
            </div>
            <div className="submit_btn">
              <Button type="primary" onClick={this.saveDoc} >{this.id ? "更新" : "发布"}</Button>
            </div>
          </div>

          <div className="edit_content" style={{paddingTop:type === "text"?"":20}} >
            {type === "text" ? (
              <RichTextEidt id={this.id} ref={this.EditorRef} />
            ) : (
              <MarkdownEdit ref={this.EditorRef} />
            )}
          </div>
        </div>
       
        <BackTop />
      </div>
    );
  }
}

export default Edit;
