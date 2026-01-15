<template>
  <div class="sidebar-content">
    <div
      class="logo-container"
      @click="$emit('click-menu'); $router.push('/dashboard')"
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
        @select="$emit('click-menu')"
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
  </div>
</template>

<script setup>
import {
  Monitor,
  User,
  DataLine,
  Coin,
  Setting,
  Goods,
  Present,
  PieChart,
  Tools,
} from '@element-plus/icons-vue'

defineEmits(['click-menu'])
</script>

<style scoped>
.sidebar-content {
  height: 100%;
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

/* Menu Styling Override */
:deep(.el-menu) {
  border-right: none !important;
  background-color: transparent !important;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  height: 44px !important;
  line-height: 44px !important;
  margin: 4px 12px !important;
  border-radius: 8px;
  color: var(--text-primary) !important;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

:deep(.el-menu-item.is-active) {
  background-color: var(--el-color-primary) !important;
  color: #fff !important;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}
</style>
