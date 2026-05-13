import { ArrowLeft } from 'lucide-react'

function Complaints({ onBack }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, #d4f5a0 0%, #fef9c3 50%, #fce4ec 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(to right, #f97316, #991b1b)' }} className="rounded-b-3xl px-8 py-5 relative flex items-center">
        <button onClick={onBack} className="text-white mr-4 hover:scale-110 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white flex items-center justify-center rounded-xl">
            <span className="text-xl">⚠️</span>
          </div>
          <span className="text-white text-xl font-bold ml-3">Complaints</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-md p-6">
          <h2 className="text-gray-700 font-bold text-lg mb-4">Manage Complaints</h2>
          <p className="text-gray-600">Complaints system coming soon...</p>
        </div>
      </div>
    </div>
  )
}

export default Complaints
