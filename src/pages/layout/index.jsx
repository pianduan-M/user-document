import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { connect } from 'react-redux'
import { receiveUser } from '@/redux/actions'
// 头部内容
import HeaderNav from "../../components/header";
// 主页内容
import Home from "../home";
// 文档详情
import DocDetail from '../doc-detail'
// 后台管理
import Admin from '../admin'
// tag 标签结果页
import Tags from '../tags'
// 登录
import Login from '../login/index'
// 资源
import Resources from '../resources'

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    // 把登录信息添加到 redux 中
    const { userid, receiveUser } = this.props
    if (!userid) {
      const userid = localStorage.getItem("userid")
      receiveUser(userid)
    }

    return (
      <div className="layout">
        {/* 头部 */}
        <HeaderNav />
        {/* 内容区 */}
        <Switch>
          <Route path="/login" component={Login}></Route>
          <Route path="/admin" component={Admin}></Route>
          <Route path="/doc-detail/:id" component={DocDetail} ></Route>
          <Redirect path="doc-detail/:id" to='/doc-detail/:id' ></Redirect>
          <Route path="/tags/:keyword" component={Tags}></Route>
          <Route path="/resources" component={Resources}></Route>
          <Route path="/" component={Home}></Route>
        </Switch>
      </div>
    );
  }
}

export default connect(state => ({ userid: state }), { receiveUser })(Layout);
