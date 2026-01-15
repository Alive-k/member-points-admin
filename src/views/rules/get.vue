<template>
  <div class="page-container">
    <div class="table-header">
      <div class="table-title">积分获取规则</div>
      <div class="table-actions">
        <el-button type="primary" :icon="Plus" @click="handleAdd"
          >新增规则</el-button
        >
      </div>
    </div>

    <div class="table-container">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="规则名称" min-width="150">
          <template #default="scope">
            <span style="font-weight: 500">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="trigger" label="触发条件" min-width="180">
          <template #default="scope">
            <el-tag type="info" effect="plain">{{ scope.row.trigger }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="积分值" width="120">
          <template #default="scope">
            <span class="points-value">+{{ scope.row.points }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="limit" label="限制条件" width="140">
          <template #default="scope">
            <span style="color: #86868b; font-size: 13px">{{
              scope.row.limit
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              @change="handleStatusChange(scope.row)"
              style="--el-switch-on-color: #34c759"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              link
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
              style="margin-left: 12px"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="formType === 'add' ? '新增规则' : '编辑规则'"
      width="480px"
      destroy-on-close
    >
      <el-form :model="formData" label-width="100px" class="rule-form">
        <el-form-item label="规则名称">
          <el-input v-model="formData.name" placeholder="如：注册奖励" />
        </el-form-item>
        <el-form-item label="触发条件">
          <el-input
            v-model="formData.trigger"
            placeholder="如：user_register"
          />
        </el-form-item>
        <el-form-item label="积分值">
          <el-input-number
            v-model="formData.points"
            :min="1"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="限制">
          <el-select v-model="formData.limit" style="width: 100%">
            <el-option label="无限制" value="无限制" />
            <el-option label="每日1次" value="每日1次" />
            <el-option label="终身1次" value="终身1次" />
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态">
          <el-switch v-model="formData.status" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const formType = ref('add')
const formData = reactive({
  id: '',
  name: '',
  trigger: '',
  points: 10,
  limit: '无限制',
  status: true,
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/rules/get')
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

const handleAdd = () => {
  formType.value = 'add'
  Object.assign(formData, {
    id: '',
    name: '',
    trigger: '',
    points: 10,
    limit: '无限制',
    status: true,
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  formType.value = 'edit'
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该规则吗?', '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await axios.delete(`/api/rules/${row.id}`)
    ElMessage.success('删除成功')
    fetchData()
  })
}

const handleStatusChange = async (row) => {
  await axios.put(`/api/rules/${row.id}`, { status: row.status })
  ElMessage.success('状态已更新')
}

const handleSubmit = async () => {
  if (formType.value === 'add') {
    await axios.post('/api/rules', formData)
    ElMessage.success('新增成功')
  } else {
    await axios.put(`/api/rules/${formData.id}`, formData)
    ElMessage.success('更新成功')
  }
  dialogVisible.value = false
  fetchData()
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

.points-value {
  color: #34c759;
  font-weight: 600;
  font-family: monospace;
}

.rule-form {
  padding: 0 20px;
}
</style>
