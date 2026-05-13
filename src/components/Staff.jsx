import { useState } from 'react'
import { ArrowLeft, Users, Plus, X, User, BookOpen, Calendar, Clock } from 'lucide-react'
import { useStaffContext } from '../context/StaffContext'
import TeacherAttendance from './TeacherAttendance'

function Staff({ onBack }) {
  const { staffRecords, addStaffMember, removeStaffMember, getStaffStats } = useStaffContext()
  const [selectedGender, setSelectedGender] = useState(null)
  const [showTeacherAttendance, setShowTeacherAttendance] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newStaff, setNewStaff] = useState({
    name: '',
    fatherName: '',
    education: ''
  })

  const stats = getStaffStats()

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.fatherName && newStaff.education && selectedGender) {
      addStaffMember(selectedGender, newStaff)
      setNewStaff({ name: '', fatherName: '', education: '' })
      setShowAddForm(false)
    }
  }

  const handleRemoveStaff = (staffId) => {
    removeStaffMember(selectedGender, staffId)
  }

  if (showTeacherAttendance) {
    return (
      <TeacherAttendance 
        onBack={() => setShowTeacherAttendance(false)} 
        filteredGender={selectedGender}
      />
    )
  }

  if (selectedGender) {
    const staffList = staffRecords[selectedGender]
    const maxCapacity = 30
    const availableSlots = maxCapacity - staffList.length

    return (
      <div className="min-h-screen p-4 md:p-6"
           style={{ background: 'linear-gradient(135deg, #d4f5a0 0%, #fef9c3 50%, #fce4ec 100%)' }}>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedGender(null)}
            className="flex items-center gap-2 bg-white/80 hover:bg-white 
                       text-gray-600 font-medium px-4 py-2 rounded-xl 
                       shadow-sm transition-all">
            <ArrowLeft size={18} /> Staff Sections
          </button>

          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-700">
              {selectedGender === 'male' ? '👨‍🏫 Male Staff' : '👩‍🏫 Female Staff'}
            </h1>
            <p className="text-xs text-gray-400">{staffList.length}/{maxCapacity} Teachers</p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              disabled={availableSlots === 0}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                availableSlots > 0
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}>
              <Plus size={18} className="inline mr-1" />
              Add Teacher
            </button>
            <button
              onClick={() => setShowTeacherAttendance(true)}
              className="px-4 py-2 rounded-xl font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-lg">
              <Clock size={18} className="inline mr-1" />
              📝 Attendance
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-4 mb-5">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center bg-blue-50 rounded-xl py-3">
              <p className="text-2xl font-bold text-blue-500">{staffList.length}</p>
              <p className="text-xs text-blue-400 mt-1">Total Teachers</p>
            </div>
            <div className="text-center bg-green-50 rounded-xl py-3">
              <p className="text-2xl font-bold text-green-500">{availableSlots}</p>
              <p className="text-xs text-green-400 mt-1">Available Slots</p>
            </div>
            <div className="text-center bg-purple-50 rounded-xl py-3">
              <p className="text-2xl font-bold text-purple-500">
                {Math.round((staffList.length / maxCapacity) * 100)}%
              </p>
              <p className="text-xs text-purple-400 mt-1">Occupancy</p>
            </div>
          </div>

          <div className="w-full h-2 bg-gray-100 rounded-full mt-3">
            <div
              className="h-full bg-purple-400 rounded-full transition-all duration-500"
              style={{ width: `${(staffList.length / maxCapacity) * 100}%` }}/>
          </div>
        </div>

        {/* Add Teacher Form */}
        {showAddForm && availableSlots > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 mb-5">
            <h3 className="text-gray-700 font-bold text-lg mb-4">Add New Teacher</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Teacher Name"
                value={newStaff.name}
                onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Father Name"
                value={newStaff.fatherName}
                onChange={(e) => setNewStaff({...newStaff, fatherName: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Education (e.g., M.Sc, B.Ed, MA)"
                value={newStaff.education}
                onChange={(e) => setNewStaff({...newStaff, education: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleAddStaff}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-all"
                >
                  ✅ Add Teacher
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setNewStaff({ name: '', fatherName: '', education: '' })
                  }}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 rounded-xl transition-all"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Teachers List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {staffList.map((teacher, index) => (
            <div key={teacher.id}
                 className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border-2 border-transparent hover:border-blue-200 transition-all duration-200">
              
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-bold text-base">{teacher.name}</p>
                    <p className="text-gray-500 text-xs">Teacher #{index + 1}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveStaff(teacher.id)}
                  className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-all">
                  <X size={16} className="text-red-600" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">Father:</span> {teacher.fatherName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">Education:</span> {teacher.education}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-500">
                    Added: {teacher.dateAdded} at {teacher.timeAdded}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {staffList.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No teachers added yet</p>
            <p className="text-gray-400 text-sm mt-1">Click "Add Teacher" to get started</p>
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

        <h1 className="text-2xl font-bold text-gray-700">👥 Staff Management</h1>

        <div className="w-10"></div>
      </div>

      {/* Overall Stats */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-400 text-xs">Total Staff Members</p>
            <p className="text-3xl font-bold text-gray-700">{stats.totalStaff}</p>
          </div>
          <div className="w-16 h-16 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="38" fill="none"
                      stroke="#e5e7eb" strokeWidth="10"/>
              <circle cx="50" cy="50" r="38" fill="none"
                      stroke="#8b5cf6" strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${stats.totalStaff > 0 ? (stats.totalStaff / 60) * 239 : 0} 239`}
                      className="transition-all duration-700"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Users size={20} className="text-gray-400"/>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-2xl p-3 text-center">
            <p className="text-xl font-bold text-blue-500">{stats.maleCount}</p>
            <p className="text-xs text-blue-400 mt-0.5">Male Staff</p>
          </div>
          <div className="bg-pink-50 rounded-2xl p-3 text-center">
            <p className="text-xl font-bold text-pink-500">{stats.femaleCount}</p>
            <p className="text-xs text-pink-400 mt-0.5">Female Staff</p>
          </div>
        </div>
      </div>

      <p className="text-gray-500 font-semibold text-sm mb-3 ml-1">
        Select a staff section to manage teachers 👇
      </p>

      {/* Gender Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => setSelectedGender('male')}
          className="bg-blue-50 rounded-3xl shadow-md p-6 
                     cursor-pointer hover:shadow-xl hover:scale-105 
                     transition-all duration-200 relative overflow-hidden">

          <div className="absolute top-0 left-0 right-0 h-2 bg-blue-400 rounded-t-3xl"/>

          <div className="w-16 h-16 rounded-2xl bg-blue-400 
                          flex items-center justify-center 
                          text-white font-bold text-2xl shadow-md mb-4">
            👨‍🏫
          </div>

          <p className="text-gray-700 font-bold text-lg mb-2">Male Staff</p>
          <p className="text-gray-400 text-sm mb-4">Maximum 30 Teachers</p>

          <div className="w-full h-3 bg-white/60 rounded-full mb-3">
            <div
              className="h-full bg-blue-400 rounded-full transition-all duration-500"
              style={{ width: `${(stats.maleCount / 30) * 100}%` }}/>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-blue-600">
              {stats.maleCount}/30 Teachers
            </span>
            <span className="text-sm font-bold text-blue-500">
              {Math.round((stats.maleCount / 30) * 100)}%
            </span>
          </div>
        </div>

        <div
          onClick={() => setSelectedGender('female')}
          className="bg-pink-50 rounded-3xl shadow-md p-6 
                     cursor-pointer hover:shadow-xl hover:scale-105 
                     transition-all duration-200 relative overflow-hidden">

          <div className="absolute top-0 left-0 right-0 h-2 bg-pink-400 rounded-t-3xl"/>

          <div className="w-16 h-16 rounded-2xl bg-pink-400 
                          flex items-center justify-center 
                          text-white font-bold text-2xl shadow-md mb-4">
            👩‍🏫
          </div>

          <p className="text-gray-700 font-bold text-lg mb-2">Female Staff</p>
          <p className="text-gray-400 text-sm mb-4">Maximum 30 Teachers</p>

          <div className="w-full h-3 bg-white/60 rounded-full mb-3">
            <div
              className="h-full bg-pink-400 rounded-full transition-all duration-500"
              style={{ width: `${(stats.femaleCount / 30) * 100}%` }}/>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-pink-600">
              {stats.femaleCount}/30 Teachers
            </span>
            <span className="text-sm font-bold text-pink-500">
              {Math.round((stats.femaleCount / 30) * 100)}%
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Staff
