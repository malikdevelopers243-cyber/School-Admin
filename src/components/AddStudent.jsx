import { useState } from 'react'
import { ArrowLeft, User, Phone, MapPin, School, FileText, X, Edit } from 'lucide-react'
import { useStudentContext } from '../context/StudentContext'

function AddStudent({ onBack }) {
  const { addStudent, students, getStudentStats, removeStudent, updateStudent } = useStudentContext()
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    class: '1st',
    bformId: '',
    fatherContact: '',
    address: '',
    cast: '',
    pastSchool: ''
  })

  const classes = ['PG', 'Nursery', 'KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th']
  const stats = getStudentStats()
  const totalStudents = students.length

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name || !formData.fatherName || !formData.fatherContact) {
      alert('Please fill in all required fields (Name, Father Name, Father Contact)')
      return
    }

    // Add student
    addStudent(formData)
    
    // Reset form
    setFormData({
      name: '',
      fatherName: '',
      class: '1st',
      bformId: '',
      fatherContact: '',
      address: '',
      cast: '',
      pastSchool: ''
    })
    
    alert('Student added successfully!')
  }

  const handleRemoveStudent = (studentId, studentName) => {
    if (window.confirm(`Are you sure you want to remove ${studentName} from the school?`)) {
      removeStudent(studentId)
      alert(`${studentName} has been removed from the school.`)
    }
  }

  const handleToggleStatus = (student) => {
    const newStatus = student.status === 'active' ? 'inactive' : 'active'
    updateStudent(student.id, { status: newStatus })
    alert(`${student.name} is now ${newStatus}.`)
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #d4f5a0 0%, #fef9c3 50%, #fce4ec 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(to right, #f97316, #991b1b)' }} className="rounded-b-3xl px-8 py-5 relative flex items-center">
        <button onClick={onBack} className="text-white mr-4 hover:scale-110 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white flex items-center justify-center rounded-xl">
            <span className="text-xl">➕</span>
          </div>
          <span className="text-white text-xl font-bold ml-3">Add Student</span>
        </div>
      </div>

      <div className="p-6">
        {/* Admission Form */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-700 font-bold text-xl">Student Admission Form</h2>
            <div className="bg-purple-100 px-4 py-2 rounded-xl">
              <span className="text-purple-700 font-semibold">Total Students: {stats.total}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Student Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-1" />
                  Student Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  placeholder="Enter student name"
                  required
                />
              </div>

              {/* Father Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-1" />
                  Father Name *
                </label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  placeholder="Enter father name"
                  required
                />
              </div>

              {/* Class */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <School size={16} className="inline mr-1" />
                  Class *
                </label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  required
                >
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              {/* B-Form/ID Card */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} className="inline mr-1" />
                  B-Form / ID Card
                </label>
                <input
                  type="text"
                  name="bformId"
                  value={formData.bformId}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  placeholder="Enter B-Form or ID number"
                />
              </div>

              {/* Father Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-1" />
                  Father Contact *
                </label>
                <input
                  type="tel"
                  name="fatherContact"
                  value={formData.fatherContact}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  placeholder="Enter father's contact number"
                  required
                />
              </div>

              {/* Cast */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-1" />
                  Cast
                </label>
                <input
                  type="text"
                  name="cast"
                  value={formData.cast}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  placeholder="Enter cast"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-1" />
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                  placeholder="Enter complete address"
                />
              </div>

              {/* Past School */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <School size={16} className="inline mr-1" />
                  Past School
                </label>
                <input
                  type="text"
                  name="pastSchool"
                  value={formData.pastSchool}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  placeholder="Enter previous school name"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                Register Student
              </button>
            </div>
          </form>
        </div>

        {/* Students List */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-700 font-bold text-lg">All Students ({stats.total})</h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-green-600 font-medium">Active: {stats.active}</span>
              <span className="text-red-600 font-medium">Inactive: {stats.inactive}</span>
              <span className="text-purple-600 font-medium">In Attendance: {totalStudents}</span>
            </div>
          </div>

          {students.length === 0 ? (
            <div className="text-center py-8">
              <User size={48} className="text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No students registered yet</p>
              <p className="text-gray-400 text-sm mt-1">Add your first student using the form above</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {students.map((student) => (
                <div
                  key={student.id}
                  className={`bg-white/80 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all ${
                    student.status === 'inactive' ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      student.status === 'active' ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      <User size={20} className={student.status === 'active' ? 'text-purple-600' : 'text-gray-600'} />
                    </div>
                    <div>
                      <p className={`font-semibold ${student.status === 'active' ? 'text-gray-800' : 'text-gray-500'}`}>
                        {student.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {student.class} • Father: {student.fatherName}
                      </p>
                      <p className="text-xs text-gray-500">
                        📞 {student.fatherContact} • 📍 {student.address || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {student.status}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {student.admissionDate}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleToggleStatus(student)}
                        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
                        title={student.status === 'active' ? 'Mark as Inactive' : 'Mark as Active'}
                      >
                        <Edit size={14} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleRemoveStudent(student.id, student.name)}
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                        title="Remove Student"
                      >
                        <X size={14} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddStudent
