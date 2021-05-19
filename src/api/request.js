import axios from 'axios'
import { message } from 'antd'
import store from '../redux/store'
import { receiveUser } from '../redux/actions'

let instance = axios.create({
  headers: {
    // 'content-type': 'application/x-www-form-urlencoded'
  }
})


// 响应拦截 如果返回403 跳转登录页面
instance.interceptors.response.use(response => {
  if (response.data.status === 403) {
    message.warning(response.data.msg)
    localStorage.removeItem('userid')
    localStorage.removeItem('token')
    store.dispatch(receiveUser(''))
  }
  return response
})
// 请求响应器 携带token
instance.interceptors.request.use(config => {
  const token = localStorage.getItem("token") || ''
  if (token) {
    config.headers.token = token
  }
  return config
})

export default function ajax(url, data = {}, type = "GET") {

  // 统一成大写
  type = type.toLocaleUpperCase()
  // 保存请求返回的response
  let promise

  return new Promise((resolve, reject) => {
    message.loading("加载中")
    // get 请求
    if (type === 'GET') {
      promise = instance.get(url, {
        params: data
      })
    } else { // post 请求
      promise = instance.post(url, data)
    }

    // 统一处理错误 如果成功 调用resolve 把返回值传出去 如果失败 直接提示异常信息 

    promise.then(res => {
      message.destroy()
      resolve(res.data)
    })
      .catch(err => {
        message.error(err.message)
      })
  })
}