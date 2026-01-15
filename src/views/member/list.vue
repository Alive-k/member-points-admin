<template>
  <div class="page-container">
    <div class="table-header">
      <div class="table-title">会员列表</div>
      <div class="table-actions">
        <el-button type="primary" :icon="Download" @click="handleExport"
          >导出数据</el-button
        >
      </div>
    </div>

    <!-- Search Form -->
    <div class="search-container">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="会员ID">
          <el-input
            v-model="searchForm.id"
            placeholder="输入ID搜索"
            :prefix-icon="Search"
          />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="searchForm.phone"
            placeholder="输入手机号搜索"
            :prefix-icon="Iphone"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="全部状态"
            style="width: 140px"
          >
            <el-option label="全部" value="" />
            <el-option label="正常" value="normal" />
            <el-option label="冻结" value="frozen" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-container">
      <el-table
        :data="tableData"
        style="width: 100%; overflow-x: auto"
        v-loading="loading"
      >
        <el-table-column prop="id" label="会员ID" width="100" />
        <el-table-column label="会员信息" min-width="180">
          <template #default="scope">
            <div class="user-cell">
              <el-avatar
                :size="32"
                :src="
                  scope.row.avatar ||
                  'https://i.pravatar.cc/150?u=' + scope.row.id
                "
              />
              <div class="user-info">
                <span class="user-name">{{ scope.row.nickname }}</span>
                <span class="user-phone">{{ scope.row.phone }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="等级" width="120">
          <template #default="scope">
            <el-tag
              :type="getLevelTagType(scope.row.level)"
              effect="light"
              round
            >
              {{ scope.row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="currentPoints"
          label="当前积分"
          width="120"
          sortable
        >
          <template #default="scope">
            <span class="points-text">{{
              scope.row.currentPoints.toLocaleString()
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalPoints"
          label="累计积分"
          width="120"
          sortable
        />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <div class="status-indicator">
              <span class="dot" :class="scope.row.status"></span>
              {{ scope.row.status === 'normal' ? '正常' : '冻结' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="registerTime" label="注册时间" width="180" />
        <el-table-column fixed="right" label="操作" width="140">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleDetail(scope.row)"
              >详情</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
              style="margin-left: 12px"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑会员信息"
      width="480px"
      destroy-on-close
    >
      <el-form :model="editForm" label-width="80px" class="edit-form">
        <el-form-item label="昵称">
          <el-input v-model="editForm.nickname" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.phone" disabled />
        </el-form-item>
        <el-form-item label="头像URL">
          <el-input v-model="editForm.avatar" placeholder="输入图片链接" />
        </el-form-item>
        <el-form-item label="等级">
          <el-select v-model="editForm.level" style="width: 100%">
            <el-option label="普通会员" value="普通会员" />
            <el-option label="白银会员" value="白银会员" />
            <el-option label="黄金会员" value="黄金会员" />
            <el-option label="钻石会员" value="钻石会员" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="editForm.status">
            <el-radio label="normal">正常</el-radio>
            <el-radio label="frozen">冻结</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEdit">保存更改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Iphone, Download } from '@element-plus/icons-vue'
import { exportToCSV } from '@/utils/export'

const router = useRouter()
const tableData = ref([])
const loading = ref(false)
const dialogVisible = ref(false)

const searchForm = reactive({
  id: '',
  phone: '',
  status: '',
})

const editForm = reactive({
  id: '',
  nickname: '',
  phone: '',
  avatar: '',
  level: '',
  status: '',
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/members', { params: searchForm })
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

const handleSearch = () => {
  fetchData()
}

const handleExport = () => {
  if (!tableData.value || tableData.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const headers = [
    { label: '会员ID', key: 'id' },
    { label: '昵称', key: 'nickname' },
    { label: '手机号', key: 'phone' },
    { label: '等级', key: 'level' },
    { label: '当前积分', key: 'currentPoints' },
    { label: '累计积分', key: 'totalPoints' },
    { label: '状态', key: 'status' },
    { label: '注册时间', key: 'registerTime' },
  ]

  // 确保数据类型安全，避免 undefined 或 null 导致的导出错误
  const safeData = tableData.value.map((item) => ({
    ...item,
    id: String(item.id || ''),
    nickname: String(item.nickname || ''),
    phone: String(item.phone || ''),
    level: String(item.level || ''),
    currentPoints: item.currentPoints ?? 0,
    totalPoints: item.totalPoints ?? 0,
    status: item.status === 'normal' ? '正常' : '冻结',
    registerTime: String(item.registerTime || ''),
  }))

  exportToCSV(headers, safeData, '会员列表')
  ElMessage.success('导出成功')
}

const resetSearch = () => {
  searchForm.id = ''
  searchForm.phone = ''
  searchForm.status = ''
  fetchData()
}

const handleDetail = (row) => {
  router.push(`/member/detail/${row.id}`)
}

const handleEdit = (row) => {
  Object.assign(editForm, row)
  dialogVisible.value = true
}

const submitEdit = async () => {
  await axios.put(`/api/members/${editForm.id}`, editForm)
  ElMessage.success('会员信息已更新')
  dialogVisible.value = false
  fetchData()
}

const getLevelTagType = (level) => {
  const map = {
    普通会员: 'info',
    白银会员: '',
    黄金会员: 'warning',
    钻石会员: 'danger',
  }
  return map[level] || 'info'
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

.search-container {
  background: #f5f5f7;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.search-form .el-form-item {
  margin-bottom: 12px;
  margin-right: 24px;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  color: #1d1d1f;
}

.user-phone {
  font-size: 12px;
  color: #86868b;
}

.points-text {
  font-family: monospace;
  font-weight: 600;
  color: #007aff;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.dot.normal {
  background-color: #34c759;
  box-shadow: 0 0 0 2px rgba(52, 199, 89, 0.2);
}

.dot.frozen {
  background-color: #ff3b30;
  box-shadow: 0 0 0 2px rgba(255, 59, 48, 0.2);
}

.edit-form {
  padding: 0 20px;
}
</style>
