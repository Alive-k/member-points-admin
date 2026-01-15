<template>
  <div class="page-container">
    <div class="table-header">
      <div class="table-title">积分账户</div>
      <div class="table-actions">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索会员..."
          :prefix-icon="Search"
          class="search-input"
        />
      </div>
    </div>

    <div class="table-container">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="会员ID" width="100" />
        <el-table-column label="会员" min-width="180">
          <template #default="scope">
            <div class="user-cell">
              <el-avatar
                :size="32"
                :src="'https://i.pravatar.cc/150?u=' + scope.row.id"
              />
              <span class="user-name">{{ scope.row.nickname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="currentPoints"
          label="可用积分"
          width="150"
          sortable
        >
          <template #default="scope">
            <span class="points-value primary">{{
              scope.row.currentPoints.toLocaleString()
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="frozenPoints"
          label="冻结积分"
          width="150"
          sortable
        >
          <template #default="scope">
            <span class="points-value secondary">{{
              scope.row.frozenPoints.toLocaleString()
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalPoints"
          label="累计获取"
          width="150"
          sortable
        >
          <template #default="scope">
            <span class="points-value">{{
              scope.row.totalPoints.toLocaleString()
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              plain
              @click="handleAdjust(scope.row)"
              class="action-btn"
              >调整积分</el-button
            >
            <el-button
              :type="scope.row.status === 'normal' ? 'warning' : 'success'"
              size="small"
              plain
              @click="handleFreeze(scope.row)"
              style="margin-left: 12px"
              class="action-btn"
            >
              {{ scope.row.status === 'normal' ? '冻结账户' : '解冻账户' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 积分调整弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="积分调整"
      width="480px"
      destroy-on-close
    >
      <el-form :model="adjustForm" label-width="100px" class="adjust-form">
        <el-form-item label="调整对象">
          <span style="font-weight: 500"
            >{{ currentMember?.nickname }} (ID: {{ currentMember?.id }})</span
          >
        </el-form-item>
        <el-form-item label="调整类型">
          <el-radio-group v-model="adjustForm.type">
            <el-radio-button label="add">增加积分</el-radio-button>
            <el-radio-button label="reduce">扣减积分</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="积分数值">
          <el-input-number
            v-model="adjustForm.amount"
            :min="1"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注说明">
          <el-input
            v-model="adjustForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入调整原因..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAdjust">确认调整</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const tableData = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const searchKeyword = ref('')
const currentMember = ref(null)

const adjustForm = reactive({
  memberId: '',
  type: 'add',
  amount: 0,
  remark: '',
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/members')
    if (res.data.code === 200) {
      tableData.value = res.data.data.list
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const handleAdjust = (row) => {
  currentMember.value = row
  adjustForm.memberId = row.id
  adjustForm.type = 'add'
  adjustForm.amount = 100
  adjustForm.remark = ''
  dialogVisible.value = true
}

const handleFreeze = (row) => {
  const action = row.status === 'normal' ? '冻结' : '解冻'
  ElMessageBox.confirm(
    `确定要${action}会员 ${row.nickname} 的账户吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // Mock API call
    row.status = row.status === 'normal' ? 'frozen' : 'normal'
    ElMessage.success(`操作成功，账户已${action}`)
  })
}

const submitAdjust = () => {
  if (adjustForm.amount <= 0) {
    ElMessage.warning('积分数值必须大于0')
    return
  }
  ElMessage.success('调整申请已提交')
  dialogVisible.value = false
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

.search-input {
  width: 240px;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-weight: 500;
  color: #1d1d1f;
}

.points-value {
  font-family: monospace;
  font-weight: 600;
}

.points-value.primary {
  color: #007aff;
  font-size: 15px;
}

.points-value.secondary {
  color: #86868b;
}

.adjust-form {
  padding: 0 20px;
}

.action-btn {
  border-radius: 6px;
}
</style>
