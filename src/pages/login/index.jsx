import React, { Component } from 'react';
import { reqLogin } from '@/api'
import './index.less'
import { Form, Input, Button, message } from 'antd';
import { connect } from 'react-redux'
import { receiveUser } from '@/redux/actions'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  toLogin = async (value) => {
    const { username, password } = value
    const res = await reqLogin(username, password)
    if (res.status === 200) {
      const { token, userid } = res
      localStorage.setItem("token", token)
      localStorage.setItem("userid", userid)
      this.props.receiveUser(userid)
      message.success("登录成功!")
      this.props.history.goBack()
    }

  }
  render() {
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    

    return (
      <div className="login">
        <div className="login_main">
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={this.toLogin}
          // onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="用户名:"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { max: 18, message: '密码最长18位' },
                { min: 6, message: '密码最短6位' },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item className="submit_btn" wrapperCol={{ span: 20 }} >
              <Button type="primary" htmlType="submit">
                Submit
        </Button>
            </Form.Item>
          </Form>
        </div>
      </div >
    );
  }
}

export default connect(state => ({ userid: state }), { receiveUser })(Login)