import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/components/Layout.vue'

Vue.use(VueRouter)

const routes = [
  // ============ 登录页（独立布局，不经过 Layout） ============
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', public: true }
  },

  // ============ 主应用（需要登录） ============
  {
    path: '/',
    component: Layout,
    redirect: '/beijing/loan-ledger',
    children: [
      // ============ 北京 > 信贷借据管理 ============
      {
        path: 'beijing/loan-ledger',
        name: 'LoanLedger',
        component: () => import('@/modules/xxxxmgr/modules/beijing/modules/loan-ledger/pages/LoanLedger.vue'),
        meta: { title: '借据台账管理' }
      },
      {
        path: 'beijing/loan-review',
        name: 'LoanReview',
        component: () => import('@/modules/xxxxmgr/modules/beijing/modules/loan-ledger/pages/LoanReview.vue'),
        meta: { title: '借据复核审批' }
      },
      // ============ 代码生成 ============
      {
        path: 'business/codegen',
        name: 'CodeGen',
        component: () => import('@/modules/xxxxmgr/modules/codemgr/modules/codemgr/pages/CodeGen.vue'),
        meta: { title: '代码生成' }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

// ============ 全局路由守卫：未登录跳转 /login ============
router.beforeEach((to, from, next) => {
  // public 路由（如登录页）直接放行
  if (to.meta && to.meta.public) {
    return next()
  }

  // 检查本地是否有登录信息（登录成功时写入 localStorage）
  const loginUser = localStorage.getItem('loginUser')
  if (!loginUser) {
    // 未登录，跳转到登录页，并记录来源页面（登录成功后可返回）
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  next()
})

export default router
