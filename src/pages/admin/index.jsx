import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import { Layout } from 'antd';
import { reqResourcesCate } from '@/api'
import QcEventEmitter from '@/utils/QcEventEmitter'

import AdminDocument from './children/document'
import ResourcesAdmin from './children/resources-admin'
import ResourcesCate from './children/resources-admin/cate'
import AdminSider from '@/components/admin-sider'
// 文档编辑
import Edit from "./children/edit";
import './index.less'

import { connect } from 'react-redux'


const { Content } = Layout;

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resourcesCate: []
    }
  }
  //  
  getResourcesCate = async () => {
    const res = await reqResourcesCate()
    if (res.code === 0) {
      this.setState({
        resourcesCate: res.data
      })
    }
  }
  componentDidMount() {
    this.getResourcesCate()
    QcEventEmitter.addListener('getResourcesCate', this.getResourcesCate)
  }
  componentWillUnmount() {
    QcEventEmitter.removeListener("getResourcesCate", this.getResourcesCate)
  }
  render() {
    const { pathname } = this.props.location
    if (pathname === '/admin') {
      return <Redirect to="/admin/document" />
    }
    const { userid } = this.props
    if (!userid) {
      return <Redirect to="/login" />
    }
    return (
      <div className="admin">
        <Layout className="admin_container" >
          {/* 如果是文章写作页面就不需要侧边栏 */}
          {pathname.indexOf('edit') !== -1 ? null : <AdminSider resourcesCate={this.state.resourcesCate} selectedKeys={[pathname]} />}
          <Layout className="site-layout">
            <Content >
              <Switch>
                <Route path="/admin/edit" component={Edit}></Route>
                <Route path={'/admin/document'} component={AdminDocument} ></Route>
                <Route path={'/admin/resources/cate'} render={props => <ResourcesCate {...props} resourcesCate={this.state.resourcesCate} />} exact  ></Route>

                <Route path={'/admin/resources/:name'} render={props => <ResourcesAdmin {...props} resourcesCate={this.state.resourcesCate} />}></Route>
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default connect(
  state => ({ userid: state }),
)(Admin)