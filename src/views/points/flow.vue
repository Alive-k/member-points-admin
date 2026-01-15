<template>
  <div class="page-container">
    <div class="table-header">
      <div class="table-title">积分流水</div>
      <div class="table-actions">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="date-picker"
        />
        <el-button type="primary" :icon="Download">导出记录</el-button>
      </div>
    </div>

    <div class="table-container">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="flowId" label="流水号" width="220">
          <template #default="scope">
            <span class="mono-text">{{ scope.row.flowId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="memberId" label="会员ID" width="120" />
        <el-table-column prop="type" label="业务类型" width="140">
          <template #default="scope">
            <el-tag :type="getTypeTag(scope.row.type)" effect="light" round>
              {{ scope.row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="变动值" width="140" align="right">
          <template #default="scope">
            <span
              class="amount-text"
              :class="scope.row.amount >= 0 ? 'positive' : 'negative'"
            >
              {{ scope.row.amount >= 0 ? '+' : '' }}{{ scope.row.amount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="beforeBalance"
          label="变动前"
          width="120"
          align="right"
        />
        <el-table-column
          prop="afterBalance"
          label="变动后"
          width="120"
          align="right"
        >
          <template #default="scope">
            <span style="font-weight: 600">{{ scope.row.afterBalance }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="操作时间"
          width="180"
          align="center"
        />
        <el-table-column prop="operator" label="操作人" min-width="120" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Download } from '@element-plus/icons-vue'

const tableData = ref([])
const loading = ref(false)
const dateRange = ref([])

onMounted(async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/points/flow')
    if (res.data.code === 200) {
      tableData.value = res.data.data.list
    }
  } finally {
    loading.value = false
  }
})

const getTypeTag = (type) => {
  const map = {
    注册奖励: 'success',
    签到: 'success',
    消费: 'warning',
    兑换: 'danger',
    过期: 'info',
    系统调整: '',
  }
  return map[type] || 'info'
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.table-title {
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
}

.table-actions {
  display: flex;
  gap: 12px;
}

.date-picker {
  width: 240px;
}

.mono-text {
  font-family: monospace;
  color: #86868b;
  font-size: 12px;
}

.amount-text {
  font-family: monospace;
  font-weight: 600;
  font-size: 15px;
}

.amount-text.positive {
  color: #34c759;
}

.amount-text.negative {
  color: #ff3b30;
}
</style>
