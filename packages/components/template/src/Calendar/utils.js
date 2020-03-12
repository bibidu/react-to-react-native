
function getDateMappingWeek(dateExpr) {
  let date = dateExpr ? new Date(dateExpr) : new Date()
  if (!dateExpr) {
    date.setDate(1)
  }
  const weekArray = ['日', '一', '二', '三', '四', '五', '六']
  return {
    index: date.getDay(),
    zh: weekArray[date.getDay()]
  }
}

function getMonthDayCount(dateExpr) {
  const date = dateExpr ? new Date(dateExpr) : new Date()
  date.setMonth(date.getMonth() + 1)
  date.setDate(0)
  return date.getDate()
}

export {
  getDateMappingWeek,
  getMonthDayCount
}