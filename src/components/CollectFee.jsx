import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useFeeContext } from '../context/FeeContext'

function CollectFee({ onBack }) {
  const { classes, getStudents, addFeeRecord, feeRecords, feePerStudent } = useFeeContext()
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [feeAmount, setFeeAmount] = useState(feePerStudent)
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value)
    setSelectedStudent('')
  }

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value)
  }

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value)
  }

  const handleFeeAmountChange = (e) => {
    setFeeAmount(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!selectedClass || !selectedStudent || !selectedMonth) {
      setMessage('Please fill all fields')
      setMessageType('error')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    addFeeRecord({
      class: selectedClass,
      studentName: selectedStudent,
      feeAmount,
      month: selectedMonth,
      paymentMethod
    })
    
    setMessage('Fee collected successfully! ✅')
    setMessageType('success')
    
    setTimeout(() => {
      setSelectedClass('')
      setSelectedStudent('')
      setSelectedMonth('')
      setFeeAmount(feePerStudent)
      setPaymentMethod('Cash')
      setMessage('')
    }, 1500)
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #d4f5a0 0%, #fef9c3 50%, #fce4ec 100%)', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(to right, #f97316, #991b1b)' }} className="rounded-b-3xl px-8 py-5 relative flex items-center">
        <button onClick={onBack} className="text-white mr-4 hover:scale-110 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white flex items-center justify-center rounded-xl">
            <span className="text-xl">💰</span>
          </div>
          <span className="text-white text-xl font-bold ml-3">Fee Collection</span>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-gray-700 font-bold text-lg mb-4">Collect Student Fees</h2>
          
          {message && (
            <div className={`mb-4 p-3 rounded-lg text-center font-medium ${
              messageType === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Select Class</label>
              <select
                name="class"
                value={selectedClass}
                onChange={handleClassChange}
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Choose a class...</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Student Name</label>
              <input
                type="text"
                name="studentName"
                value={selectedStudent}
                onChange={handleStudentChange}
                placeholder="Enter student name"
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Fee Amount (Rs.)</label>
              <input
                type="number"
                name="feeAmount"
                value={feeAmount}
                onChange={handleFeeAmountChange}
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Select Month</label>
              <select
                name="month"
                value={selectedMonth}
                onChange={handleMonthChange}
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Choose a month...</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Payment Method</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    paymentMethod === 'Cash'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  💵 Cash
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Online')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    paymentMethod === 'Online'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🏦 Online
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl transition-colors"
            >
              ✅ Collect Fee
            </button>
          </form>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-md p-6">
          <h3 className="text-gray-700 font-bold text-lg mb-3">Recent Fee Records</h3>
          
          {feeRecords.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No fee records yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-2 font-semibold text-gray-700">#</th>
                    <th className="text-left p-2 font-semibold text-gray-700">Student Name</th>
                    <th className="text-left p-2 font-semibold text-gray-700">Class</th>
                    <th className="text-left p-2 font-semibold text-gray-700">Month</th>
                    <th className="text-left p-2 font-semibold text-gray-700">Amount</th>
                    <th className="text-left p-2 font-semibold text-gray-700">Method</th>
                    <th className="text-left p-2 font-semibold text-gray-700">Date</th>
                    <th className="text-left p-2 font-semibold text-gray-700">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {feeRecords.slice().reverse().map((record, index) => (
                    <tr 
                      key={record.id} 
                      className={`border-b border-gray-100 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="p-2">{feeRecords.length - index}</td>
                      <td className="p-2">{record.studentName}</td>
                      <td className="p-2">{record.class}</td>
                      <td className="p-2">{record.month}</td>
                      <td className="p-2">Rs. {record.feeAmount}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.paymentMethod === 'Cash' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {record.paymentMethod}
                        </span>
                      </td>
                      <td className="p-2">{record.date}</td>
                      <td className="p-2">{record.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CollectFee
