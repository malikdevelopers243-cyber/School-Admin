import { createContext, useContext, useState, useEffect } from 'react'

const StudentContext = createContext(null)

export function StudentProvider({ children }) {
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('students')
      if (saved) {
        return JSON.parse(saved)
      }
      
      // Initialize with default 520 students (40 per class, 13 classes)
      const defaultStudents = []
      const classes = ['PG', 'Nursery', 'KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th']
      
      classes.forEach(className => {
        for (let i = 1; i <= 40; i++) {
          defaultStudents.push({
            id: `${className}-${i}`,
            name: `Student ${i}`,
            fatherName: `Father of Student ${i}`,
            class: className,
            bformId: `CNIC-${Math.floor(Math.random() * 1000000000000)}`,
            fatherContact: `03${Math.floor(Math.random() * 10000000000)}`,
            address: `Address ${i}`,
            cast: 'General',
            pastSchool: 'Previous School',
            admissionDate: new Date().toLocaleDateString('en-PK'),
            admissionTime: new Date().toLocaleTimeString('en-PK'),
            status: 'active'
          })
        }
      })
      
      return defaultStudents
    } catch (error) {
      console.error('StudentContext initialization error:', error)
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('students', JSON.stringify(students))
    } catch {
      // Ignore localStorage write failures
    }
  }, [students])

  const addStudent = (studentData) => {
    const newStudent = {
      id: Date.now(),
      ...studentData,
      admissionDate: new Date().toLocaleDateString('en-PK'),
      admissionTime: new Date().toLocaleTimeString('en-PK'),
      status: 'active'
    }
    
    setStudents(prev => [newStudent, ...prev])
    return newStudent
  }

  const removeStudent = (studentId) => {
    setStudents(prev => prev.filter(student => student.id !== studentId))
  }

  const updateStudent = (studentId, updatedData) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, ...updatedData } : student
    ))
  }

  const getStudentById = (studentId) => {
    return students.find(student => student.id === studentId)
  }

  const getStudentsByClass = (className) => {
    return students.filter(student => student.class === className)
  }

  const getStudentStats = () => {
    const total = students.length
    const active = students.filter(s => s.status === 'active').length
    const inactive = students.filter(s => s.status === 'inactive').length
    
    // Class-wise distribution
    const classes = ['PG', 'Nursery', 'KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th']
    const classDistribution = classes.map(className => ({
      class: className,
      count: students.filter(s => s.class === className).length
    }))

    return {
      total,
      active,
      inactive,
      classDistribution
    }
  }

  return (
    <StudentContext.Provider
      value={{
        students,
        addStudent,
        removeStudent,
        updateStudent,
        getStudentById,
        getStudentsByClass,
        getStudentStats
      }}
    >
      {children}
    </StudentContext.Provider>
  )
}

export function useStudentContext() {
  const context = useContext(StudentContext)
  if (!context) {
    throw new Error('useStudentContext must be used within StudentProvider')
  }
  return context
}
