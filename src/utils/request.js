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

        /**
         * 兼容旧返回格式：
         * {
         *   code: 200,
         *   message: '成功',
         *   data: ...
         * }
         */
        if (res.code === 200) {
            return res
        }

        /**
         * 兼容新返回格式 ResultBean：
         * {
         *   success: true,
         *   message: '查询成功',
         *   resultList: [...]
         * }
         */
        if (res.success === true) {
            const resultList = res.resultList || []

            return {
                code: 200,
                success: true,
                message: res.message || '操作成功',
                resultList: resultList,
                pager: res.pager,

                // 兼容原来页面使用 res.data 的写法
                data: resultList.length === 1 ? resultList[0] : resultList
            }
        }

        const message = res.message || '请求失败'

        Message({
            message,
            type: 'error',
            duration: 3000
        })

        return Promise.reject(new Error(message))
    },
    error => {
        const message =
            error.response?.data?.message ||
            error.message ||
            '网络异常'

        Message({
            message,
            type: 'error',
            duration: 3000
        })

        return Promise.reject(error)
    }
)

export default service