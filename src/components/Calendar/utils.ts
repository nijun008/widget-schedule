interface DateInfo {
  year: number,
  month: number,
  day: number,
  weekDay: number
}

export const getYearMonthDay = (date : Date): DateInfo => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const weekDay = date.getDay()
  return { year, month, day, weekDay }
}
