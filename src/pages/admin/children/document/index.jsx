import React, { Component } from 'react';
import { Card, message, Button, Modal, Tag } from 'antd';
import { Table } from 'antd';
import {
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import AddTag from '@/components/add-tag'

import { reqAllDocument } from '@/api'
import formatDate from '@/utils/formatDate.js'
import { reqDeleteDoc, reqUpdateDoc } from '@/api'


import './index.less'
class Document extends Component {
  constructor(props) {
    super(props);

    this.state = {
      docs: [],
      loading: false
    }

    this.columns = [
      {
        width: 200,
        title: '标题',
        dataIndex: 'title',
        editable: true,
        ellipsis: true
      },
      {
        title: '描述',
        dataIndex: 'desc',
        ellipsis: true
      },
      {
        width: 200,
        title: 'tags',
        dataIndex: 'tags',
        render: tags => {
          return <div>
            {tags.map(tag => <Tag key={tag} style={{ margin: "0 5px 5px 0" }} color="blue">{tag}</Tag>)}
          </div>
        }
      },
      {
        width: 150,
        title: '创建时间',
        dataIndex: 'createTime',
        render: createTime => {
          return formatDate(createTime)
        }
      },
      {
        width: 200,
        title: '操作',
        render: record => {
          return <div>
            <Button size="small" type="primary" style={{ fontSize: 12 }} icon={<EditOutlined />} onClick={this.handleEdit(record.id)} >编辑</Button> &nbsp;
            <Button size="small" danger type="default" icon={<DeleteOutlined />} style={{ fontSize: 12 }} onClick={this.handleDetele(record)} >删除</Button>
          </div>
        }
      },
    ];
    // 展开行
    this.expandable = {
      rowExpandable: record => record.title,
      expandedRowRender: record => (<div>
        <AddTag tags={record.tags} inputWidth={80} ref={this.tagsRef} />
        <Button size="small" style={{ fontSize: 12, margin: 5 }} onClick={this.saveTags(record.id)} >保存</Button>
      </div>)
    }
    // 创建ref 
    this.tagsRef = React.createRef()

  }
  // 编辑
  handleEdit = (id) => {
    return () => {
      this.props.history.push({ pathname: '/admin/edit', query: { id } })
    }
  }
  // 把编辑的tags保存到服务器
  saveTags = (id) => {
    return async () => {
      const tags = this.tagsRef.current.getTags()
      const res = await reqUpdateDoc(id, { tags })
      // 如果成功后
      if (res.code === 0) {
        message.success("添加成功")
        // 直接修改本地数据 不用网络请求
        const { docs } = this.state
        const index = docs.findIndex(item => item.id === id)
        if (index !== -1) {
          docs[index].tags = tags
          this.setState({
            docs
          })
        }
      }
    }
  }
  // 删除
  handleDetele = (doc) => {
  
    return () => {
      console.log(doc);
      Modal.confirm({
        content: '确定要删除 ' + doc.title + ' 吗?',
        okText: "确定",
        cancelText: '取消',
        onOk: async () => {
          const res = await reqDeleteDoc(doc.id)
          if (res.code === 0) {
            message.success("删除成功!")
            this.getDouments()
          } else {
            message.warning("删除失败!")
          }
        }
      })
    }
  }
  // 获取数据
  getDouments = async () => {
    // open loading
    this.setState({
      loading: true
    })
    const res = await reqAllDocument()
    // close loading
    this.setState({
      loading: false
    })
    // save data
    if (res.code === 0) {
      this.setState({
        docs: res.data
      })
    } else {
      message.error("获取数据失败!请刷新重试")
    }

  }
  // 获取数据
  componentDidMount() {
    this.getDouments()
  }

  render() {
    const { docs, loading } = this.state
    return (
      <Card title="文档列表" extra={<Button type="primary" href="/admin/edit" >写文章</Button>} className="admin_document" >
        <Table
          expandable={this.expandable}
          loading={loading} bordered columns={this.columns} dataSource={docs} rowKey="id" scroll={{ y: 800 }} />
      </Card>
    );
  }
}

export default Document;