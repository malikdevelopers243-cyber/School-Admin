import { X, TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import { useFeeContext } from '../context/FeeContext'

export default function FeeMonthlyModal({ onClose }) {
  const { monthlyData, formatAmount, recoveryPercentage, 
          totalReceived, totalExpected } = useFeeContext()

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        
        <div 
          className="p-6 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
        >
          <div>
            <h2 className="text-white text-2xl font-bold">📊 Fee Recovery Report</h2>
            <p className="text-green-100 text-sm mt-1">Monthly breakdown — All 12 months</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-green-100 text-xs">Total Received</p>
              <p className="text-white font-bold text-lg">{formatAmount(totalReceived)}</p>
            </div>
            <div className="text-center">
              <p className="text-green-100 text-xs">Overall Recovery</p>
              <p className="text-white font-bold text-lg">{recoveryPercentage}%</p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 
                         flex items-center justify-center transition-all"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {monthlyData.map((item, index) => (
              <div
                key={item.month}
                className="rounded-2xl p-4 border-2 transition-all hover:shadow-lg hover:scale-105 cursor-default"
                style={{
                  borderColor: item.percentage > 50 ? '#22c55e' : 
                               item.percentage > 0 ? '#f97316' : '#e5e7eb',
                  backgroundColor: item.percentage > 50 ? '#f0fdf4' : 
                                   item.percentage > 0 ? '#fff7ed' : '#f9fafb'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="font-semibold text-gray-700 text-sm">{item.month}</span>
                  </div>
                  {item.percentage > 0 
                    ? <TrendingUp size={16} className="text-green-500" />
                    : <TrendingDown size={16} className="text-gray-300" />
                  }
                </div>

                <p 
                  className="text-3xl font-bold mb-2"
                  style={{ color: item.percentage > 50 ? '#16a34a' : 
                                  item.percentage > 0 ? '#f97316' : '#d1d5db' }}
                >
                  {item.percentage}%
                </p>

                <div className="w-full h-2 bg-gray-200 rounded-full mb-3">
                  <div 
                    className="h-full rounded-full transition-all duration-700"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: item.percentage > 50 ? '#22c55e' : 
                                       item.percentage > 0 ? '#f97316' : '#d1d5db'
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Received</span>
                    <span className="text-xs font-semibold text-green-600">
                      Rs. {formatAmount(item.received)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Pending</span>
                    <span className="text-xs font-semibold text-red-400">
                      Rs. {formatAmount(item.pending)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Records</span>
                    <span className="text-xs font-semibold text-blue-400">
                      {item.recordCount} students
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <p className="text-gray-400 text-sm">
            💡 Data updates live as fee is collected
          </p>
          <button
            onClick={onClose}
            className="bg-green-500 hover:bg-green-600 text-white 
                       px-6 py-2 rounded-xl font-semibold transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  )
}
