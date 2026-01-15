<template>
  <div class="page-container" v-loading="loading">
    <div class="page-header">
      <el-button @click="goBack" class="back-btn" :icon="ArrowLeft"
        >返回</el-button
      >
      <div class="header-title">会员详情</div>
      <div class="header-actions">
        <el-button type="primary" @click="handleEdit">编辑资料</el-button>
      </div>
    </div>

    <template v-if="member">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-main">
          <el-avatar
            :size="80"
            :src="member.avatar || 'https://i.pravatar.cc/150?u=' + member.id"
          />
          <div class="profile-info">
            <h1 class="profile-name">{{ member.nickname }}</h1>
            <div class="profile-meta">
              <span class="meta-item">ID: {{ member.id }}</span>
              <span class="meta-separator">•</span>
              <span class="meta-item">{{ member.phone }}</span>
              <span class="meta-separator">•</span>
              <span class="meta-item">注册于 {{ member.registerTime }}</span>
            </div>
            <div class="profile-tags">
              <el-tag
                :type="getLevelTagType(member.level)"
                effect="dark"
                round
                class="level-tag"
              >
                {{ member.level }}
              </el-tag>
              <el-tag
                :type="member.status === 'normal' ? 'success' : 'danger'"
                effect="plain"
                round
              >
                {{ member.status === 'normal' ? '状态正常' : '账户冻结' }}
              </el-tag>
            </div>
          </div>
        </div>

        <div class="points-overview">
          <div class="points-card primary">
            <div class="points-label">当前可用积分</div>
            <div class="points-value">
              {{ member.currentPoints.toLocaleString() }}
            </div>
          </div>
          <div class="points-card">
            <div class="points-label">累计获取</div>
            <div class="points-value">
              {{ member.totalPoints.toLocaleString() }}
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Sections -->
      <el-row :gutter="24" class="detail-content">
        <el-col :span="16">
          <el-card class="detail-card" header="近期动态">
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :type="activity.type"
                :timestamp="activity.timestamp"
                :hollow="true"
              >
                {{ activity.content }}
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="detail-card" header="积分概览">
            <div class="info-list">
              <div class="info-item">
                <span class="label">可用积分</span>
                <span class="value">{{ member.currentPoints }}</span>
              </div>
              <div class="info-item">
                <span class="label">冻结积分</span>
                <span class="value">{{ member.frozenPoints }}</span>
              </div>
              <div class="info-item">
                <span class="label">累计获取</span>
                <span class="value">{{ member.totalPoints }}</span>
              </div>
              <div class="info-item">
                <span class="label">累计消耗</span>
                <span class="value">{{
                  member.totalPoints - member.currentPoints
                }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </template>

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
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const member = ref(null)
const dialogVisible = ref(false)

const editForm = reactive({
  id: '',
  nickname: '',
  phone: '',
  avatar: '',
  level: '',
  status: '',
})

// Mock activities
const activities = [
  {
    content: '兑换了商品 "iPhone 15"',
    timestamp: '2023-10-01 12:00',
    type: 'primary',
  },
  {
    content: '每日签到获得 10 积分',
    timestamp: '2023-10-01 09:00',
    type: 'success',
  },
  {
    content: '完善个人信息获得 50 积分',
    timestamp: '2023-09-30 14:30',
    type: 'success',
  },
]

const goBack = () => {
  router.back()
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

const handleEdit = () => {
  Object.assign(editForm, member.value)
  dialogVisible.value = true
}

const submitEdit = async () => {
  await axios.put(`/api/members/${editForm.id}`, editForm)
  ElMessage.success('会员信息已更新')
  member.value = { ...member.value, ...editForm }
  dialogVisible.value = false
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/members')
    if (res.data.code === 200 && res.data.data.list.length > 0) {
      const found = res.data.data.list[0]
      found.id = route.params.id
      member.value = found
    }
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.back-btn {
  margin-right: 16px;
  border: none;
  background: transparent;
  padding-left: 0;
  font-size: 14px;
  color: #86868b;
}

.back-btn:hover {
  color: #1d1d1f;
  background: transparent;
}

.header-title {
  font-size: 24px;
  font-weight: 700;
  flex: 1;
}

.profile-header {
  background: #fff;
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.02);
}

.profile-main {
  display: flex;
  align-items: center;
  gap: 24px;
}

.profile-name {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
}

.profile-meta {
  color: #86868b;
  font-size: 13px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.meta-separator {
  margin: 0 8px;
  color: #d2d2d7;
}

.profile-tags {
  display: flex;
  gap: 8px;
}

.level-tag {
  background: linear-gradient(135deg, #007aff, #0055b3);
  border: none;
}

.points-overview {
  display: flex;
  gap: 16px;
}

.points-card {
  background: #f5f5f7;
  padding: 16px 24px;
  border-radius: 16px;
  min-width: 120px;
  text-align: center;
}

.points-card.primary {
  background: rgba(0, 122, 255, 0.05);
  color: #007aff;
}

.points-label {
  font-size: 12px;
  color: #86868b;
  margin-bottom: 4px;
}

.points-card.primary .points-label {
  color: #007aff;
  opacity: 0.8;
}

.points-value {
  font-size: 24px;
  font-weight: 700;
  font-family: monospace;
}

.detail-card {
  background: #fff;
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.02);
  height: 100%;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid #f5f5f7;
}

.info-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-item .label {
  color: #86868b;
}

.info-item .value {
  font-weight: 500;
  color: #1d1d1f;
}

.edit-form {
  padding: 0 20px;
}
</style>
