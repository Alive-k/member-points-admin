import Mock from 'mockjs'

// Helper for standard response
const success = (data) => ({
  code: 200,
  data: data,
  message: 'success',
})

// Login Mock
Mock.mock(/\/api\/login/, 'post', (options) => {
  const { username, password } = JSON.parse(options.body)
  if (username === 'admin' && password === '123456') {
    return success({
      token: 'mock-token-' + Date.now(),
      userInfo: {
        id: 1,
        username: 'admin',
        avatar:
          'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        roles: ['admin'],
      },
    })
  } else {
    return {
      code: 401,
      message: '用户名或密码错误',
    }
  }
})

// Member List Mock
Mock.mock(/\/api\/members/, 'get', () => {
  const ret = Mock.mock({
    'list|10-20': [
      {
        'id|+1': 10001,
        nickname: '@cname',
        phone: /^1[3-9]\d{9}$/,
        avatar: '',
        'currentPoints|0-10000': 0,
        'frozenPoints|0-1000': 0,
        'totalPoints|0-20000': 0,
        'level|1': ['普通会员', '白银会员', '黄金会员', '钻石会员'],
        registerTime: '@datetime',
        'status|1': ['normal', 'frozen'],
      },
    ],
    total: 100,
  })
  return success(ret)
})

// Points Flow Mock
Mock.mock(/\/api\/points\/flow/, 'get', () => {
  const ret = Mock.mock({
    'list|10-20': [
      {
        flowId: '@guid',
        'memberId|10001-10020': 10001,
        'amount|-100-100': 0,
        'beforeBalance|1000-5000': 0,
        afterBalance: function () {
          return this.beforeBalance + this.amount
        },
        'type|1': ['注册奖励', '签到', '消费', '兑换', '过期', '系统调整'],
        createTime: '@datetime',
        operator: '@cname',
      },
    ],
    total: 100,
  })
  return success(ret)
})

// Get Rules Mock
Mock.mock(/\/api\/rules\/get/, 'get', () => {
  const ret = Mock.mock({
    'list|3-6': [
      {
        'id|+1': 1,
        'name|1': [
          '注册奖励',
          '每日签到',
          '消费返积分',
          '完善信息',
          '邀请好友',
        ],
        trigger: '@title(3, 5)',
        'points|10-100': 10,
        'limit|1': ['无限制', '每日1次', '终身1次'],
        'status|1': [true, false],
        createTime: '@datetime',
      },
    ],
  })
  return success(ret)
})

// Use Rules Mock
Mock.mock(/\/api\/rules\/use/, 'get', () => {
  const ret = Mock.mock({
    'list|3-5': [
      {
        'id|+1': 1,
        'name|1': ['积分抵扣', '积分抽奖', '积分兑换商品'],
        'ratio|1': ['100:1', '50:1', '10:1'],
        'minPoints|100-1000': 100,
        'status|1': [true, false],
        createTime: '@datetime',
      },
    ],
  })
  return success(ret)
})

// Goods Mock
Mock.mock(/\/api\/mall\/goods/, 'get', () => {
  const ret = Mock.mock({
    'list|8-15': [
      {
        'id|+1': 1,
        name: '@ctitle(5, 10)',
        image: 'https://placeholder.co/100x100',
        'points|100-5000': 100,
        'stock|0-100': 50,
        'type|1': ['实物', '虚拟券', '红包'],
        'status|1': [true, false], // true: 上架, false: 下架
        createTime: '@datetime',
      },
    ],
    total: 50,
  })
  return success(ret)
})

// Statistics Overview
Mock.mock(/\/api\/statistics\/overview/, 'get', () => {
  return success({
    totalPoints: 1258000,
    consumedPoints: 456000,
    memberCount: 1234,
    activeMemberCount: 567,
    todayNewMembers: 45,
    todayPointsIssued: 12500,
    todayPointsConsumed: 8900,
    pointsRetentionRate: '68%',
  })
})

// Statistics Trend
Mock.mock(/\/api\/statistics\/trend/, 'get', () => {
  const dates = []
  const points = []
  const consumed = []

  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().slice(5, 10))
    points.push(Mock.mock('@integer(1000, 5000)'))
    consumed.push(Mock.mock('@integer(500, 3000)'))
  }

  return success({
    dates,
    points,
    consumed,
  })
})

// Statistics Distribution
Mock.mock(/\/api\/statistics\/distribution/, 'get', () => {
  return success([
    { value: 1048, name: '商品兑换' },
    { value: 735, name: '积分抵扣' },
    { value: 580, name: '抽奖消耗' },
    { value: 484, name: '过期清零' },
    { value: 300, name: '系统调整' },
  ])
})

// Statistics User Levels
Mock.mock(/\/api\/statistics\/user-levels/, 'get', () => {
  return success([
    { value: 600, name: '普通会员' },
    { value: 300, name: '白银会员' },
    { value: 200, name: '黄金会员' },
    { value: 134, name: '钻石会员' },
  ])
})

// Statistics Activity Heatmap (Mock)
Mock.mock(/\/api\/statistics\/activity-heatmap/, 'get', () => {
  const data = []
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 24; j++) {
      data.push([j, i, Math.floor(Math.random() * 10)])
    }
  }
  return success(data)
})

// System Roles
Mock.mock(/\/api\/system\/roles/, 'get', () => {
  const ret = Mock.mock({
    'list|3-5': [
      {
        'id|+1': 1,
        'name|1': ['超级管理员', '运营专员', '财务专员', '客服'],
        desc: '@csentence(5, 15)',
        createTime: '@datetime',
        'status|1': [true, true, false],
      },
    ],
  })
  return success(ret)
})

// Generic Success for POST/PUT/DELETE
Mock.mock(/api\/.*$/, 'post', success({}))
Mock.mock(/api\/.*$/, 'put', success({}))
Mock.mock(/api\/.*$/, 'delete', success({}))

// Setup timeout
Mock.setup({
  timeout: '200-600',
})

export default Mock
