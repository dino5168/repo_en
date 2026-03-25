import { useEffect } from 'react'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { useMenuStore } from '@/stores/menu.store'

function App() {
  const initialize = useMenuStore(s => s.initialize)

  useEffect(() => {
    // 無 auth 時以空 roles/permissions 初始化（顯示全部無限制項目）
    initialize([], [])
  }, [initialize])

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
