<template>
  <div class="schedule-container">
    <div class="schedule-bar">
      <div class="schedule-title">
        {{ `${showYear}-${showMonth + 1}-${showDay}` }}
      </div>
      <div class="switch-box">
        <div class="switch-btn" @click="switchMode('month')">月</div>
        <div class="switch-btn" @click="switchMode('week')">周</div>
      </div>
    </div>
    <div class="week-lists">
      <div class="week-item" v-for="(week, index) in weekLists" :key="index">{{ week.zh }}</div>
    </div>
    <div class="day-lists">
      <div
        class="day-item"
        :class="{
          'curreny-day': currentDay ===  item.format,
          'selected-day': selectedDay ===  item.format
        }"
        v-for="item in visibleCalendar"
        :key="`${item.month}-${item.day}`"
        @click="itemClick(item)"
        >
        <div class="flex">
          <div class="day-label">{{ item.day }}</div>
        </div>
      </div>
    </div>

    <div class="btn-box">
      <button @click="changeCalendar('subtract')">向上</button>
      <button @click="changeCalendar('add')">向下</button>
      <button @click="goToday">今天</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { getYearMonthDay } from './utils'
import Day from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
Day.extend(customParseFormat)

interface CalendarItem {
  year: number,
  month: number,
  day: number,
  weekDay: number,
  date: Date,
  format: string
}

export default defineComponent({
  setup () {
    const { year, month, day } = getYearMonthDay(new Date())
    const showYear = ref(year)
    const showMonth = ref(month)
    const showDay = ref(day)
    const currentDay = `${year}-${month}-${day}`
    const selectedDay = ref(`${year}-${month}-${day}`)

    const goToday = () => {
      const { year, month, day } = getYearMonthDay(new Date())
      showYear.value = year
      showMonth.value = month
      showDay.value = day
    }
    const weekLists = [
      { en: 'Sun', zh: '日' },
      { en: 'Mon', zh: '一' },
      { en: 'Tue', zh: '二' },
      { en: 'Wed', zh: '三' },
      { en: 'Thu', zh: '四' },
      { en: 'Fri', zh: '五' },
      { en: 'Sat', zh: '六' }
    ]

    const mode = ref<'month' |'week'>('month')
    const switchMode = (neMode: 'week' | 'month') => {
      mode.value = neMode
    }

    const visibleCalendar = computed(() => {
      const dateArr: Array<CalendarItem> = []
      const { year, month } = getYearMonthDay(new Date(showYear.value, showMonth.value, showDay.value))

      const monthFirstDay = new Date(year, month, 1)

      const firstDayweekDay = monthFirstDay.getDay()

      let startTime = monthFirstDay.getTime() - firstDayweekDay * 24 * 60 * 60 * 1000

      // 判断需要5行还是6行
      let monthDayNum = 35
      if (firstDayweekDay > 4) {
        monthDayNum = 42
      }

      if (mode.value === 'week') {
        monthDayNum = 7
        const today = new Date(showYear.value, showMonth.value, showDay.value)
        startTime = today.getTime() - today.getDay() * 24 * 60 * 60 * 1000
      }

      for (let i = 0; i < monthDayNum; i++) {
        const date = new Date(startTime + i * 24 * 60 * 60 * 1000)
        const { year, month, day, weekDay } = getYearMonthDay(date)
        dateArr.push({
          format: `${year}-${month}-${day}`,
          year,
          month: month + 1,
          day,
          weekDay,
          date
        })
      }

      return dateArr
    })

    const changeCalendar = (handleType : 'add' | 'subtract'):void => {
      let newDate = Day(new Date(showYear.value, showMonth.value, showDay.value))
      newDate = newDate[handleType](1, mode.value)
      showYear.value = newDate.year()
      showMonth.value = newDate.month()
      showDay.value = newDate.get('date')
    }

    const toGoday = () => {
      const { year, month, day } = getYearMonthDay(new Date())
      showYear.value = year
      showMonth.value = month
      showDay.value = day
    }

    const itemClick = (item: CalendarItem) => {
      selectedDay.value = item.format
      console.log(item.format)
    }

    return {
      mode,
      showYear,
      showMonth,
      showDay,
      visibleCalendar,
      weekLists,
      selectedDay,
      currentDay,
      goToday,
      changeCalendar,
      toGoday,
      switchMode,
      itemClick
    }
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss'
</style>
