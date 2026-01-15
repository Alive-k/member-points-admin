<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-left">
        <div class="login-bg"></div>
        <div class="login-desc">
          <h2>会员积分后台管理系统</h2>
          <p>高效 · 智能 · 便捷</p>
        </div>
      </div>
      <div class="login-right">
        <div class="login-form-wrapper">
          <div class="login-header">
            <h3>欢迎登录</h3>
            <span>请输入您的账号和密码</span>
          </div>
          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            size="large"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入账号"
                :prefix-icon="User"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                :prefix-icon="Lock"
                show-password
                @keyup.enter="handleLogin"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="loading"
                type="primary"
                class="login-btn"
                @click="handleLogin"
              >
                登 录
              </el-button>
            </el-form-item>
          </el-form>
           <div class="login-footer">
            <span>账号：admin</span>
            <span>密码：123456</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  username: 'admin',
  password: ''
})

const loginRules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res = await axios.post('/api/login', loginForm)
        if (res.data.code === 200) {
          ElMessage.success('登录成功')
          localStorage.setItem('token', res.data.data.token)
          localStorage.setItem('userInfo', JSON.stringify(res.data.data.userInfo))
          router.push('/')
        } else {
          ElMessage.error(res.data.message || '登录失败')
        }
      } catch (error) {
        ElMessage.error('网络错误，请稍后重试')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  width: 100vw;
  background-color: #f0f2f5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-content {
  width: 1000px;
  height: 600px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  overflow: hidden;
}

.login-left {
  width: 50%;
  position: relative;
  background: linear-gradient(135deg, #409EFF 0%, #3a8ee6 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://placeholder.co/500x600'); /* Replace with actual nice pattern */
  opacity: 0.1;
}

.login-desc {
  z-index: 1;
  text-align: center;
}

.login-desc h2 {
  font-size: 28px;
  margin-bottom: 20px;
}

.login-desc p {
  font-size: 16px;
  opacity: 0.8;
}

.login-right {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.login-form-wrapper {
  width: 100%;
  max-width: 360px;
}

.login-header {
  margin-bottom: 40px;
  text-align: left;
}

.login-header h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.login-header span {
  color: #999;
  font-size: 14px;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
}

.login-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 12px;
  color: #999;
}
.login-footer span {
  margin: 0 10px;
}
</style>
