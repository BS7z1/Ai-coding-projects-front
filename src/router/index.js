import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/components/Layout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/business/beijing',
    children: [
      {
        path: 'business/beijing',
        name: 'Beijing',
        component: () => import('@/modules/xxxxmgr/modules/beijing/modules/beijing-mgr/pages/Beijing.vue'),
        meta: { title: '北京' }
      },
      {
        path: 'business/codegen',
        name: 'CodeGen',
        component: () => import('@/modules/xxxxmgr/modules/codemgr/modules/codemgr/pages/CodeGen.vue'),
        meta: { title: '代码生成' }
      },
      // ============ 信贷借据台账管理（申请岗） ============
      {
        path: 'business/loan-ledger',
        name: 'LoanLedger',
        component: () => import('@/modules/xxxxmgr/modules/beijing/modules/loan-ledger/pages/LoanLedger.vue'),
        meta: { title: '借据台账管理' }
      },
      // ============ 借据复核审批（复核岗） ============
      {
        path: 'business/loan-review',
        name: 'LoanReview',
        component: () => import('@/modules/xxxxmgr/modules/beijing/modules/loan-ledger/pages/LoanReview.vue'),
        meta: { title: '借据复核审批' }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
