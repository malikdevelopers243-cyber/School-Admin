import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FeeProvider } from './context/FeeContext'
import { AttendanceProvider } from './context/AttendanceContext'
import { StaffProvider } from './context/StaffContext'
import { TeacherAttendanceProvider } from './context/TeacherAttendanceContext'
import { StudentProvider } from './context/StudentContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FeeProvider>
      <AttendanceProvider>
        <StaffProvider>
          <TeacherAttendanceProvider>
            <StudentProvider>
              <App />
            </StudentProvider>
          </TeacherAttendanceProvider>
        </StaffProvider>
      </AttendanceProvider>
    </FeeProvider>
  </StrictMode>,
)
