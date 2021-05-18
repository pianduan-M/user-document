import React, { Component } from "react";
import { BackTop } from 'antd'
import List from "../../components/list/List";
import Card from "../../components/card/Card";
import { reqAllDocument } from '@/api/index'

import "./index.less";

class DocmentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewType: 0, // 0 表示卡片视图 1 列表视图
      docmentList: []
    };
  }
  // 切换显示模式
  toggleViewType = (viewType) => {
    return () => {
      this.setState({
        viewType,
      });
    };
  };
  // 获取文档数据
  getDocument = async () => {
    const res = await reqAllDocument()
    if (res.code === 0) {
      this.setState({
        docmentList: res.data
      })
    }
  }
  componentDidMount() {
    this.getDocument()
  }
  render() {
    const { viewType, docmentList } = this.state;
    return (
      <div className="doc_list">
        {/* 标题 */}
        <h1 className="doc_section_title">
          最新文档 &nbsp;
          <span className="new_icon">NEW</span>
        </h1>
        {/* 切换显示模式按钮 */}
        <div className="home_switch_wrap">
          <span
            className={
              !viewType ? "iconfont icon-gongge active" : "iconfont icon-gongge"
            }
            onClick={this.toggleViewType(0)}
          ></span>
          <span
            className={
              viewType
                ? "iconfont icon-streamlist active"
                : "iconfont icon-streamlist"
            }
            onClick={this.toggleViewType(1)}
          ></span>
        </div>
        {/* home_posts_page */}
        <div className="home_posts_container">
          {viewType ? <List data={docmentList} /> : <Card data={docmentList} />}
        </div>
        <BackTop />
      </div>
    );
  }
}

export default DocmentList;
