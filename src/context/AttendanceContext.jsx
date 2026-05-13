import { createContext, useContext, useEffect, useState } from 'react'

const AttendanceContext = createContext(null)

const classes = [
  'PG', 'Nursery', 'KG', '1st', '2nd', '3rd',
  '4th', '5th', '6th', '7th', '8th', '9th', '10th'
]

export function AttendanceProvider({ children }) {
  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('attendanceRecords')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords))
    } catch {
      // Ignore localStorage write failures
    }
  }, [attendanceRecords])

  const markAttendance = (date, className, studentId, status) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        [className]: {
          ...(prev[date]?.[className] || {}),
          [studentId]: status
        }
      }
    }))
  }

  const getStatus = (date, className, studentId) => {
    return attendanceRecords[date]?.[className]?.[studentId] || null
  }

  const getClassStats = (date, className, allStudents) => {
    const classData = attendanceRecords[date]?.[className] || {}
    const classStudents = allStudents.filter(s => s.class === className && s.status === 'active')
    const total = classStudents.length
    const present = classStudents.filter(s => classData[s.id] === 'present').length
    const absent = classStudents.filter(s => classData[s.id] === 'absent').length
    const unmarked = total - present - absent
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0
    return { present, absent, unmarked, total, percentage }
  }

  const getTodayStats = (allStudents) => {
    const today = new Date().toISOString().split('T')[0]
    let totalPresent = 0
    let totalAbsent = 0
    const activeStudents = allStudents.filter(s => s.status === 'active')
    
    classes.forEach((cls) => {
      const stats = getClassStats(today, cls, allStudents)
      totalPresent += stats.present
      totalAbsent += stats.absent
    })
    
    const totalStudents = activeStudents.length
    const percentage = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0
    return { totalPresent, totalAbsent, totalStudents, percentage }
  }

  const markAllClass = (date, className, status, allStudents) => {
    const classStudents = allStudents.filter(s => s.class === className && s.status === 'active')
    const classData = {}
    classStudents.forEach((student) => {
      classData[student.id] = status
    })
    setAttendanceRecords((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        [className]: classData
      }
    }))
  }

  return (
    <AttendanceContext.Provider
      value={{
        classes,
        attendanceRecords,
        markAttendance,
        getStatus,
        getClassStats,
        getTodayStats,
        markAllClass
      }}
    >
      {children}
    </AttendanceContext.Provider>
  )
}

export function useAttendanceContext() {
  const context = useContext(AttendanceContext)
  if (!context) {
    throw new Error('useAttendanceContext must be used within AttendanceProvider')
  }
  return context
}

// Helper function to get students for attendance
export const getStudentsForAttendance = (allStudents, className) => {
  return allStudents.filter(student => student.class === className && student.status === 'active')
}
