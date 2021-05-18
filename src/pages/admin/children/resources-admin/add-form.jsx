import React, { PureComponent } from 'react';
import { Modal, Input, Form, Select, Upload, message } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { reqAddResources, reqUpdateResources } from '@/api'
import QcEventEmitter from '@/utils/QcEventEmitter'

const Option = Select.Option

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

class AddFrom extends PureComponent {
  constructor(props) {
    super(props);
    const { resource } = props
    if (resource.name) {
      this.state = {
        loading: false,
        ...resource
      }
    } else {
      this.state = {
        loading: false,
        imageUrl: '',
        url: '',
        name: '',
        cate: '',
        desc: ''
      }
    }
  }
  // 保存到后台
  saveResource = async () => {
    const { imageUrl, url, name, cate, desc } = this.state
    if (!name || !cate || !url) {
      message.warning("请填写 网站地址,名称,选择分类")
      return
    }
    // 根据是更新/添加 发送不同的后台请求
    let res
    if (this.isUpdate) {
      // 添加
      const id = this.props.resource.id
      res = await reqUpdateResources({ imageUrl, url, name, cate, desc, id })
    } else {
      // 添加
      res = await reqAddResources({ imageUrl, url, name, cate, desc })
    }

    // 处理结果
    if (res.code === 0) {
      message.success(res.msg)
      this.setState({
        imageUrl: '',
        url: '',
        name: '',
        cate: '',
        desc: '',
      })
      QcEventEmitter.emit('getResourcesCate')
    } else {
      message.warning(res.msg)
    }

  }

  // 图片上传控件
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  // 处理表单输入
  handleInputValue = (name) => {
    return (e) => {
      if (e.target) {
        const value = e.target.value
        this.setState({
          [name]: value
        })
      } else {
        this.setState({
          [name]: e
        })
      }

    }
  }
  // 处理对话框关闭
  handleCloseModal = () => {
    this.setState({
      loading: false,
      imageUrl: '',
      url: '',
      name: '',
      cate: '',
      desc: ''
    }, () => {
      // 通知父组件
      this.isUpdate = false
      this.props.handleCloseModal()
    })
  }
  componentDidUpdate() {
    const { resource } = this.props
    if (!this.isUpdate && resource.name && resource.name !== this.state.name) {
      this.setState({
        ...resource
      })
      // 标记此次是更新资源
      this.isUpdate = true
    }
  }

  render() {
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    }
    const { loading, imageUrl, name, desc, url, cate } = this.state;

    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );

    return (<Modal
      title="添加资源分类"
      visible={this.props.isModalVisible}
      onOk={this.saveResource}
      onCancel={this.handleCloseModal}
      okText="添加"
      cancelText="取消"
    >
      <Form
        {...layout}
        name="添加资源"
      >
        {/* 地址 */}
        <Form.Item
          label="网站地址"
        >
          <Input placeholder="http://" value={url} onChange={this.handleInputValue('url')} />
        </Form.Item>
        {/* 名字 */}
        <Form.Item
          label="资源名称"
        >
          <Input value={name} onChange={this.handleInputValue('name')} />
        </Form.Item>
        {/* 描述 */}
        <Form.Item
          label="描述"
        >
          <Input value={desc} onChange={this.handleInputValue('desc')} />
        </Form.Item>
        {/* 图标 */}
        <Form.Item
          label="图标"
        >
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            beforeUpload={beforeUpload}
            onChange={this.handleChange}
          >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        </Form.Item>
        {/* src图标 */}
        <Form.Item
          label="图标Src"
        >
          <Input value={imageUrl} onChange={this.handleInputValue('imageUrl')} />
        </Form.Item>

        <Form.Item
          label="资源分类"
        >
          <Select defaultValue={cate} placeholder="选择资源分类" style={{ width: 120 }} onChange={this.handleInputValue('cate')} key={Math.random()} >
            <Option value="开发资源">开发资源</Option>
            <Option value="框架官网">框架官网</Option>
            <Option value="UI官网" >UI官网</Option>
            <Option value="开发教程">开发教程</Option>
            <Option value="大神博客">大神博客</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>);
  }
}

export default AddFrom;