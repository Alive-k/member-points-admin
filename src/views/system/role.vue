<template>
  <div class="page-container">
    <div class="table-header">
      <div class="table-title">角色权限管理</div>
      <div class="table-actions">
        <el-button type="primary" :icon="Plus" @click="handleAdd"
          >新增角色</el-button
        >
      </div>
    </div>

    <div class="table-container">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" width="150">
          <template #default="scope">
            <span style="font-weight: 500">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="描述" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              @change="handleStatusChange(scope.row)"
              style="--el-switch-on-color: #34c759"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
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
              type="primary"
              size="small"
              @click="handlePermission(scope.row)"
              style="margin-left: 12px"
              >权限配置</el-button
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

    <!-- Role Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="formType === 'add' ? '新增角色' : '编辑角色'"
      width="480px"
      destroy-on-close
    >
      <el-form :model="formData" label-width="80px" class="role-form">
        <el-form-item label="角色名称">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.desc" type="textarea" :rows="3" />
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

    <!-- Permission Dialog (Mock) -->
    <el-dialog
      v-model="permDialogVisible"
      title="权限配置"
      width="480px"
      destroy-on-close
    >
      <el-tree
        :data="permData"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[1]"
        :default-checked-keys="[11, 12]"
        class="perm-tree"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handlePermSubmit"
            >保存权限</el-button
          >
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
const permDialogVisible = ref(false)
const formType = ref('add')
const formData = reactive({
  id: '',
  name: '',
  desc: '',
  status: true,
})

// Mock permission tree
const permData = [
  {
    id: 1,
    label: '会员积分系统',
    children: [
      {
        id: 11,
        label: '会员管理',
        children: [
          { id: 111, label: '会员列表' },
          { id: 112, label: '会员详情' },
        ],
      },
      {
        id: 12,
        label: '积分管理',
        children: [
          { id: 121, label: '积分账户' },
          { id: 122, label: '积分流水' },
        ],
      },
      {
        id: 13,
        label: '系统设置',
        children: [{ id: 131, label: '角色权限' }],
      },
    ],
  },
]

const fetchData = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/system/roles')
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
    desc: '',
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
  ElMessageBox.confirm('确认删除该角色吗?', '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await axios.delete(`/api/system/roles/${row.id}`)
    ElMessage.success('删除成功')
    fetchData()
  })
}

const handleStatusChange = async (row) => {
  await axios.put(`/api/system/roles/${row.id}`, { status: row.status })
  ElMessage.success('状态已更新')
}

const handleSubmit = async () => {
  if (formType.value === 'add') {
    await axios.post('/api/system/roles', formData)
    ElMessage.success('新增成功')
  } else {
    await axios.put(`/api/system/roles/${formData.id}`, formData)
    ElMessage.success('更新成功')
  }
  dialogVisible.value = false
  fetchData()
}

const handlePermission = (row) => {
  permDialogVisible.value = true
}

const handlePermSubmit = () => {
  ElMessage.success('权限配置已保存')
  permDialogVisible.value = false
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

.role-form {
  padding: 0 20px;
}

.perm-tree {
  margin: 10px 20px;
}
</style>
