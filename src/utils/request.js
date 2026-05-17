import axios from 'axios'
import { Message } from 'element-ui'

const service = axios.create({
  baseURL: '/',
  timeout: 30000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 可在此添加 token 等认证信息
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      Message({
        message: res.message || '请求失败',
        type: 'error',
        duration: 3000
      })
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  error => {
    Message({
      message: error.message || '网络异常',
      type: 'error',
      duration: 3000
    })
    return Promise.reject(error)
  }
)

export default service
