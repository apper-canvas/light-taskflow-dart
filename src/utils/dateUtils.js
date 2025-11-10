import { format, isToday, isTomorrow, isPast, isThisWeek, parseISO } from 'date-fns'

export const formatDate = (date) => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  if (isToday(dateObj)) return 'Today'
  if (isTomorrow(dateObj)) return 'Tomorrow'
  if (isThisWeek(dateObj)) return format(dateObj, 'EEEE')
  return format(dateObj, 'MMM dd')
}

export const formatFullDate = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'MMM dd, yyyy')
}

export const isOverdue = (date) => {
  if (!date) return false
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isPast(dateObj) && !isToday(dateObj)
}

export const sortByDueDate = (tasks) => {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    
    const dateA = typeof a.dueDate === 'string' ? parseISO(a.dueDate) : a.dueDate
    const dateB = typeof b.dueDate === 'string' ? parseISO(b.dueDate) : b.dueDate
    
    return dateA - dateB
  })
}