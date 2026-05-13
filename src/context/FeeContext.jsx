import { createContext, useContext, useState, useEffect } from 'react'

const FeeContext = createContext()

export const useFeeContext = () => {
  const context = useContext(FeeContext)
  if (!context) {
    throw new Error('useFeeContext must be used within a FeeProvider')
  }
  return context
}

export const FeeProvider = ({ children }) => {
  const classes = ['PG', 'Nursery', 'KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th']
  const feePerStudent = 385
  const studentsPerClass = 40
  
  const getStudents = (className) => {
    const students = []
    for (let i = 1; i <= studentsPerClass; i++) {
      students.push(`Student ${i}`)
    }
    return students
  }

  // Load from localStorage on init
  const [feeRecords, setFeeRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('feeRecords')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Save to localStorage whenever feeRecords changes
  useEffect(() => {
    localStorage.setItem('feeRecords', JSON.stringify(feeRecords))
  }, [feeRecords])

  const addFeeRecord = (record) => {
    const newRecord = {
      ...record,
      id: Date.now(),
      date: new Date().toLocaleDateString('en-PK'),
      time: new Date().toLocaleTimeString('en-PK')
    }
    setFeeRecords(prev => [newRecord, ...prev])
  }

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  // Helper to format numbers like 42000 → "42.0k"
  const formatAmount = (amount) => {
    if (amount >= 1000) return (amount / 1000).toFixed(1) + 'k'
    return amount.toString()
  }

  // Computed values
  const totalExpected = classes.length * studentsPerClass * feePerStudent
  const totalReceived = feeRecords.reduce((sum, record) => sum + Number(record.feeAmount), 0)
  const totalPending = totalExpected - totalReceived
  const recoveryPercentage = totalExpected > 0 
    ? Math.round((totalReceived / totalExpected) * 100) 
    : 0

  // Calculate per-month stats from feeRecords
  const monthlyData = months.map((month) => {
    const monthRecords = feeRecords.filter(r => r.month === month)
    const received = monthRecords.reduce((sum, r) => sum + Number(r.feeAmount), 0)
    const expected = classes.length * studentsPerClass * feePerStudent
    const pending = expected - received
    const percentage = Math.round((received / expected) * 100)
    const recordCount = monthRecords.length
    return { month, received, pending, expected, percentage, recordCount }
  })

  const value = {
    classes,
    getStudents,
    feeRecords,
    addFeeRecord,
    totalExpected,
    totalReceived,
    totalPending,
    recoveryPercentage,
    formatAmount,
    monthlyData,
    months,
    feePerStudent
  }

  return (
    <FeeContext.Provider value={value}>
      {children}
    </FeeContext.Provider>
  )
}
