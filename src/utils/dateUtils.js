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
    const dueDateA = a.due_date_c || a.dueDate
    const dueDateB = b.due_date_c || b.dueDate
    
    if (!dueDateA && !dueDateB) return 0
    if (!dueDateA) return 1
    if (!dueDateB) return -1
    
    const dateA = typeof dueDateA === 'string' ? parseISO(dueDateA) : dueDateA
    const dateB = typeof dueDateB === 'string' ? parseISO(dueDateB) : dueDateB
    
    return dateA - dateB
  })
}