import React from 'react'
import './index.scss'
import { getDateMappingWeek, getMonthDayCount } from './utils'

function getWeekByRowIndex(index) {
  index = index % 7
  const weekArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thuesday', 'Friday', 'Satuaday']
  return weekArray[index]
}

class Calendar extends React.Component {

  state = {
    currentYear: -1,
    currentMonth: -1,
    currentDay: -1,
    currentDayIndex: -1,
    currentGroupIndex: -1,
    calendarYear: -1,
    calendarMonth: -1,
    calendarDay: -1,
    dayList: [
      [
        { week: '', day: -1 },
        { week: '', day: -1 },
        { week: '', day: -1 },
        { week: 'Wednesday', day: 1 },
        { week: 'Thuesday', day: 2 },
        { week: 'Friday', day: 3 },
        { week: 'Satuaday', day: 4 }
      ],
      [
        { week: 'Sunday', day: 5 },
        { week: 'Monday', day: 6 },
        { week: 'Tuesday', day: 7 },
        { week: 'Wednesday', day: 8 },
        { week: 'Thuesday', day: 9 },
        { week: 'Friday', day: 10 },
        { week: 'Satuaday', day: 11 }
      ],
      [
        { week: 'Sunday', day: 12 },
        { week: 'Monday', day: 13 },
        { week: 'Tuesday', day: 14 },
        { week: 'Wednesday', day: 15 },
        { week: 'Thuesday', day: 16 },
        { week: 'Friday', day: 17 },
        { week: 'Satuaday', day: 18, isToday: true }
      ],
      [
        { week: 'Sunday', day: 19 },
        { week: 'Monday', day: 20 },
        { week: 'Tuesday', day: 21 },
        { week: 'Wednesday', day: 22 },
        { week: 'Thuesday', day: 23 },
        { week: 'Friday', day: 24 },
        { week: 'Satuaday', day: 25 }
      ],
      [
        { week: 'Sunday', day: 26 },
        { week: 'Monday', day: 27 },
        { week: 'Tuesday', day: 28 },
        { week: 'Wednesday', day: 29 }
      ],
    ]
  }

  caclCurrentDate = (dateString) => {
    const groups = []
    /* blockCount: 每个月一号前需要占位的数量 */
    /* sumCount: 第一行的总个数 */
    const firstRow = {
      0: { blockCount: 0, sumCount: 7 },
      1: { blockCount: 1, sumCount: 6 },
      2: { blockCount: 2, sumCount: 5 },
      3: { blockCount: 3, sumCount: 4 },
      4: { blockCount: 4, sumCount: 3 },
      5: { blockCount: 5, sumCount: 2 },
      6: { blockCount: 6, sumCount: 1 },
    }
    const firstDayWeekIndex = getDateMappingWeek(dateString).index
    const dayCount = getMonthDayCount(dateString)
    let index = 0
    // 添加第一行
    const { blockCount, sumCount } = firstRow[firstDayWeekIndex]
    groups.push(
      Array(blockCount).fill({}).concat(
        Array(sumCount).fill('').map(item => {
          return { week: getWeekByRowIndex(index), day: ++index }
        })
      )
    )
    // 添加后续行
    let i = dayCount - sumCount
    while (i > 0) {
      const number = i >= 7 ? 7 : i
      groups.push(
        Array(number).fill('').map(item => {
          return { week: getWeekByRowIndex(index), day: ++index }
        })
      )
      i = i - 7
    }
    // console.log(groups)
    this.setState({
      dayList: groups
    })
  }

  initCurrenetYMD = () => {
    const date = new Date()
    const [ currentYear, currentMonth, currentDay ] = [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    ]
    this.setState({
      currentYear,
      currentMonth,
      currentDay,
      calendarYear: currentYear,
      calendarMonth: currentMonth,
      calendarDay: currentDay
    })
  }

  componentDidMount = () => {
    this.initCurrenetYMD()
    this.caclCurrentDate()
  }

  showToday = (item) => {
    const {
      currentYear,
      currentMonth,
      calendarYear,
      calendarMonth,
      calendarDay
    } = this.state
    const flag = (
      currentYear === calendarYear
      && currentMonth === calendarMonth
      && item.day === calendarDay
    )
    return flag ? 'today-day-item' : ''
  }

  showTap = (dayIndex, groupIndex) => {
    const { currentGroupIndex, currentDayIndex } = this.state
    return (
      currentGroupIndex === groupIndex && currentDayIndex === dayIndex
    ) ? 'tap-day-item' : ''
  }

  tapDayItem = (item, dayIndex, groupIndex) => {
    this.setState({
      currentDayIndex: dayIndex,
      currentGroupIndex: groupIndex
    })
  }

  getNextDateString = (flag) => {
    const { calendarYear, calendarMonth } = this.state
    let nextYear, nextMonth
    if (flag === 1) {
      // 下个月
      if (calendarMonth === 12) {
        nextYear = calendarYear + 1
        nextMonth = 1
      } else {
        nextYear = calendarYear
        nextMonth = calendarMonth + 1
      }
    } else if (flag === -1) {
      // 上个月
      if (calendarMonth === 1) {
        nextYear = calendarYear - 1
        nextMonth = 12
      } else {
        nextYear = calendarYear
        nextMonth = calendarMonth - 1
      }
    }

    return {
      string: `${nextYear}/${nextMonth}/1`,
      year: nextYear,
      month: nextMonth
    }
  }

  clearStatus = () => {
    this.setState({
      currentDayIndex: -1,
      currentGroupIndex: -1
    })
  }

  toggleCalendarMonth = (flag) => {
    const {
      year, month, string: nextCalendarDateString
    } = this.getNextDateString(flag)
    this.caclCurrentDate(nextCalendarDateString)
    this.clearStatus()
    this.setState({
      calendarYear: year,
      calendarMonth: month
    })
  }

  render() {
    const { dayList, calendarYear, calendarMonth } = this.state
    return (
      <div className="calendar-container">
        <div className="calendar-top">
          <div className="left-btn" onClick={() => this.toggleCalendarMonth(-1)} rn-text="true">{'上月'}</div>
          <div className="title" rn-text="true">{calendarYear + '.' + ('0' + calendarMonth).slice(-2) }</div>
          <div className="right-btn" onClick={() => this.toggleCalendarMonth(1)} rn-text="true">{'下月'}</div>
        </div>
        <div className="week-title">
          <div className="week-title-item">S</div>
          <div className="week-title-item">M</div>
          <div className="week-title-item">T</div>
          <div className="week-title-item">W</div>
          <div className="week-title-item">T</div>
          <div className="week-title-item">F</div>
          <div className="week-title-item">S</div>
        </div>
        <div className="day-container">
          {[dayList.map((item, index) => (
            <div key={index} className="day-row">
              {
                item.map((day, idx) => (
                  <div
                  rn-text="true"
                  key={idx}
                  onClick={() => this.tapDayItem(day, idx, index)}
                  className={`day-item ${this.showToday(day)} ${this.showTap(idx, index)}`}
                  >{day.week ? day.day : ''}</div>
                ))
              }
            </div>
          ))]}
        </div>
      </div>
    )
  }
}

export default Calendar