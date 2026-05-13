import { createContext, useContext, useState, useEffect } from 'react'

const TeacherAttendanceContext = createContext(null)

export function TeacherAttendanceProvider({ children }) {
  const [teacherAttendanceRecords, setTeacherAttendanceRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('teacherAttendanceRecords')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('teacherAttendanceRecords', JSON.stringify(teacherAttendanceRecords))
    } catch {
      // Ignore localStorage write failures
    }
  }, [teacherAttendanceRecords])

  const markTeacherAttendance = (date, teacherId, teacherName, gender, data) => {
    setTeacherAttendanceRecords((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        [teacherId]: {
          name: teacherName,
          gender: gender,
          checkIn: data.checkIn || null,
          checkOut: data.checkOut || null,
          status: data.status || 'absent', // present, absent, leave, half-day
          leaveReason: data.leaveReason || '',
          totalHours: data.totalHours || 0,
          timestamp: new Date().toISOString()
        }
      }
    }))
  }

  const getTeacherAttendance = (date, teacherId) => {
    return teacherAttendanceRecords[date]?.[teacherId] || null
  }

  const getDayAttendanceStats = (date) => {
    const dayData = teacherAttendanceRecords[date] || {}
    const teachers = Object.values(dayData)
    
    const present = teachers.filter(t => t.status === 'present').length
    const absent = teachers.filter(t => t.status === 'absent').length
    const onLeave = teachers.filter(t => t.status === 'leave').length
    const halfDay = teachers.filter(t => t.status === 'half-day').length
    const total = teachers.length

    return {
      present,
      absent,
      onLeave,
      halfDay,
      total,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0
    }
  }

  const getWeekAttendanceStats = (weekStart) => {
    const weekStats = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(date.getDate() + i)
      const dateStr = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0')
      const dayStats = getDayAttendanceStats(dateStr)
      
      weekStats.push({
        date: dateStr,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        ...dayStats
      })
    }
    return weekStats
  }

  const getTeacherWeeklyStats = (teacherId, weekStart) => {
    const weekData = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      const attendance = getTeacherAttendance(dateStr, teacherId)
      
      weekData.push({
        date: dateStr,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        ...attendance
      })
    }
    return weekData
  }

  const getCurrentWeekDates = () => {
    const today = new Date()
    const currentDay = today.getDay()
    const weekStart = new Date(today)
    // Simple logic: get to Monday of this week
    // If today is Sunday (0), go back 6 days to previous Monday
    // If today is Monday (1), stay on today  
    // If today is Tuesday (2), go back 1 day to Monday, etc.
    const daysToMonday = currentDay === 0 ? 6 : currentDay - 1
    weekStart.setDate(today.getDate() - daysToMonday)
    weekStart.setHours(0, 0, 0, 0)
    
    return weekStart
  }

  const getWeekDays = () => {
    const weekStart = getCurrentWeekDates()
    const days = []
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      
      days.push({
        date: date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0'),
        dayName: dayNames[i],
        dayNumber: date.getDate(),
        isToday: date.toDateString() === new Date().toDateString(),
        isWeekend: i === 5 || i === 6 // Saturday and Sunday
      })
    }
    
    return days
  }

  return (
    <TeacherAttendanceContext.Provider
      value={{
        teacherAttendanceRecords,
        markTeacherAttendance,
        getTeacherAttendance,
        getDayAttendanceStats,
        getWeekAttendanceStats,
        getTeacherWeeklyStats,
        getCurrentWeekDates,
        getWeekDays
      }}
    >
      {children}
    </TeacherAttendanceContext.Provider>
  )
}

export function useTeacherAttendanceContext() {
  const context = useContext(TeacherAttendanceContext)
  if (!context) {
    throw new Error('useTeacherAttendanceContext must be used within TeacherAttendanceProvider')
  }
  return context
}
