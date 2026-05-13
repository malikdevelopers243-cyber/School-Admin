import { useState } from 'react'
import { ArrowLeft, Users, ChevronRight, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useAttendanceContext } from '../context/AttendanceContext'
import { useStudentContext } from '../context/StudentContext'

export default function Attendance({ onBack }) {
  const { classes, markAttendance, getStatus, getClassStats, markAllClass } = useAttendanceContext()
  const { students } = useStudentContext()

  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  if (selectedClass) {
    const classStudents = students.filter(s => s.class === selectedClass && s.status === 'active')
    const stats = getClassStats(selectedDate, selectedClass, students)

    return (
      <div className="min-h-screen p-4 md:p-6"
           style={{ background: 'linear-gradient(135deg, #d4f5a0 0%, #fef9c3 50%, #fce4ec 100%)' }}>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <button
            onClick={() => setSelectedClass(null)}
            className="flex items-center gap-2 bg-white/80 hover:bg-white 
                       text-gray-600 font-medium px-4 py-2 rounded-xl 
                       shadow-sm transition-all">
            <ArrowLeft size={18} /> Classes
          </button>

          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-700">
              Class {selectedClass}
            </h1>
            <p className="text-xs text-gray-400">{selectedDate}</p>
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-white/80 border border-gray-200 rounded-xl 
                       px-3 py-2 text-gray-700 text-sm shadow-sm"/>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl 
                        shadow-md p-4 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-3">
            <div className="text-center bg-green-50 rounded-xl py-3">
              <p className="text-2xl font-bold text-green-500">{stats.present}</p>
              <p className="text-xs text-green-400 mt-1">Present</p>
            </div>
            <div className="text-center bg-red-50 rounded-xl py-3">
              <p className="text-2xl font-bold text-red-400">{stats.absent}</p>
              <p className="text-xs text-red-300 mt-1">Absent</p>
            </div>
            <div className="text-center bg-gray-50 rounded-xl py-3">
              <p className="text-2xl font-bold text-gray-400">{stats.unmarked}</p>
              <p className="text-xs text-gray-300 mt-1">Unmarked</p>
            </div>
            <div className="text-center bg-blue-50 rounded-xl py-3">
              <p className="text-2xl font-bold text-blue-500">{stats.percentage}%</p>
              <p className="text-xs text-blue-300 mt-1">Rate</p>
            </div>
          </div>

          <div className="w-full h-2 bg-gray-100 rounded-full">
            <div
              className="h-full bg-green-400 rounded-full transition-all duration-700"
              style={{ width: `${stats.percentage}%` }}/>
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-5 md:flex-row">
          <button
            onClick={() => markAllClass(selectedDate, selectedClass, 'present', students)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white 
                       font-semibold py-3 rounded-2xl shadow-md 
                       transition-all hover:scale-105 text-sm">
            ✅ Mark All Present
          </button>
          <button
            onClick={() => markAllClass(selectedDate, selectedClass, 'absent', students)}
            className="flex-1 bg-red-400 hover:bg-red-500 text-white 
                       font-semibold py-3 rounded-2xl shadow-md 
                       transition-all hover:scale-105 text-sm">
            ❌ Mark All Absent
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {classStudents.map((student, index) => {
            const status = getStatus(selectedDate, selectedClass, student.id)
            return (
              <div key={student.id}
                   className={`flex items-center justify-between 
                               rounded-2xl px-4 py-3 shadow-sm 
                               transition-all duration-200 ${
                     status === 'present' ? 'bg-green-50 border-2 border-green-200' :
                     status === 'absent'  ? 'bg-red-50 border-2 border-red-200' :
                                            'bg-white/80 border-2 border-transparent'
                   }`}>

                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center 
                                  justify-center font-bold text-sm ${
                    status === 'present' ? 'bg-green-200 text-green-700' :
                    status === 'absent'  ? 'bg-red-200 text-red-600' :
                                          'bg-blue-100 text-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium text-sm">
                      {student.name}
                    </p>
                    <p className={`text-xs font-medium ${
                      status === 'present' ? 'text-green-500' :
                      status === 'absent'  ? 'text-red-400' :
                                            'text-gray-300'
                    }`}>
                      {status === 'present' ? '● Present' :
                       status === 'absent'  ? '● Absent' :
                                             '● Not marked'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => markAttendance(
                      selectedDate, selectedClass, student.id, 'present'
                    )}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold 
                               transition-all duration-200 ${
                      status === 'present'
                        ? 'bg-green-500 text-white shadow-md scale-105'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}>
                    P
                  </button>
                  <button
                    onClick={() => markAttendance(
                      selectedDate, selectedClass, student.id, 'absent'
                    )}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold 
                               transition-all duration-200 ${
                      status === 'absent'
                        ? 'bg-red-500 text-white shadow-md scale-105'
                        : 'bg-red-100 text-red-500 hover:bg-red-200'
                    }`}>
                    A
                  </button>
                </div>

              </div>
            )
          })}
        </div>

      </div>
    )
  }

  let totalPresent = 0, totalAbsent = 0, totalUnmarked = 0
  classes.forEach(cls => {
    const s = getClassStats(selectedDate, cls, students)
    totalPresent += s.present
    totalAbsent += s.absent
    totalUnmarked += s.unmarked
  })
  const totalActiveStudents = students.filter(s => s.status === 'active').length
  const overallPercentage = totalActiveStudents > 0 ? Math.round((totalPresent / totalActiveStudents) * 100) : 0

  const classColors = [
    { bg: 'bg-blue-400',   light: 'bg-blue-50',   text: 'text-blue-500'   },
    { bg: 'bg-purple-400', light: 'bg-purple-50',  text: 'text-purple-500' },
    { bg: 'bg-green-400',  light: 'bg-green-50',   text: 'text-green-500'  },
    { bg: 'bg-pink-400',   light: 'bg-pink-50',    text: 'text-pink-500'   },
    { bg: 'bg-orange-400', light: 'bg-orange-50',  text: 'text-orange-500' },
    { bg: 'bg-cyan-400',   light: 'bg-cyan-50',    text: 'text-cyan-500'   },
    { bg: 'bg-red-400',    light: 'bg-red-50',     text: 'text-red-500'    },
    { bg: 'bg-yellow-400', light: 'bg-yellow-50',  text: 'text-yellow-500' },
    { bg: 'bg-indigo-400', light: 'bg-indigo-50',  text: 'text-indigo-500' },
    { bg: 'bg-teal-400',   light: 'bg-teal-50',    text: 'text-teal-500'   },
    { bg: 'bg-rose-400',   light: 'bg-rose-50',    text: 'text-rose-500'   },
    { bg: 'bg-lime-400',   light: 'bg-lime-50',    text: 'text-lime-500'   },
    { bg: 'bg-amber-400',  light: 'bg-amber-50',   text: 'text-amber-500'  },
  ]

  return (
    <div className="min-h-screen p-4 md:p-6"
         style={{ background: 'linear-gradient(135deg, #d4f5a0 0%, #fef9c3 50%, #fce4ec 100%)' }}>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-white/80 hover:bg-white 
                     text-gray-600 font-medium px-4 py-2 rounded-xl 
                     shadow-sm transition-all">
          <ArrowLeft size={18} /> Dashboard
        </button>

        <h1 className="text-2xl font-bold text-gray-700">📋 Attendance</h1>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-white/80 border border-gray-200 rounded-xl 
                     px-3 py-2 text-gray-700 text-sm shadow-sm"/>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-400 text-xs">Overall Attendance</p>
            <p className="text-3xl font-bold text-gray-700">
              {overallPercentage}%
            </p>
          </div>
          <div className="w-16 h-16 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="38" fill="none"
                      stroke="#e5e7eb" strokeWidth="10"/>
              <circle cx="50" cy="50" r="38" fill="none"
                      stroke="#22c55e" strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${overallPercentage * 2.39} 239`}
                      className="transition-all duration-700"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Users size={20} className="text-gray-400"/>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-50 rounded-2xl p-3 text-center">
            <p className="text-xl font-bold text-green-500">{totalPresent}</p>
            <p className="text-xs text-green-400 mt-0.5">Present</p>
          </div>
          <div className="bg-red-50 rounded-2xl p-3 text-center">
            <p className="text-xl font-bold text-red-400">{totalAbsent}</p>
            <p className="text-xs text-red-300 mt-0.5">Absent</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-3 text-center">
            <p className="text-xl font-bold text-gray-400">{totalUnmarked}</p>
            <p className="text-xs text-gray-300 mt-0.5">Unmarked</p>
          </div>
        </div>
      </div>

      <p className="text-gray-500 font-semibold text-sm mb-3 ml-1">
        Select a class to mark attendance 👇
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {classes.map((className, index) => {
          const stats = getClassStats(selectedDate, className, students)
          const color = classColors[index % classColors.length]

          return (
            <div
              key={className}
              onClick={() => setSelectedClass(className)}
              className={`${color.light} rounded-3xl shadow-md p-5 
                         cursor-pointer hover:shadow-xl hover:scale-105 
                         transition-all duration-200 relative overflow-hidden`}>

              <div className={`absolute top-0 left-0 right-0 h-1.5 
                              ${color.bg} rounded-t-3xl`}/>

              <div className={`w-12 h-12 rounded-2xl ${color.bg} 
                              flex items-center justify-center 
                              text-white font-bold text-lg shadow-md mb-3`}>
                {className}
              </div>

              <p className="text-gray-700 font-semibold text-sm">
                Class {className}
              </p>
              <p className="text-gray-400 text-xs mb-3">40 Students</p>

              <div className="w-full h-1.5 bg-white/60 rounded-full mb-2">
                <div
                  className={`h-full ${color.bg} rounded-full transition-all duration-500`}
                  style={{ width: `${stats.percentage}%` }}/>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <span className="text-xs text-green-500 font-bold">
                    ✅{stats.present}
                  </span>
                  <span className="text-xs text-red-400 font-bold">
                    ❌{stats.absent}
                  </span>
                </div>
                <span className={`text-xs font-bold ${color.text}`}>
                  {stats.percentage}%
                </span>
              </div>

              <ChevronRight size={16} 
                className="absolute top-4 right-4 text-gray-300"/>

            </div>
          )
        })}
      </div>

    </div>
  )
}
