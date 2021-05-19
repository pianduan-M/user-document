import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';
import {
  PieChartOutlined
} from '@ant-design/icons'

const { Sider } = Layout;

class AdminSider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
    }
  }
  static propTypes = {
    resourcesCate: PropTypes.array.isRequired
  }

  // 菜单栏跳转
  handleSderClick = (path) => {
    return () => {
      this.props.history.push(path)
    }
  }
  // 侧边栏收起
  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    const { selectedKeys, resourcesCate } = this.props
    return (
      <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
        <Menu defaultOpenKeys={['/admin/resources']} theme="dark" defaultSelectedKeys={selectedKeys} mode="inline">
          <Menu.Item key="/admin/document"  icon={<span className="iconfont icon-wendang" style={{ margin: '0 10px 0 0' }} ></span>} onClick={this.handleSderClick('/admin/document')} >
            文档管理
          </Menu.Item>
          <Menu.SubMenu key="/admin/resources" title="资源列表" icon={<span className="iconfont icon-huaban7" style={{ margin: '0 10px 0 0' }} ></span>} >
            {resourcesCate.map(item => (
              <Menu.Item key={"/admin/resources/" + item.name} icon={<span className="iconfont icon-kuangjiaguanli2" style={{ margin: '0 10px 0 0' }} ></span>} onClick={this.handleSderClick('/admin/resources/' + item.name)} >
                {item.name}
              </Menu.Item>
            ))}
          </Menu.SubMenu>
          <Menu.Item key="/admin/resources/cate"  icon={<span className="iconfont icon-kuangjiaguanli2" style={{ margin: '0 10px 0 0' }} ></span>} onClick={this.handleSderClick('/admin/resources/cate')} >
            资源分类
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

export default withRouter(AdminSider);