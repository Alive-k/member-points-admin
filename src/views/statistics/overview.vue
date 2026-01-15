<template>
  <div class="dashboard-container">
    <div class="page-header">
      <h2>数据概览</h2>
      <span class="subtitle">实时监控会员与积分动态</span>
    </div>

    <!-- Top Stats Cards -->
    <el-row :gutter="24" class="mt-4">
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <div class="stat-card primary">
          <div class="stat-icon">
            <el-icon><Coin /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-label">总发放积分</div>
            <div class="stat-value">
              {{ stats.totalPoints.toLocaleString() }}
            </div>
            <div class="stat-trend">
              <span class="trend-item up">
                <el-icon><Top /></el-icon> 12%
              </span>
              <span class="trend-text">较上月</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <div class="stat-card danger">
          <div class="stat-icon">
            <el-icon><Wallet /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-label">总消耗积分</div>
            <div class="stat-value">
              {{ stats.consumedPoints.toLocaleString() }}
            </div>
            <div class="stat-trend">
              <span class="trend-item up">
                <el-icon><Top /></el-icon> 8%
              </span>
              <span class="trend-text">较上月</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <div class="stat-card success">
          <div class="stat-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-label">会员总数</div>
            <div class="stat-value">
              {{ stats.memberCount.toLocaleString() }}
            </div>
            <div class="stat-trend">
              <span class="trend-item up">
                <el-icon><Top /></el-icon> {{ stats.todayNewMembers }}
              </span>
              <span class="trend-text">今日新增</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <div class="stat-card warning">
          <div class="stat-icon">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-label">活跃会员</div>
            <div class="stat-value">
              {{ stats.activeMemberCount.toLocaleString() }}
            </div>
            <div class="stat-trend">
              <span class="trend-item down">
                <el-icon><Bottom /></el-icon> 2%
              </span>
              <span class="trend-text">较昨日</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- Main Charts -->
    <el-row :gutter="24" class="mt-4">
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>近30天积分趋势</span>
              <div class="chart-actions">
                <el-radio-group v-model="trendType" size="small">
                  <el-radio-button label="points">积分</el-radio-button>
                  <el-radio-button label="members">会员</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </template>
          <div id="trendChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>会员等级分布</span>
              <el-icon><PieChart /></el-icon>
            </div>
          </template>
          <div id="levelChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Secondary Charts -->
    <el-row :gutter="24" class="mt-4">
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>积分消耗占比</span>
            </div>
          </template>
          <div id="pieChart" class="chart-container-sm"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>用户活跃热力图</span>
              <el-tag size="small" type="info">近7天</el-tag>
            </div>
          </template>
          <div id="heatmapChart" class="chart-container-sm"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import * as echarts from 'echarts'
import {
  Coin,
  Wallet,
  User,
  TrendCharts,
  PieChart,
  Top,
  Bottom,
} from '@element-plus/icons-vue'

const stats = ref({
  totalPoints: 0,
  consumedPoints: 0,
  memberCount: 0,
  activeMemberCount: 0,
  todayNewMembers: 0,
})

const trendType = ref('points')
let trendChart = null

const initCharts = async () => {
  // Trend Chart
  const trendRes = await axios.get('/api/statistics/trend')
  if (trendRes.data.code === 200) {
    const { dates, points, consumed } = trendRes.data.data
    trendChart = echarts.init(document.getElementById('trendChart'))

    const updateTrendChart = () => {
      trendChart.setOption({
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#eee',
          borderWidth: 1,
          textStyle: { color: '#333' },
        },
        legend: {
          data: ['发放积分', '消耗积分'],
          bottom: 0,
        },
        grid: {
          left: '2%',
          right: '2%',
          bottom: '10%',
          top: '10%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dates,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#999' },
        },
        yAxis: {
          type: 'value',
          splitLine: { lineStyle: { type: 'dashed', color: '#eee' } },
          axisLabel: { color: '#999' },
        },
        series: [
          {
            name: '发放积分',
            type: 'line',
            data: points,
            smooth: true,
            symbol: 'none',
            lineStyle: { width: 3, color: '#409EFF' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(64, 158, 255, 0.2)' },
                { offset: 1, color: 'rgba(64, 158, 255, 0)' },
              ]),
            },
          },
          {
            name: '消耗积分',
            type: 'line',
            data: consumed,
            smooth: true,
            symbol: 'none',
            lineStyle: { width: 3, color: '#F56C6C' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(245, 108, 108, 0.2)' },
                { offset: 1, color: 'rgba(245, 108, 108, 0)' },
              ]),
            },
          },
        ],
      })
    }
    updateTrendChart()

    // Watch for type change (mock implementation - in real app would fetch new data)
    watch(trendType, () => {
      // Just re-render for visual effect in this demo
      trendChart.clear()
      updateTrendChart()
    })

    window.addEventListener('resize', () => trendChart.resize())
  }

  // Level Chart (New)
  const levelRes = await axios.get('/api/statistics/user-levels')
  if (levelRes.data.code === 200) {
    const levelChart = echarts.init(document.getElementById('levelChart'))
    levelChart.setOption({
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: 0,
      },
      series: [
        {
          name: '会员等级',
          type: 'pie',
          radius: ['40%', '70%'],
          itemStyle: {
            borderRadius: 5,
            borderColor: '#fff',
            borderWidth: 2,
          },
          data: levelRes.data.data,
        },
      ],
    })
    window.addEventListener('resize', () => levelChart.resize())
  }

  // Pie Chart (Consumption)
  const pieRes = await axios.get('/api/statistics/distribution')
  if (pieRes.data.code === 200) {
    const pieChart = echarts.init(document.getElementById('pieChart'))
    pieChart.setOption({
      tooltip: { trigger: 'item' },
      series: [
        {
          name: '消耗类型',
          type: 'pie',
          radius: '70%',
          data: pieRes.data.data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    })
    window.addEventListener('resize', () => pieChart.resize())
  }

  // Heatmap Chart (New)
  const heatmapRes = await axios.get('/api/statistics/activity-heatmap')
  if (heatmapRes.data.code === 200) {
    const heatmapChart = echarts.init(document.getElementById('heatmapChart'))
    const hours = Array.from({ length: 24 }, (_, i) => i + '点')
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

    heatmapChart.setOption({
      tooltip: {
        position: 'top',
      },
      grid: {
        height: '65%',
        top: '10%',
      },
      xAxis: {
        type: 'category',
        data: hours,
        splitArea: {
          show: true,
        },
      },
      yAxis: {
        type: 'category',
        data: days,
        splitArea: {
          show: true,
        },
      },
      visualMap: {
        min: 0,
        max: 10,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '0%',
        inRange: {
          color: ['#f0f9ff', '#409EFF'],
        },
      },
      series: [
        {
          name: '活跃度',
          type: 'heatmap',
          data: heatmapRes.data.data,
          label: {
            show: false,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    })
    window.addEventListener('resize', () => heatmapChart.resize())
  }
}

onMounted(async () => {
  const res = await axios.get('/api/statistics/overview')
  if (res.data.code === 200) {
    stats.value = res.data.data
  }

  initCharts()
})
</script>

<style scoped>
.dashboard-container {
  padding: 10px;
}
.page-header {
  margin-bottom: 24px;
}
.page-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1d1d1f;
}
.subtitle {
  color: #86868b;
  font-size: 14px;
  margin-top: 8px;
  display: block;
}

.mt-4 {
  margin-top: 24px;
}

.stat-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 16px;
  color: #fff;
}

.primary .stat-icon {
  background: linear-gradient(135deg, #007aff, #0055b3);
}
.danger .stat-icon {
  background: linear-gradient(135deg, #ff3b30, #d63228);
}
.success .stat-icon {
  background: linear-gradient(135deg, #34c759, #2db14b);
}
.warning .stat-icon {
  background: linear-gradient(135deg, #ff9f0a, #e58e09);
}

.stat-info {
  flex: 1;
}

.stat-label {
  color: #86868b;
  font-size: 13px;
  margin-bottom: 4px;
}

.stat-value {
  color: #1d1d1f;
  font-size: 24px;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  letter-spacing: -0.5px;
}

.stat-trend {
  display: flex;
  align-items: center;
  margin-top: 4px;
  font-size: 12px;
}

.trend-item {
  display: flex;
  align-items: center;
  font-weight: 600;
  margin-right: 4px;
}

.trend-item.up {
  color: #34c759;
}
.trend-item.down {
  color: #ff3b30;
}

.trend-text {
  color: #86868b;
}

.chart-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #1d1d1f;
}

.chart-container {
  height: 320px;
  width: 100%;
}

.chart-container-sm {
  height: 320px;
  width: 100%;
}
</style>
