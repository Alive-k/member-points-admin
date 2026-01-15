<template>
  <div class="common-layout">
    <el-container class="app-wrapper">
      <!-- Sidebar -->
      <el-aside width="240px" class="sidebar-container">
        <div
          class="logo-container"
          @click="$router.push('/dashboard')"
          style="cursor: pointer"
        >
          <div class="logo-icon">
            <el-icon><Monitor /></el-icon>
          </div>
          <span class="logo-text">Member Admin</span>
        </div>
        <el-scrollbar>
          <el-menu
            router
            :default-active="$route.path"
            class="el-menu-vertical"
            :unique-opened="true"
          >
            <div class="menu-category">MAIN</div>

            <el-menu-item index="/dashboard">
              <el-icon><DataLine /></el-icon>
              <span>首页</span>
            </el-menu-item>

            <el-sub-menu index="/member">
              <template #title>
                <el-icon><User /></el-icon>
                <span>会员管理</span>
              </template>
              <el-menu-item index="/member/list">会员列表</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/points">
              <template #title>
                <el-icon><Coin /></el-icon>
                <span>积分管理</span>
              </template>
              <el-menu-item index="/points/account">积分账户</el-menu-item>
              <el-menu-item index="/points/flow">积分流水</el-menu-item>
            </el-sub-menu>

            <div class="menu-category">OPERATION</div>

            <el-sub-menu index="/rules">
              <template #title>
                <el-icon><Setting /></el-icon>
                <span>积分规则</span>
              </template>
              <el-menu-item index="/rules/get">获取规则</el-menu-item>
              <el-menu-item index="/rules/use">消耗规则</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/mall">
              <template #title>
                <el-icon><Goods /></el-icon>
                <span>积分商城</span>
              </template>
              <el-menu-item index="/mall/goods">商品管理</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/activity">
              <template #title>
                <el-icon><Present /></el-icon>
                <span>运营活动</span>
              </template>
              <el-menu-item index="/activity/checkin">签到配置</el-menu-item>
            </el-sub-menu>

            <div class="menu-category">SYSTEM</div>

            <el-sub-menu index="/statistics">
              <template #title>
                <el-icon><PieChart /></el-icon>
                <span>数据统计</span>
              </template>
              <!-- Placeholder for other stats -->
              <el-menu-item index="/statistics/reports">报表下载</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/system">
              <template #title>
                <el-icon><Tools /></el-icon>
                <span>系统设置</span>
              </template>
              <el-menu-item index="/system/role">角色权限</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <!-- Main Content -->
      <el-container class="main-container">
        <el-header height="60px" class="navbar">
          <div class="navbar-left">
            <h2 class="page-title">{{ currentRouteName }}</h2>
          </div>
          <div class="navbar-right">
            <div class="search-wrapper">
              <el-icon class="search-icon"><Search /></el-icon>
              <input type="text" placeholder="Search..." class="search-input" />
            </div>
            <el-dropdown trigger="click" @command="handleCommand">
              <div class="avatar-wrapper">
                <el-avatar
                  :size="36"
                  src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                />
                <div class="user-info">
                  <span class="user-name">Admin</span>
                  <span class="user-role">Super Admin</span>
                </div>
                <el-icon class="el-icon--right"><CaretBottom /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu class="user-dropdown">
                  <el-dropdown-item command="profile">
                    <el-icon><User /></el-icon>个人中心
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><SwitchButton /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <el-main class="app-main">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  CaretBottom,
  Monitor,
  Search,
  User,
  SwitchButton,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const currentRouteName = computed(() => {
  const map = {
    '/member/list': '会员列表',
    '/member/detail': '会员详情',
    '/points/account': '积分账户',
    '/points/flow': '积分流水',
    '/rules/get': '获取规则',
    '/rules/use': '消耗规则',
    '/mall/goods': '商品管理',
    '/activity/checkin': '签到配置',
    '/statistics/overview': '数据概览',
    '/system/role': '角色权限',
  }
  if (route.path.includes('/member/detail')) return '会员详情'
  return map[route.path] || 'Dashboard'
})

const handleCommand = (command) => {
  if (command === 'logout') {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    ElMessage.success('退出登录成功')
    router.push('/login')
  }
}
</script>

<style scoped>
.common-layout {
  height: 100vh;
  width: 100vw;
  background-color: var(--bg-color);
}

.app-wrapper {
  height: 100%;
  width: 100%;
}

.sidebar-container {
  background: var(--sidebar-bg);
  backdrop-filter: var(--sidebar-backdrop);
  height: 100%;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  z-index: 10;
  display: flex;
  flex-direction: column;
}

.logo-container {
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 24px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: var(--el-color-primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-right: 12px;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.menu-category {
  padding: 16px 24px 8px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 1px;
}

.main-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: var(--bg-color);
}

.navbar {
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  z-index: 9;
  height: 80px !important;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.5px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--text-secondary);
  font-size: 16px;
}

.search-input {
  border: none;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 10px 16px 10px 36px;
  border-radius: 20px;
  width: 200px;
  font-size: 14px;
  color: var(--text-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  width: 240px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s;
}

.avatar-wrapper:hover {
  background: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.user-info {
  display: flex;
  flex-direction: column;
  margin: 0 10px;
  line-height: 1.2;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
}

.user-role {
  font-size: 11px;
  color: var(--text-secondary);
}

.app-main {
  padding: 0 32px 32px;
  overflow-y: auto;
  flex: 1;
}

/* User Dropdown */
:global(.user-dropdown) {
  border-radius: 12px !important;
  padding: 8px !important;
  border: none !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
}

:global(.user-dropdown .el-dropdown-menu__item) {
  border-radius: 8px;
  margin-bottom: 2px;
  padding: 8px 16px;
}
</style>
