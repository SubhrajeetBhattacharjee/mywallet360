import { Home, FileText, PieChart, BarChart2, Activity, MessageSquare, Settings, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const navItems = [
  { label: 'Overview', icon: <Home size={18} strokeWidth={2} /> },
  { label: 'Transactions', icon: <FileText size={18} strokeWidth={2} /> },
  { label: 'Portfolio', icon: <PieChart size={18} strokeWidth={2} /> },
  { label: 'Analytics', icon: <BarChart2 size={18} strokeWidth={2} /> },
  { label: 'Insights', icon: <Activity size={18} strokeWidth={2} /> },
]

export function Sidebar({ activeTab, onTabChange, isCollapsed, onToggleCollapse }) {

  return (
    <aside 
      className={`fixed top-0 left-0 h-screen border-r border-[var(--border)] bg-[var(--surface)] flex-col justify-between hidden md:flex transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[80px]' : 'w-[260px]'}`} 
      style={{ fontFamily: "'Inter', 'DM Sans', system-ui, -apple-system, sans-serif" }}
    >
      
      {/* Top Section */}
      <div className="px-6 py-6 border-b border-[var(--border)] shrink-0 relative flex items-center h-[96px]">
        <Link to="/" className={`flex items-center gap-0 no-underline text-inherit cursor-pointer hover:opacity-80 transition-opacity -ml-1 ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <img src="/images/darklogo.svg" alt="" className="w-[56px] h-[56px] shrink-0" />
          {!isCollapsed && (
            <span className="font-bold text-[22px] tracking-tight text-[var(--ink)] -ml-1.5">
              MyWallet<span className="text-[var(--primary)]">360</span>
            </span>
          )}
        </Link>
        <button 
          onClick={onToggleCollapse}
          className={`absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[var(--surface)] border border-[var(--border)] rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--bg)] cursor-pointer shadow-sm z-50 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>
      </div>

      <div className={`pt-6 ${isCollapsed ? 'px-3' : 'px-6'}`}>
        {/* Main Nav */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onTabChange && onTabChange(item.label)}
              className={`flex items-center px-4 py-2.5 rounded-xl font-semibold text-[14px] transition-colors border-none cursor-pointer w-full text-left group ${
                isCollapsed ? 'justify-center' : 'gap-3.5'
              } ${
                item.label === activeTab
                  ? 'bg-[#18c5c0]/10 text-[var(--primary)]' 
                  : 'bg-transparent text-[var(--muted)] hover:bg-[var(--bg)] hover:text-[var(--ink)]'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className="shrink-0">{item.icon}</div>
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className={`pb-8 ${isCollapsed ? 'px-3' : 'px-6'} flex flex-col gap-1.5`}>
        <Link to="/settings" className={`flex items-center px-4 py-2.5 rounded-xl font-semibold text-[14px] text-[var(--muted)] bg-transparent border-none cursor-pointer w-full text-left hover:bg-[var(--bg)] hover:text-[var(--ink)] transition-colors ${isCollapsed ? 'justify-center' : 'gap-3.5'}`} title={isCollapsed ? 'Settings' : undefined}>
          <Settings size={18} strokeWidth={2} className="shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  )
}
