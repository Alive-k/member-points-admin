<template>
  <div>
    <h2>签到配置</h2>
    <el-card class="box-card" style="max-width: 600px; margin-top: 20px;">
      <el-form :model="form" label-width="120px">
        <el-form-item label="开启签到">
          <el-switch v-model="form.enabled" />
        </el-form-item>
        
        <template v-if="form.enabled">
          <el-form-item label="每日签到积分">
            <el-input-number v-model="form.dailyPoints" :min="1" />
          </el-form-item>
          
          <el-form-item label="连续签到奖励">
             <div v-for="(item, index) in form.continuousRules" :key="index" class="rule-item">
               <span>连续 </span>
               <el-input-number v-model="item.days" :min="2" size="small" style="width: 80px" />
               <span> 天，额外奖励 </span>
               <el-input-number v-model="item.points" :min="1" size="small" style="width: 80px" />
               <span> 积分</span>
               <el-button type="danger" circle size="small" @click="removeRule(index)" style="margin-left: 10px;">
                  <el-icon><Delete /></el-icon>
               </el-button>
             </div>
             <el-button type="primary" link size="small" @click="addRule">+ 添加连续签到规则</el-button>
          </el-form-item>
        </template>

        <el-form-item>
          <el-button type="primary" @click="handleSave">保存配置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

const form = reactive({
  enabled: true,
  dailyPoints: 5,
  continuousRules: [
    { days: 3, points: 10 },
    { days: 7, points: 50 }
  ]
})

const addRule = () => {
  form.continuousRules.push({ days: 3, points: 10 })
}

const removeRule = (index) => {
  form.continuousRules.splice(index, 1)
}

const handleSave = () => {
  console.log('Saved:', form)
  ElMessage.success('签到配置已保存')
}
</script>

<style scoped>
.rule-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.rule-item span {
  margin: 0 5px;
}
</style>
