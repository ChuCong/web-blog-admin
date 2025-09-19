import { dateFormat, getWeek } from '@/common/dateformat'

export const isSame = (date1, date2, granularity ) => {
    let dt1 = new Date(date1)
    let dt2 = new Date(date2)
    if(granularity === 'date') {
      dt1.setHours(0,0,0,0);
      dt2.setHours(0,0,0,0);
    }
    return dt1.getTime() === dt2.getTime()
}
  
export const daysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate()
}
  
export const weekNumber = (date) => {
    return getWeek(date)
}
  
export const format = (date, mask) => {
    return dateFormat(date, mask)
}
  
export const nextMonth = (date) => {
    let nextMonthDate = new Date(date.getTime())
    nextMonthDate.setDate(1)
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1)
    return nextMonthDate
}
  
export const prevMonth = (date) => {
    let prevMonthDate = new Date(date.getTime())
    prevMonthDate.setDate(1)
    prevMonthDate.setMonth(prevMonthDate.getMonth() - 1)
    return prevMonthDate
}
  
export const validateDateRange = (newDate, min, max) => {
    let max_date = new Date(max);
    let min_date = new Date(min);

    if(max && newDate.getTime() > max_date.getTime()) {
      return max_date;
    }

    if(min && newDate.getTime() < min_date.getTime()) {
      return min_date;
    }

    return newDate;
}
  
export const localeData = (options) => {
    let default_locale = {
      direction: 'ltr',
      format: 'mm/dd/yyyy',
      separator: ' - ',
      applyLabel: 'Apply',
      cancelLabel: 'Cancel',
      weekLabel: 'W',
      customRangeLabel: 'Custom Range',
      daysOfWeek: dateFormat.i18n.dayNames.slice(0, 7).map(d => d.substring(0, 2)),
      monthNames: dateFormat.i18n.monthNames.slice(0, 12),
      firstDay: 0
    };

    return {...default_locale, ...options }
}
  
export const yearMonth = (date) => {
    let month = date.getMonth() + 1
    return date.getFullYear() + (month < 10 ? '0':'') + month
}
  
export const isValidDate = (d) => {
    return d instanceof Date && !isNaN(d)
}
  
export const convertGMT7ToUTC = (gmtDateString) => { //gmtDateString format: yyyy-mm-dd
    // Tạo đối tượng Date từ chuỗi ngày ở GMT+7 (ví dụ: "2024-10-02")
    const localDate = new Date(gmtDateString + "T00:00:00+07:00")

    // Lấy thời gian UTC dưới dạng chuỗi
    const utcDateString = localDate.toISOString().replace('T', ' ').substring(0, 19)

    return utcDateString
}
  
export const convertUTCToGMT7 = (utcDateString) => {
    // Tạo đối tượng Date từ chuỗi UTC (ví dụ: "2024-10-01T17:00:00Z")
    const localDate = new Date(utcDateString)

    // Chuyển đối tượng Date sang chuỗi với định dạng "YYYY-MM-DD HH:mm:ss"
    const year = localDate.getFullYear()
    const month = String(localDate.getMonth() + 1).padStart(2, '0')
    const day = String(localDate.getDate()).padStart(2, '0')
    const hours = String(localDate.getHours()).padStart(2, '0')
    const minutes = String(localDate.getMinutes()).padStart(2, '0')
    const seconds = String(localDate.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
  
export const formatToVNTime = (utcDateString) => {
    const localDate = new Date(utcDateString)

    // Chuyển đối tượng Date sang chuỗi với định dạng "YYYY-MM-DD HH:mm:ss"
    const year = localDate.getFullYear()
    const month = String(localDate.getMonth() + 1).padStart(2, '0')
    const day = String(localDate.getDate()).padStart(2, '0')
    const hours = String(localDate.getHours()).padStart(2, '0')
    const minutes = String(localDate.getMinutes()).padStart(2, '0')
    const seconds = String(localDate.getSeconds()).padStart(2, '0')

    return `${hours}:${minutes} ${day}-${month}-${year}`
}
  
export const addNDay = (dateString, n) => {//dateString format: yyyy-mm-dd
  const date = new Date(dateString)
  date.setDate(date.getDate() + n)

  // Chuyển đổi lại thành chuỗi theo định dạng "YYYY-MM-DD"
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Tháng trong JS bắt đầu từ 0
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const formatDate = (date: Date | string) => {
    if (!date) return '';
    if (typeof date === 'string') return date.slice(0, 10);
    return date.toISOString().slice(0, 10);
};

export const formatTime = (time: string) => {
    if (!time) return '';
    if (typeof time === 'string') return time.slice(0, 5);
    return null;
};


export default {
    formatToVNTime,
    formatDate,
    formatTime
}