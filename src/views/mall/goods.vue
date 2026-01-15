<template>
  <div class="page-container">
    <div class="table-header">
      <div class="table-title">积分商城商品管理</div>
      <div class="table-actions">
        <el-button type="primary" :icon="Plus" @click="handleAdd"
          >新增商品</el-button
        >
      </div>
    </div>

    <div class="table-container">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="图片" width="100">
          <template #default="scope">
            <el-image :src="scope.row.image" class="goods-image" fit="cover">
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="180">
          <template #default="scope">
            <span style="font-weight: 500">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="scope">
            <el-tag type="info" effect="plain">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="所需积分" width="120">
          <template #default="scope">
            <span class="points-value">{{ scope.row.points }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100">
          <template #default="scope">
            <span :class="{ 'low-stock': scope.row.stock < 10 }">{{
              scope.row.stock
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
      :title="formType === 'add' ? '新增商品' : '编辑商品'"
      width="600px"
      destroy-on-close
    >
      <el-form :model="formData" label-width="100px" class="goods-form">
        <el-form-item label="商品名称">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="商品图片">
          <el-input v-model="formData.image" placeholder="输入图片URL" />
        </el-form-item>
        <el-form-item label="商品类型">
          <el-radio-group v-model="formData.type">
            <el-radio-button label="实物">实物</el-radio-button>
            <el-radio-button label="虚拟券">虚拟券</el-radio-button>
            <el-radio-button label="红包">红包</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所需积分">
          <el-input-number
            v-model="formData.points"
            :min="1"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number
            v-model="formData.stock"
            :min="0"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="formData.status"
            active-text="上架"
            inactive-text="下架"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Picture } from '@element-plus/icons-vue'

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const formType = ref('add')
const formData = reactive({
  id: '',
  name: '',
  image: 'https://placeholder.co/100x100',
  type: '实物',
  points: 100,
  stock: 100,
  status: true,
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/mall/goods')
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
    image: 'https://placeholder.co/100x100',
    type: '实物',
    points: 100,
    stock: 100,
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
  ElMessageBox.confirm('确认删除该商品吗?', '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await axios.delete(`/api/mall/goods/${row.id}`)
    ElMessage.success('删除成功')
    fetchData()
  })
}

const handleStatusChange = async (row) => {
  await axios.put(`/api/mall/goods/${row.id}`, { status: row.status })
  ElMessage.success('商品状态已更新')
}

const handleSubmit = async () => {
  if (formType.value === 'add') {
    await axios.post('/api/mall/goods', formData)
    ElMessage.success('新增成功')
  } else {
    await axios.put(`/api/mall/goods/${formData.id}`, formData)
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

.goods-image {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background: #f5f5f7;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #909399;
}

.points-value {
  color: #ff9f0a;
  font-weight: 600;
  font-family: monospace;
}

.low-stock {
  color: #ff3b30;
  font-weight: 600;
}

.goods-form {
  padding: 0 20px;
}
</style>
