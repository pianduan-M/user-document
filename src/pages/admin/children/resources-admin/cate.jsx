import React, { Component } from 'react';
import { Card, Button, Modal, message, Table, Input } from 'antd'
import { reqAddResourcesCate, reqResourcesDeleteCate, reqDeleteResources } from '@/api'
import QcEventEmitter from '@/utils/QcEventEmitter'

class ResourcesCate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addResCateValue: '',
      isModalVisible: false
    }
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
      },
      {
        width: 200,
        title: '操作',
        render: resourcesCate => {
          return (
            <Button danger onClick={this.handleDeleteResourcesCate(resourcesCate)} >删除</Button>
          )
        }
      },
    ]
  }
  // 表单输入
  handleInputChange = (e) => {
    const addResCateValue = e.target.value
    this.setState({
      addResCateValue
    })
  }

  // 处理对话框关闭
  handleOpenOrCloseModal = (type) => {
    return () => {
      if (type === 'open') {
        this.setState({
          isModalVisible: true
        })
      } else {
        this.setState({
          addResCateValue: '',
          isModalVisible: false
        })
      }
    }
  }

  // 处理删除
  handleDeleteResourcesCate = (resourcesCate) => {
    return () => {
      let type
      // 判断类型 该表格下有两种类型 分类 跟 下属资源
      if (resourcesCate.cate) {
        type = 'resources'
      } else {
        type = 'cate'
      }

      Modal.confirm({
        content: '真的要删除 ' + resourcesCate.name + ' 吗?',
        onOk: () => {
          if (type === 'cate') {
            this.DeleteResourcesCate(resourcesCate.name)
          } else {
            this.DeleteResource(resourcesCate)
          }
        }
      })
    }
  }
  // 删除对应资源分类
  DeleteResourcesCate = async (cateName) => {
    const Resources = this.props.resourcesCate.find(item => item.name === cateName)
    if (Resources.children.length > 0) {
      message.warning('该分类下还有资源，不能删除！')
      return
    }
    const res = await reqResourcesDeleteCate(cateName)
    if (res.code === 0) {
      message.success(res.msg)
      QcEventEmitter.emit('getResourcesCate')
    } else {
      message.warning(res.msg)
    }
  }
  // 删除对应资源
  DeleteResource = async (resource) => {
    const { cate, id } = resource
    const res = await reqDeleteResources(cate, id)
    if (res.code === 0) {
      message.success(res.msg)
      QcEventEmitter.emit('getResourcesCate')
    } else {
      message.warning(res.msg)
    }
  }

  // 添加资源分类
  handleAddResourcesCate = async () => {
    const { addResCateValue } = this.state
    if (!addResCateValue) return
    const res = await reqAddResourcesCate(addResCateValue)
    if (res.code === 0) {
      message.success(res.msg)
      QcEventEmitter.emit('getResourcesCate')
      this.setState({
        addResCateValue: '',
        isModalVisible: false
      })
    } else {
      message.warning(res.msg)
    }
  }

  render() {
    const { isModalVisible, addResCateValue } = this.state
    return (
      <Card title={<Button type="primary" onClick={this.handleOpenOrCloseModal('open')}>添加资源分类</Button>} className="resources_admin">
        <Table bordered dataSource={this.props.resourcesCate} rowKey="name" columns={this.columns} />;

        <Modal
          title="添加资源分类"
          visible={isModalVisible}
          onOk={this.handleAddResourcesCate}
          onCancel={this.handleOpenOrCloseModal('close')}
          okText="添加"
          cancelText="取消"
        >
          <Input value={addResCateValue} onChange={this.handleInputChange} />
        </Modal>
      </Card>
    );
  }
}


export default ResourcesCate;