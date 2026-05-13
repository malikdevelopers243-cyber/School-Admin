import { useState, useEffect } from 'react'
import { ArrowLeft, Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle, Coffee, LogIn, LogOut, FileText } from 'lucide-react'
import { useTeacherAttendanceContext } from '../context/TeacherAttendanceContext'
import { useStaffContext } from '../context/StaffContext'

export default function TeacherAttendance({ onBack, filteredGender }) {
  const { 
    markTeacherAttendance, 
    getTeacherAttendance, 
    getDayAttendanceStats, 
    getWeekAttendanceStats,
    getWeekDays,
    getCurrentWeekDates
  } = useTeacherAttendanceContext()
  
  const { staffRecords } = useStaffContext()
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [weekStart, setWeekStart] = useState(getCurrentWeekDates())
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showCheckInForm, setShowCheckInForm] = useState(false)
  const [showLeaveForm, setShowLeaveForm] = useState(false)
  const [leaveReason, setLeaveReason] = useState('')

  const weekDays = getWeekDays()
  const weekStats = getWeekAttendanceStats(weekStart)
  const dayStats = getDayAttendanceStats(selectedDate)
  
  // Get teachers based on filteredGender or all teachers
  const allTeachers = filteredGender 
    ? staffRecords[filteredGender].map(t => ({ ...t, gender: filteredGender }))
    : [
        ...staffRecords.male.map(t => ({ ...t, gender: 'male' })),
        ...staffRecords.female.map(t => ({ ...t, gender: 'female' }))
      ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleCheckIn = (teacher) => {
    const now = new Date()
    const timeString = now.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })
    
    markTeacherAttendance(selectedDate, teacher.id, teacher.name, teacher.gender, {
      checkIn: timeString,
      status: 'present'
    })
    
    setSelectedTeacher(null)
    setShowCheckInForm(false)
  }

  const handleCheckOut = (teacher) => {
    const now = new Date()
    const timeString = now.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })
    const existing = getTeacherAttendance(selectedDate, teacher.id)
    
    if (existing && existing.checkIn) {
      const checkInTime = new Date(`2000/01/01 ${existing.checkIn}`)
      const checkOutTime = new Date(`2000/01/01 ${timeString}`)
      const hours = Math.abs(checkOutTime - checkInTime) / 36e5
      
      markTeacherAttendance(selectedDate, teacher.id, teacher.name, teacher.gender, {
        ...existing,
        checkOut: timeString,
        totalHours: Math.round(hours * 100) / 100
      })
    }
    
    setSelectedTeacher(null)
  }

  const handleMarkLeave = (teacher) => {
    markTeacherAttendance(selectedDate, teacher.id, teacher.name, teacher.gender, {
      status: 'leave',
      leaveReason: leaveReason
    })
    
    setSelectedTeacher(null)
    setShowLeaveForm(false)
    setLeaveReason('')
  }

  const handleMarkAbsent = (teacher) => {
    markTeacherAttendance(selectedDate, teacher.id, teacher.name, teacher.gender, {
      status: 'absent'
    })
    
    setSelectedTeacher(null)
  }

  const formatTime = (time) => {
    return time || '--:--'
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return 'bg-green-100 text-green-700 border-green-300'
      case 'absent': return 'bg-red-100 text-red-700 border-red-300'
      case 'leave': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'half-day': return 'bg-orange-100 text-orange-700 border-orange-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'present': return <CheckCircle size={16} className="text-green-600" />
      case 'absent': return <XCircle size={16} className="text-red-600" />
      case 'leave': return <Coffee size={16} className="text-yellow-600" />
      case 'half-day': return <AlertCircle size={16} className="text-orange-600" />
      default: return <Clock size={16} className="text-gray-400" />
    }
  }

  if (selectedTeacher) {
    const attendance = getTeacherAttendance(selectedDate, selectedTeacher.id)
    
    return (
      <div className="min-h-screen p-4 md:p-6"
           style={{ background: 'linear-gradient(135deg, #d4f5a0 0%, #fef9c3 50%, #fce4ec 100%)' }}>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedTeacher(null)}
            className="flex items-center gap-2 bg-white/80 hover:bg-white 
                       text-gray-600 font-medium px-4 py-2 rounded-xl 
                       shadow-sm transition-all">
            <ArrowLeft size={18} /> All Teachers
          </button>

          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-700">{selectedTeacher.name}</h1>
            <p className="text-xs text-gray-400">
              {selectedDate} • {selectedTeacher.gender === 'male' ? '👨‍🏫' : '👩‍🏫'} {selectedTeacher.gender}
            </p>
          </div>

          <div className="text-sm text-gray-500">
            {currentTime.toLocaleTimeString('en-PK')}
          </div>
        </div>

        {/* Teacher Info Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-5 mb-5">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              selectedTeacher.gender === 'male' ? 'bg-blue-100' : 'bg-pink-100'
            }`}>
              <Users size={28} className={selectedTeacher.gender === 'male' ? 'text-blue-600' : 'text-pink-600'} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800">{selectedTeacher.name}</h3>
              <p className="text-sm text-gray-600">Father: {selectedTeacher.fatherName}</p>
              <p className="text-sm text-gray-600">Education: {selectedTeacher.education}</p>
            </div>
          </div>

          {/* Current Status */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Today's Status:</span>
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(attendance?.status)}`}>
                {getStatusIcon(attendance?.status)}
                <span className="ml-1 capitalize">{attendance?.status || 'not marked'}</span>
              </div>
            </div>

            {attendance && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <LogIn size={14} className="text-green-600" />
                  <span className="text-gray-600">Check-in: {formatTime(attendance.checkIn)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <LogOut size={14} className="text-red-600" />
                  <span className="text-gray-600">Check-out: {formatTime(attendance.checkOut)}</span>
                </div>
                {attendance.totalHours > 0 && (
                  <div className="flex items-center gap-2 col-span-2">
                    <Clock size={14} className="text-blue-600" />
                    <span className="text-gray-600">Total Hours: {attendance.totalHours}h</span>
                  </div>
                )}
                {attendance.leaveReason && (
                  <div className="flex items-center gap-2 col-span-2">
                    <FileText size={14} className="text-yellow-600" />
                    <span className="text-gray-600">Leave Reason: {attendance.leaveReason}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!attendance?.checkIn && (
            <button
              onClick={() => handleCheckIn(selectedTeacher)}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
              <LogIn size={20} />
              Check In Now
            </button>
          )}

          {attendance?.checkIn && !attendance?.checkOut && (
            <button
              onClick={() => handleCheckOut(selectedTeacher)}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
              <LogOut size={20} />
              Check Out Now
            </button>
          )}

          {!attendance && (
            <>
              <button
                onClick={() => setShowLeaveForm(true)}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                <Coffee size={20} />
                Mark on Leave
              </button>

              <button
                onClick={() => handleMarkAbsent(selectedTeacher)}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                <XCircle size={20} />
                Mark Absent
              </button>
            </>
          )}
        </div>

        {/* Leave Form */}
        {showLeaveForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Mark on Leave</h3>
              <textarea
                placeholder="Enter leave reason..."
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 resize-none h-24 mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => handleMarkLeave(selectedTeacher)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-xl"
                >
                  Mark Leave
                </button>
                <button
                  onClick={() => {
                    setShowLeaveForm(false)
                    setLeaveReason('')
                  }}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    )
  }

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

        <h1 className="text-2xl font-bold text-gray-700">
          {filteredGender === 'male' ? '👨‍🏫 Male Teacher Attendance' : 
           filteredGender === 'female' ? '👩‍🏫 Female Teacher Attendance' : 
           '👨‍🏫 Teacher Attendance'}
        </h1>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-white/80 border border-gray-200 rounded-xl 
                     px-3 py-2 text-gray-700 text-sm shadow-sm"/>
      </div>

      {/* Weekly Calendar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-700">Weekly Overview</h2>
          <div className="text-sm text-gray-500">
            {weekStart.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })} - 
            {new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((day, index) => {
            const stats = weekStats[index]
            return (
              <div
                key={day.date}
                onClick={() => setSelectedDate(day.date)}
                className={`text-center p-3 rounded-xl cursor-pointer transition-all ${
                  day.isToday ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-50 hover:bg-gray-100'
                } ${day.isWeekend ? 'opacity-60' : ''}`}
              >
                <div className="text-xs font-medium text-gray-600 mb-1">{day.dayName}</div>
                <div className={`text-lg font-bold ${day.isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                  {day.dayNumber}
                </div>
                <div className="mt-2 space-y-1">
                  <div className="text-xs text-green-600 font-medium">
                    ✓ {stats.present}
                  </div>
                  <div className="text-xs text-red-500">
                    ✗ {stats.absent}
                  </div>
                  <div className="text-xs text-yellow-600">
                    ☕ {stats.onLeave}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Day Stats */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-4 mb-6">
        <h3 className="text-gray-700 font-bold text-lg mb-3">
          {new Date(selectedDate).toLocaleDateString('en-PK', { weekday: 'long', month: 'long', day: 'numeric' })} Statistics
        </h3>
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center bg-green-50 rounded-xl py-3">
            <p className="text-2xl font-bold text-green-500">{dayStats.present}</p>
            <p className="text-xs text-green-400 mt-1">Present</p>
          </div>
          <div className="text-center bg-red-50 rounded-xl py-3">
            <p className="text-2xl font-bold text-red-400">{dayStats.absent}</p>
            <p className="text-xs text-red-300 mt-1">Absent</p>
          </div>
          <div className="text-center bg-yellow-50 rounded-xl py-3">
            <p className="text-2xl font-bold text-yellow-500">{dayStats.onLeave}</p>
            <p className="text-xs text-yellow-400 mt-1">On Leave</p>
          </div>
          <div className="text-center bg-blue-50 rounded-xl py-3">
            <p className="text-2xl font-bold text-blue-500">{dayStats.percentage}%</p>
            <p className="text-xs text-blue-300 mt-1">Rate</p>
          </div>
        </div>

        <div className="w-full h-2 bg-gray-100 rounded-full mt-3">
          <div
            className="h-full bg-green-400 rounded-full transition-all duration-500"
            style={{ width: `${dayStats.percentage}%` }}/>
        </div>
      </div>

      {/* Teachers List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-700 font-bold text-lg">All Teachers</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-600">Present: {allTeachers.filter(t => getTeacherAttendance(selectedDate, t.id)?.status === 'present').length}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-gray-600">Absent: {allTeachers.filter(t => getTeacherAttendance(selectedDate, t.id)?.status === 'absent').length}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span className="text-gray-600">Leave: {allTeachers.filter(t => getTeacherAttendance(selectedDate, t.id)?.status === 'leave').length}</span>
            </div>
          </div>
        </div>
        
        {allTeachers.length === 0 ? (
          <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-2xl">
            <Users size={48} className="text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No teachers added yet</p>
            <p className="text-gray-400 text-sm mt-1">Add teachers in Staff Management first</p>
          </div>
        ) : (
          allTeachers.map((teacher) => {
            const attendance = getTeacherAttendance(selectedDate, teacher.id)
            return (
              <div
                key={teacher.id}
                onClick={() => setSelectedTeacher(teacher)}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm 
                         cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200
                         ${attendance?.status === 'absent' ? 'ring-2 ring-red-300 bg-red-50/50' : ''}
                         ${attendance?.status === 'leave' ? 'ring-2 ring-yellow-300 bg-yellow-50/50' : ''}
                         ${!attendance ? 'ring-2 ring-gray-300 bg-gray-50/50' : ''}
                         ${attendance?.status === 'present' ? 'ring-2 ring-green-300 bg-green-50/50' : ''}
                         `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      teacher.gender === 'male' ? 'bg-blue-100' : 'bg-pink-100'
                    }`}>
                      <Users size={20} className={teacher.gender === 'male' ? 'text-blue-600' : 'text-pink-600'} />
                    </div>
                    <div>
                      <p className="text-gray-800 font-bold text-base">{teacher.name}</p>
                      <p className="text-gray-500 text-xs">
                        {teacher.gender === 'male' ? '👨‍🏫' : '👩‍🏫'} {teacher.gender} • {teacher.education}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(attendance?.status)}`}>
                        {getStatusIcon(attendance?.status)}
                        <span className="ml-1 capitalize">{attendance?.status || 'not marked'}</span>
                      </div>
                      {attendance && (
                        <div className="text-xs text-gray-500 mt-1">
                          {attendance.checkIn && `In: ${attendance.checkIn}`}
                          {attendance.checkOut && ` • Out: ${attendance.checkOut}`}
                          {attendance.totalHours > 0 && ` • ${attendance.totalHours}h`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

    </div>
  )
}
