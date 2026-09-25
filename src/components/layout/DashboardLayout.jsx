import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useState } from 'react'

export function DashboardLayout({
  children,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  activeTab,
  onTabChange,
  analysisDays,
  customRange,
  isPeriodLoading,
  onPeriodChange
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-[var(--bg)] transition-colors duration-300">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className={`flex-1 min-w-0 flex flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'md:ml-[80px]' : 'md:ml-[260px]'}`}>
        <Topbar
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          onSearchSubmit={onSearchSubmit}
          analysisDays={analysisDays}
          customRange={customRange}
          isPeriodLoading={isPeriodLoading}
          onPeriodChange={onPeriodChange}
        />
        <main className="flex-1 min-w-0 w-full px-10 py-8 max-w-[1400px] overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
