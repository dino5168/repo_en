import { Sidebar } from '@/components/Sidebar'

function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 pt-16 lg:pt-8">
        <p className="text-gray-400 text-sm">主內容區域</p>
      </main>
    </div>
  )
}

export default App
