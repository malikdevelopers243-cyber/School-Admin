import { createContext, useContext, useState, useEffect } from 'react'

const StaffContext = createContext(null)

export function StaffProvider({ children }) {
  const [staffRecords, setStaffRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('staffRecords')
      return saved ? JSON.parse(saved) : {
        male: [],
        female: []
      }
    } catch {
      return {
        male: [],
        female: []
      }
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('staffRecords', JSON.stringify(staffRecords))
    } catch {
      // Ignore localStorage write failures
    }
  }, [staffRecords])

  const addStaffMember = (gender, staffData) => {
    const newStaff = {
      id: Date.now(),
      ...staffData,
      dateAdded: new Date().toLocaleDateString('en-PK'),
      timeAdded: new Date().toLocaleTimeString('en-PK')
    }
    
    setStaffRecords(prev => ({
      ...prev,
      [gender]: [...prev[gender], newStaff]
    }))
  }

  const removeStaffMember = (gender, staffId) => {
    setStaffRecords(prev => ({
      ...prev,
      [gender]: prev[gender].filter(staff => staff.id !== staffId)
    }))
  }

  const getStaffStats = () => {
    const maleCount = staffRecords.male.length
    const femaleCount = staffRecords.female.length
    const totalStaff = maleCount + femaleCount
    const malePercentage = totalStaff > 0 ? Math.round((maleCount / totalStaff) * 100) : 0
    const femalePercentage = totalStaff > 0 ? Math.round((femaleCount / totalStaff) * 100) : 0

    return {
      maleCount,
      femaleCount,
      totalStaff,
      malePercentage,
      femalePercentage
    }
  }

  return (
    <StaffContext.Provider
      value={{
        staffRecords,
        addStaffMember,
        removeStaffMember,
        getStaffStats
      }}
    >
      {children}
    </StaffContext.Provider>
  )
}

export function useStaffContext() {
  const context = useContext(StaffContext)
  if (!context) {
    throw new Error('useStaffContext must be used within StaffProvider')
  }
  return context
}
