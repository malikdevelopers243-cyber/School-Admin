
import { useEffect, useState } from 'react'
import { CalendarCheck, Banknote, FileText, ClipboardList, Users, Calculator, Award, AlertCircle, UserPlus, Database, Palette, Bot } from 'lucide-react'
import { useFeeContext } from './context/FeeContext'
import { useAttendanceContext } from './context/AttendanceContext'
import { useTeacherAttendanceContext } from './context/TeacherAttendanceContext'
import { useStaffContext } from './context/StaffContext'
import { useStudentContext } from './context/StudentContext'
import Attendance from './components/Attendance'
import CollectFee from './components/CollectFee'
import Reports from './components/Reports'
import Evaluation from './components/Evaluation'
import Staff from './components/Staff'
import Accounts from './components/Accounts'
import Results from './components/Results'
import Complaints from './components/Complaints'
import AddStudent from './components/AddStudent'
import Backup from './components/Backup'
import Theme from './components/Theme'
import AIAssist from './components/AIAssist'
import FeeMonthlyModal from './components/FeeMonthlyModal'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [showFeeModal, setShowFeeModal] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const { 
    recoveryPercentage, 
    totalReceived, 
    totalPending, 
    totalExpected, 
    formatAmount 
  } = useFeeContext()
  const { getTodayStats } = useAttendanceContext()
  const { students } = useStudentContext()
  const { totalPresent, totalAbsent, totalStudents, percentage } = getTodayStats(students)
  const { getDayAttendanceStats } = useTeacherAttendanceContext()
  const { getStaffStats } = useStaffContext()
  
  // Get today's date for teacher attendance
  const today = new Date().toISOString().split('T')[0]
  const teacherStats = getDayAttendanceStats(today)
  const staffStats = getStaffStats()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const dayNumber = currentDate.getDate()
  
  if (currentPage === 'attendance') return <Attendance onBack={() => setCurrentPage('dashboard')} />
  if (currentPage === 'collectfee') return <CollectFee onBack={() => setCurrentPage('dashboard')} />
  if (currentPage === 'reports') return <Reports onBack={() => setCurrentPage('dashboard')} />
  if (currentPage === 'evaluation') return <Evaluation onBack={() => setCurrentPage('dashboard')} />
  if (currentPage === 'staff') return <Staff onBack={() => setCurrentPage('dashboard')} />
  if (currentPage === 'accounts') return <Accounts onBack={() => setCurrentPage('dashboard')} />
  if (currentPage === 'results') return <Results onBack={() => setCurrentPage('dashboard')} />
  if (currentPage === 'complaints') return <Complaints onBack={() => setCurrentPage('dashboard')} />
  if (currentPage === 'addstudent') return <AddStudent onBack={() => setCurrentPage('dashboard')} />
  if (currentPage === 'backup') return <Backup onBack={() => setCurrentPage('dashboard')} />
  if (currentPage === 'theme') return <Theme onBack={() => setCurrentPage('dashboard')} />
  if (currentPage === 'aiassist') return <AIAssist onBack={() => setCurrentPage('dashboard')} />
  
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #d4f5a0 0%, #fef9c3 50%, #fce4ec 100%)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ background: 'linear-gradient(to right, #f97316, #991b1b)' }} className="header-wrap rounded-b-3xl">
          <div className="header-top-left header-date">
            <div>{formattedDate}</div>
            <div className="text-xs italic text-white/80">"1% inspiration, 99% effort."</div>
          </div>

          <div className="header-main">
            <div className="header-logo">
              <img src="/profile.jpeg" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <span className="header-title">Sir Syed Model Public School</span>
          </div>

          <div className="header-top-right">
            <div className="header-badge">{dayNumber}</div>
          </div>
        </div>

        {/* Stats Cards Row */}
        <div className="cards-grid mt-6">
          {/* Students Card */}
          <div className="card bg-blue-100 shadow-md flex flex-col items-center cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-blue-500 text-xl">👤</span>
            <span className="text-blue-600 font-semibold">Students</span>
          </div>
          <div className="relative w-24 h-24 mb-2">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle
                cx="50" cy="50" r="38"
                fill="none"
                stroke="#dbeafe"
                strokeWidth="8"
              />
              <circle
                cx="50" cy="50" r="38"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${percentage * 2.39} 239`}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-blue-600 font-bold text-lg leading-none">
                {percentage}%
              </span>
            </div>
          </div>
          <p className="text-gray-400 text-xs mb-3">Present</p>
          <div className="w-full space-y-1">
            <div className="flex justify-between items-center bg-white/60 rounded-lg px-3 py-1">
              <span className="text-xs text-green-500 font-medium">✅ Present</span>
              <span className="text-xs text-green-600 font-bold">{totalPresent}</span>
            </div>
            <div className="flex justify-between items-center bg-white/60 rounded-lg px-3 py-1">
              <span className="text-xs text-red-400 font-medium">❌ Absent</span>
              <span className="text-xs text-red-500 font-bold">{totalAbsent}</span>
            </div>
          </div>
          <p className="text-blue-500 font-semibold mt-3 text-sm">
            Total: {totalStudents}
          </p>
        </div>

        {/* Fee Card */}
        <div 
          className="card bg-green-100 shadow-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200"
          onClick={() => setShowFeeModal(true)}
        >
          <div className="flex items-center mb-3">
            <span className="text-green-600 text-xl mr-2">₨</span>
            <span className="text-green-600 font-semibold">Fee</span>
          </div>
          <div className="text-green-500 text-3xl font-bold text-center mt-2">{recoveryPercentage}%</div>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${recoveryPercentage}%` }}
            />
          </div>
          <div className="mt-3 space-y-1">
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              <span className="text-green-600 text-sm">Received: {formatAmount(totalReceived)}</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
              <span className="text-red-500 text-sm">Pending: {formatAmount(totalPending)}</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
              <span className="text-orange-500 text-sm">Arrears: 0.0k</span>
            </div>
          </div>
          <div className="text-gray-400 text-xs mt-2">Expected: {formatAmount(totalExpected)}</div>
        </div>

        {/* Staff Card */}
        <div 
          onClick={() => setCurrentPage('staff')}
          className="card bg-pink-100 shadow-md flex flex-col items-center cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          <div className="flex items-center mb-3">
            <span className="text-pink-500 text-xl mr-2">👥</span>
            <span className="text-pink-600 font-semibold">Staff</span>
          </div>
          <div className="relative w-24 h-24 mb-2">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle
                cx="50" cy="50" r="38"
                fill="none"
                stroke="#fce7f3"
                strokeWidth="8"
              />
              <circle
                cx="50" cy="50" r="38"
                fill="none"
                stroke="#ec4899"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${teacherStats.percentage * 2.39} 239`}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-pink-600 font-bold text-lg leading-none">
                {teacherStats.percentage}%
              </span>
            </div>
          </div>
          <p className="text-gray-400 text-xs mb-3">Present</p>
          <div className="w-full space-y-1">
            <div className="flex justify-between items-center bg-white/60 rounded-lg px-3 py-1">
              <span className="text-xs text-green-500 font-medium">✅ Present</span>
              <span className="text-xs text-green-600 font-bold">{teacherStats.present}</span>
            </div>
            <div className="flex justify-between items-center bg-white/60 rounded-lg px-3 py-1">
              <span className="text-xs text-red-400 font-medium">❌ Absent</span>
              <span className="text-xs text-red-500 font-bold">{teacherStats.absent}</span>
            </div>
          </div>
          <p className="text-pink-500 font-semibold mt-3 text-sm">
            Total: {staffStats.totalStaff}
          </p>
        </div>
      </div>

      {/* Admission & Dropout Card */}
      <div className="mt-6 mx-4 sm:mx-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-md p-5 overflow-hidden">
        <div className="font-semibold text-gray-700 text-base mb-4">👥 Admission & Dropout</div>
        <div className="admission-grid">
          <div className="text-center">
            <p className="admission-label text-gray-400 mb-2">Inactive</p>
            <p className="admission-value text-gray-700">0</p>
          </div>
          <div className="text-center">
            <p className="admission-label text-gray-400 mb-2">This Week</p>
            <div>
              <span className="badge-inline bg-green-100 text-green-700">+0</span>
              <span className="badge-inline bg-red-100 text-red-700 ml-2">-0</span>
            </div>
          </div>
          <div className="text-center">
            <p className="admission-label text-gray-400 mb-2">This Month</p>
            <div>
              <span className="badge-inline bg-green-100 text-green-700">+0</span>
              <span className="badge-inline bg-red-100 text-red-700 ml-2">-0</span>
            </div>
          </div>
          <div className="text-center">
            <p className="admission-label text-gray-400 mb-2">3 Months</p>
            <div>
              <span className="badge-inline bg-green-100 text-green-700">+0</span>
              <span className="badge-inline bg-red-100 text-red-700 ml-2">-0</span>
            </div>
          </div>
          <div className="text-center">
            <p className="admission-label text-gray-400 mb-2">6 Months</p>
            <div>
              <span className="badge-inline bg-green-100 text-green-700">+0</span>
              <span className="badge-inline bg-red-100 text-red-700 ml-2">-0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="mt-8">
        <div className="text-gray-700 font-bold text-lg mb-3">Quick Actions</div>
        <div className="quick-grid">
          <button onClick={() => setCurrentPage('attendance')} className="bg-cyan-300 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200">
            <CalendarCheck size={32} color="white" />
            <span className="text-white text-sm font-medium mt-2">Attendance</span>
          </button>
          <button onClick={() => setCurrentPage('collectfee')} className="bg-green-300 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200">
            <Banknote size={32} color="white" />
            <span className="text-white text-sm font-medium mt-2">Collect Fee</span>
          </button>
          <button onClick={() => setCurrentPage('addstudent')} className="bg-purple-300 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200">
            <UserPlus size={32} color="white" />
            <span className="text-white text-sm font-medium mt-2">Add Students</span>
          </button>
          <button onClick={() => setCurrentPage('evaluation')} className="bg-yellow-300 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200">
            <ClipboardList size={32} color="white" />
            <span className="text-white text-sm font-medium mt-2">Evaluation</span>
          </button>
          <button onClick={() => setCurrentPage('staff')} className="bg-pink-300 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200">
            <Users size={32} color="white" />
            <span className="text-white text-sm font-medium mt-2">Staff</span>
          </button>
          <button onClick={() => setCurrentPage('accounts')} className="bg-sky-300 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200">
            <Calculator size={32} color="white" />
            <span className="text-white text-sm font-medium mt-2">Accounts</span>
          </button>
          <button onClick={() => setCurrentPage('results')} className="bg-rose-300 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200">
            <Award size={32} color="white" />
            <span className="text-white text-sm font-medium mt-2">Results</span>
          </button>
          <button onClick={() => setCurrentPage('complaints')} className="bg-amber-300 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200">
            <AlertCircle size={32} color="white" />
            <span className="text-white text-sm font-medium mt-2">Complaints</span>
          </button>
        </div>
      </div>

      {/* Tools Section */}
      <div className="mt-6 pb-10">
        <div className="text-gray-700 font-bold text-lg mb-3">Tools</div>
        <div className="tools-grid">
          <button onClick={() => setCurrentPage('addstudent')} className="bg-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200">
            <UserPlus size={32} color="#374151" />
            <span className="text-gray-700 text-sm font-medium mt-2 underline">Add Student</span>
          </button>
          <button onClick={() => setCurrentPage('backup')} className="bg-purple-300 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200">
            <Database size={32} color="white" />
            <span className="text-white text-sm font-medium mt-2">Backup</span>
          </button>
          <button onClick={() => setCurrentPage('theme')} className="bg-pink-300 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200">
            <Palette size={32} color="white" />
            <span className="text-white text-sm font-medium mt-2">Theme</span>
          </button>
          <button onClick={() => setCurrentPage('aiassist')} className="bg-sky-200 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200">
            <Bot size={32} color="white" />
            <span className="text-white text-sm font-medium mt-2">AI Assist</span>
          </button>
        </div>
      </div>

      {showFeeModal && (
        <FeeMonthlyModal onClose={() => setShowFeeModal(false)} />
      )}
      </div>
    </div>
  )
}

export default App
