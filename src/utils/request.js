import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'

const service = axios.create({
    baseURL: '/',
    timeout: 30000
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        // Session 认证模式下无需手动附加 token，浏览器自动携带 Cookie
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
         * 兼容新返回格式：
         * { code: 200, message: '成功', data: ... }
         */
        if (res.code === 200) {
            return res
        }

        /**
         * 401：未登录或登录过期，跳转到登录页
         */
        if (res.code === 401) {
            Message({
                message: res.message || '登录已过期，请重新登录',
                type: 'warning',
                duration: 2000
            })
            // 清除本地登录状态
            localStorage.removeItem('loginUser')
            // 避免重复跳转
            if (router.currentRoute.path !== '/login') {
                router.push({ path: '/login', query: { redirect: router.currentRoute.fullPath } })
            }
            return Promise.reject(new Error(res.message || '未登录'))
        }

        /**
         * 兼容旧返回格式 ResultBean：
         * { success: true, message: '查询成功', resultList: [...] }
         */
        if (res.success === true) {
            const resultList = res.resultList || []
            const rawData = resultList.length === 1 ? resultList[0] : resultList

            const compatData =
                rawData && typeof rawData === 'object' && !Array.isArray(rawData)
                    ? { ...rawData }
                    : { data: rawData }

            compatData.success = true
            compatData.message = res.message || '操作成功'
            compatData.resultList = resultList
            compatData.pager = res.pager

            return {
                code: 200,
                success: true,
                message: res.message || '操作成功',
                resultList,
                pager: res.pager,
                data: compatData
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
        // HTTP 层面的 401（Spring Security 拦截时也会走这里）
        if (error.response && error.response.status === 401) {
            Message({
                message: '登录已过期，请重新登录',
                type: 'warning',
                duration: 2000
            })
            localStorage.removeItem('loginUser')
            if (router.currentRoute.path !== '/login') {
                router.push({ path: '/login', query: { redirect: router.currentRoute.fullPath } })
            }
            return Promise.reject(error)
        }

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
