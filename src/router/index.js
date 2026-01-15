import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../layout/index.vue'

const routes = [
  {
    path: '/login',
    component: () => import('../views/login/index.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('../views/statistics/overview.vue'),
        meta: { title: '首页' },
      },
      {
        path: 'member/list',
        component: () => import('../views/member/list.vue'),
        meta: { title: '会员列表' },
      },
      {
        path: 'member/detail/:id',
        component: () => import('../views/member/detail.vue'),
        meta: { title: '会员详情' },
      },
      {
        path: 'points/account',
        component: () => import('../views/points/account.vue'),
        meta: { title: '积分账户' },
      },
      {
        path: 'points/flow',
        component: () => import('../views/points/flow.vue'),
        meta: { title: '积分流水' },
      },
      {
        path: 'rules/get',
        component: () => import('../views/rules/get.vue'),
        meta: { title: '获取规则' },
      },
      {
        path: 'rules/use',
        component: () => import('../views/rules/use.vue'),
        meta: { title: '消耗规则' },
      },
      {
        path: 'mall/goods',
        component: () => import('../views/mall/goods.vue'),
        meta: { title: '商品管理' },
      },
      {
        path: 'activity/checkin',
        component: () => import('../views/activity/checkin.vue'),
        meta: { title: '签到配置' },
      },
      {
        path: 'statistics/reports',
        component: () => import('../views/statistics/reports.vue'),
        meta: { title: '报表下载' },
      },
      {
        path: 'system/role',
        component: () => import('../views/system/role.vue'),
        meta: { title: '角色权限' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Route Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.path === '/login') {
    if (token) {
      next('/')
    } else {
      next()
    }
  } else {
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
