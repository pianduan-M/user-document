import React, { Component } from 'react';
import { Card, Button, Modal, message, Table } from 'antd'
import AddForm from './add-form'
import {
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import { reqAddResourcesCate, reqResourcesDeleteCate, reqDeleteResources } from '@/api'
import QcEventEmitter from '@/utils/QcEventEmitter'
import './index.less'

function randomColor() {
  const r = Math.random() * 255
  const g = Math.random() * 255
  const b = Math.random() * 255
  const a = Math.random() * 1
  return `rgba(${r}, ${g}, ${b},${a})`
}


class ResourcesAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      currentResource: {}
    }
    // 表单头
    this.columns = [
      {
        title: '网站名称',
        render: resource => {
          return (
            <div className="resource_img">
              {
                resource.imageUrl ? <img src={resource.imageUrl} alt="" /> : <div style={{ background: randomColor() }} >{resource.name}</div>
              }
            </div>

          )
        }
      },
      {
        title: '网站名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '网站描述',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        width: 180,
        title: '操作',
        render: resource => {
          return <div className="resource_update_btn" >
            <Button type="primary" size="small" icon={<EditOutlined />} onClick={this.handleUpdateResource(resource)} >编辑</Button> &nbsp;
            <Button danger size="small" icon={<DeleteOutlined />} onClick={this.handleDeleteResource(resource)} >删除</Button>
          </div>
        }
      }
    ];
  }
  // 删除对应资源
  handleDeleteResource = (resource) => {
    return () => {
      Modal.confirm({
        content: "你真的要删除 " + resource.name + " 吗?",
        onOk: async () => {
          const { cate, id } = resource
          const res = await reqDeleteResources(cate, id)
          if (res.code === 0) {
            message.success(res.msg)
            QcEventEmitter.emit('getResourcesCate')

          } else {
            message.warning(res.msg)
          }
        }
      })
    }
  }
  // 编辑对应resource
  handleUpdateResource = (resource) => {
    return () => {
      this.setState({
        isModalVisible: true,
        currentResource: resource
      })
    }
  }
  // 打开添加资源分类对话框
  handleAddResources = () => {
    this.setState({
      isModalVisible: true,
      currentResource: {}
    })
  }
  // 关闭对话框
  handleCloseModal = () => {
    this.setState({
      isModalVisible: false,
      currentResource: {}
    })
  }

  // 删除资源分类
  handleDeleteResources = (cateName) => {
    return () => {
      Modal.confirm({
        content: '真的要删除 ' + cateName + ' 吗?',
        onOk: async () => {
          const res = await reqResourcesDeleteCate(cateName)
          if (res.code === 0) {
            message.success(res.msg)
            QcEventEmitter.emit('getResourcesCate')

          } else {
            message.warning(res.msg)
          }
        }
      })
    }

  }
  // 添加资源分类
  addResources = async () => {
    const { addResValue } = this.state
    if (!addResValue) return
    const res = await reqAddResourcesCate(addResValue)
    if (res.code === 0) {
      message.success(res.msg)
      this.setState({
        addResValue: ''
      })
      QcEventEmitter.emit('getResourcesCate')
    } else {
      message.warning(res.msg)
    }
  }
  render() {
    const { isModalVisible, currentResource } = this.state

    const pathname = this.props.match.params.name
    const resourceCate = this.props.resourcesCate.find(item => item.name === pathname)
    const cardTitle = (
      <div>
        <Button type="primary" onClick={this.handleAddResources}>添加资源分类</Button> &nbsp;
        <Button type="primary" danger onClick={this.handleDeleteResources}>删除资源分类</Button>
      </div>
    )
    return (
      <Card title={cardTitle} className="resources_admin">
        <Table bordered dataSource={resourceCate && resourceCate.children} rowKey="id" columns={this.columns} />;
        {/* 添加资源表单 */}
        <AddForm isModalVisible={isModalVisible} handleCloseModal={this.handleCloseModal} resource={currentResource} />
      </Card>
    );
  }
}

export default ResourcesAdmin;