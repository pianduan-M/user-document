import React, { Component } from "react";
import { Button, Menu } from "antd";
import { MenuUnfoldOutlined, SearchOutlined } from "@ant-design/icons";
import Search from "../search";
import QcEventEmitter from '@/utils/QcEventEmitter.js'
import { withRouter, Link } from "react-router-dom";

// 引入样式
import "./index.less";
// logo图片链接
import imgSrc from "@/assets/images/logo.jpeg";

class HeaderNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSideBar: false, // 控制侧边菜单栏
      isSearch: false,
    };
  }
  // 移动端点击侧边菜单栏收起侧边菜单
  handleMenuClick = () => {
    this.setState({
      isSideBar: false
    })
  }

  // 打开搜索框
  openSearch = () => {
    this.setState({
      isSearch: true,
    });
    setTimeout(() => {
      this.inputRef.current.focus({
        cursor: "all",
      });
    });
  };
  createInputRef = (inputRef) => {
    this.inputRef = inputRef;
  };
  // 切换侧边栏菜单
  toggleSideBar = (isSideBar) => {
    return (e) => {
      // 阻止事件冒泡
      e && e.nativeEvent.stopImmediatePropagation();

      const { pathname } = this.props.location

      if (pathname.indexOf('doc-detail') !== -1) {
        QcEventEmitter.emit('toggleSideBar')
      } else {
        this.setState({
          isSideBar,
        });
      }

    };
  };
  // 关闭搜索对话框
  closeModelFun = () => {
    this.setState({
      isSearch: false,
    });
  };

  render() {
    const { isSideBar, isSearch } = this.state;
    const { pathname } = this.props.location
    return (
      <nav className="header-nav">
        {/* 导航 */}
        <div className={isSideBar ? "navbar_inner show" : "navbar_inner"}>
          <div className="left-nav">
            <Button
              icon={<MenuUnfoldOutlined />}
              className="navbar_toggle"
              onClick={this.toggleSideBar(true)}
            ></Button>
            <a href="/" className="">
              <img className="nav-logo" src={imgSrc} alt="头像" />
              <strong>片段</strong>
            </a>
          </div>
          <ul className="right-menu">
            <li className={"nav_item " + (pathname === '/' ? 'current' : '')} > <Link to={'/'}>首页</Link> </li>
            <li className={"nav_item " + (pathname === '/resources' ? 'current' : '')} ><Link to={'/resources'}>资源列表</Link></li>
            <li className={"nav_item " + (pathname.indexOf('admin') !== -1 ? 'current' : '')} ><Link to={'/admin'}>文档管理</Link></li>
            <li className="nav_item nav_search_wrap">
              <Button
                shape="round"
                className="nav_search_btn"
                icon={<SearchOutlined />}
                onClick={this.openSearch}
              >
                <span className="btn_text">搜索</span>
              </Button>
            </li>
          </ul>
          {/* 遮罩 */}
          <div
            className="sidebar_mask"
            onClick={this.toggleSideBar(false)}
          ></div>
          {/* 侧边导航 */}
          <div className="navbar_sidebar_wrap">
            <div className="left-nav">
              <a href="/" className="">
                <img className="nav-logo" src={imgSrc} alt="头像" />
                <strong>片段</strong>
              </a>
            </div>
            <Menu
              defaultSelectedKeys={[pathname]}
              mode="inline"
              className="sidebar_menu"
              onClick={this.handleMenuClick}
            >
              <Menu.Item key="/"><Link to={'/'}>首页</Link></Menu.Item>
              <Menu.Item key="/resources"><Link to={'/resources'}>资源列表</Link></Menu.Item>
              <Menu.Item key="/admin"><Link to={'/admin'}>文档管理</Link></Menu.Item>
            </Menu>
          </div>
        </div>
        {/* 搜索页 */}
        <Search
          isSearch={isSearch}
          closeModel={this.closeModelFun}
          createInputRef={this.createInputRef}
        />
      </nav>
    );
  }
}

export default withRouter(HeaderNav);
