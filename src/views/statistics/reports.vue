<template>
  <div class="page-container">
    <div class="table-header">
      <div class="table-title">报表下载</div>
    </div>

    <div class="reports-container">
      <el-row :gutter="20">
        <el-col :span="8" v-for="report in reports" :key="report.id">
          <el-card class="report-card" shadow="hover">
            <div class="report-icon">
              <el-icon :size="40" :color="report.color"><Document /></el-icon>
            </div>
            <div class="report-info">
              <h3>{{ report.title }}</h3>
              <p>{{ report.desc }}</p>
            </div>
            <div class="report-action">
              <el-button
                type="primary"
                plain
                round
                size="small"
                @click="handleDownload(report)"
              >
                下载报表
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { exportToCSV } from '@/utils/export'

const reports = ref([
  {
    id: 1,
    title: '每日积分流水日报',
    desc: '包含每日积分发放与消耗详细记录',
    color: '#409EFF',
  },
  {
    id: 2,
    title: '会员增长周报',
    desc: '本周新注册会员及活跃度分析',
    color: '#67C23A',
  },
  {
    id: 3,
    title: '月度运营总结',
    desc: '全月积分运营数据汇总与趋势分析',
    color: '#E6A23C',
  },
  {
    id: 4,
    title: '商品兑换统计',
    desc: '热门商品兑换排行及库存预警',
    color: '#F56C6C',
  },
  {
    id: 5,
    title: '用户画像分析',
    desc: '会员等级分布与消费习惯画像',
    color: '#909399',
  },
])

const handleDownload = (report) => {
  ElMessage.success(`正在生成: ${report.title}...`)

  const headers = [
    { label: 'ID', key: 'id' },
    { label: '日期', key: 'date' },
    { label: '类别', key: 'category' },
    { label: '数值', key: 'amount' },
    { label: '用户', key: 'user' },
    { label: '状态', key: 'status' },
  ]

  // 生成与报表类型相关的数据
  const generateMockData = () => {
    switch (report.id) {
      case 1: // 每日积分流水日报
        return Array.from({ length: 50 }, (_, i) => ({
          id: i + 1,
          date: new Date().toISOString().slice(0, 10),
          category: ['积分发放', '积分消耗', '过期清零'][i % 3],
          amount: Math.floor(Math.random() * 500),
          user: `User-${Math.floor(Math.random() * 100)}`,
          status: '成功',
        }))
      case 2: // 会员增长周报
        return Array.from({ length: 30 }, (_, i) => ({
          id: i + 1,
          date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
          category: '新注册',
          amount: Math.floor(Math.random() * 50),
          user: `NewMember-${i}`,
          status: '已激活',
        }))
      case 4: // 商品兑换统计
        return Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          date: new Date().toISOString().slice(0, 10),
          category: '实物商品',
          amount: 1,
          user: `User-${Math.floor(Math.random() * 100)}`,
          status: ['待发货', '已发货'][i % 2],
        }))
      default:
        return Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          date: new Date().toISOString().slice(0, 10),
          category: '通用数据',
          amount: Math.floor(Math.random() * 1000),
          user: `User-${i}`,
          status: '正常',
        }))
    }
  }

  const mockData = generateMockData()

  exportToCSV(headers, mockData, report.title)
  ElMessage.success('下载完成')
}
</script>

<style scoped>
.page-container {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  min-height: calc(100vh - 120px);
}

.table-header {
  margin-bottom: 24px;
}

.table-title {
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
}

.report-card {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #ebeef5;
}

.report-icon {
  margin-bottom: 16px;
  background: #f5f7fa;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.report-info h3 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #303133;
}

.report-info p {
  margin: 0 0 20px;
  font-size: 13px;
  color: #909399;
  height: 40px; /* fixed height for alignment */
}
</style>
