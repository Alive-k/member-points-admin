/**
 * 导出数据为 CSV 文件
 * @param {Array} headers - 表头数组，格式：[{ label: '姓名', key: 'name' }, ...]
 * @param {Array} data - 数据数组
 * @param {String} fileName - 文件名（不含扩展名）
 */
export function exportToCSV(headers, data, fileName = 'export-data') {
  if (!data || !data.length) {
    console.warn('No data to export')
    return
  }

  // 构建 CSV 内容
  let csvContent = '\uFEFF' // 添加 BOM 以解决中文乱码
  
  // 添加表头
  const headerLabels = headers.map(h => h.label)
  csvContent += headerLabels.join(',') + '\n'

  // 添加数据行
  data.forEach(row => {
    const rowContent = headers.map(header => {
      let val = row[header.key]
      
      // 处理 undefined 或 null
      if (val === undefined || val === null) {
        val = ''
      }
      
      // 转为字符串并处理特殊字符
      let strVal = String(val)
      
      // 如果包含逗号、换行或双引号，需要用双引号包裹，并将内部的双引号转义
      if (strVal.includes(',') || strVal.includes('\n') || strVal.includes('"')) {
        strVal = `"${strVal.replace(/"/g, '""')}"`
      }
      
      return strVal
    })
    csvContent += rowContent.join(',') + '\n'
  })

  // 创建 Blob 对象
  // 注意：CSV 格式使用 UTF-8 编码，BOM (\uFEFF) 是必须的，否则 Excel 打开会乱码
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  
  // 创建下载链接
  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${fileName}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url) // 释放 URL 对象
  }
}
