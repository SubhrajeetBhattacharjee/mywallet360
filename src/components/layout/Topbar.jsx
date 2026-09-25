import { useState, useEffect, useRef } from 'react'
import { Search, Sun, Moon, ChevronDown, User, LogOut, Settings, Bookmark } from 'lucide-react'
import { AnalysisPeriodBar } from '../dashboard/AnalysisPeriodBar'
import { useAuth } from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export function Topbar({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  analysisDays,
  customRange,
  isPeriodLoading,
  onPeriodChange
}) {
  const { user, signOut, setAuthModalOpen } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark'
  })

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev
      if (next) {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }
      return next
    })
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User'

  return (
    <header className="h-[72px] w-full flex items-center justify-between px-8 bg-[var(--surface)] border-b border-[var(--border)]" style={{ fontFamily: "'Inter', 'DM Sans', system-ui, -apple-system, sans-serif", transition: 'background-color 0.4s ease, border-color 0.4s ease' }}>
      
      {/* Search Bar */}
      <div className="flex-1 max-w-[560px]">
        <form
          onSubmit={e => { e.preventDefault(); onSearchSubmit(); }}
          className="flex items-center w-full h-[42px] bg-[var(--bg)] rounded-xl px-4 border border-[var(--border)] focus-within:border-[var(--primary)] focus-within:bg-[var(--surface)] transition-colors"
        >
          <Search size={16} strokeWidth={2} className="text-[var(--muted)] shrink-0" />
          <input
            type="text"
            value={searchValue || ''}
            onChange={e => onSearchChange?.(e.target.value)}
            placeholder="Enter another address or ENS name..."
            className="flex-1 bg-transparent border-none outline-none px-3 text-[13px] font-medium text-[var(--ink)] placeholder-[var(--muted)]"
          />
          <div className="flex items-center justify-center w-5 h-5 rounded bg-[var(--surface)] border border-[var(--border)] text-[11px] font-semibold text-[var(--muted)]">
            /
          </div>
        </form>
      </div>

      <div className="flex items-center gap-3 ml-4">
        <AnalysisPeriodBar 
          periods={[
            { id: '7d', value: '7', label: 'Last 7 Days', shortLabel: '7D' },
            { id: '30d', value: '30', label: 'Last 30 Days', shortLabel: '30D' },
            { id: '90d', value: '90', label: 'Last 90 Days', shortLabel: '90D' },
            { id: 'ytd', value: 'ytd', label: 'Year to Date', shortLabel: 'YTD' },
            { id: 'all', value: 'all', label: 'All Time', shortLabel: 'ALL' },
            { id: 'custom', value: 'custom', label: 'Custom Range', shortLabel: 'Custom' }
          ]}
          selectedDays={analysisDays}
          customRange={customRange}
          isLoading={isPeriodLoading}
          onPeriodChange={onPeriodChange}
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-4 border-l border-[var(--border)] pl-4">
        <button onClick={toggleTheme} className="w-[36px] h-[36px] rounded-xl flex items-center justify-center transition-all border border-transparent bg-transparent hover:border-[var(--border)]" title={isDarkMode ? 'Light mode' : 'Dark mode'}>
          {isDarkMode ? <Moon size={18} strokeWidth={2} className="text-slate-200" /> : <Sun size={18} strokeWidth={2} className="text-amber-500" />}
        </button>
        
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
              style={{ fontFamily: 'inherit' }}
            >
              <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[13px] font-bold text-white" style={{ background: 'linear-gradient(135deg, var(--primary), #0d9488)' }}>
                {displayName[0]?.toUpperCase()}
              </div>
              <ChevronDown size={14} strokeWidth={2.5} className="text-[var(--muted)]" style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div 
                style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  width: 240, borderRadius: 16, overflow: 'hidden',
                  background: 'var(--card)', border: '1px solid var(--border)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)',
                  zIndex: 100, animation: 'dropdownIn 0.15s ease-out'
                }}
              >
                {/* User Info */}
                <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{displayName}</p>
                  <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                </div>

                {/* Menu Items */}
                <div style={{ padding: '6px' }}>
                  <button 
                    onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', background: 'transparent', color: 'var(--ink)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <User size={16} strokeWidth={2} style={{ color: 'var(--muted)' }} /> My Profile
                  </button>
                  <button 
                    onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', background: 'transparent', color: 'var(--ink)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <Bookmark size={16} strokeWidth={2} style={{ color: 'var(--muted)' }} /> Saved Wallets
                  </button>
                  <button 
                    onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', background: 'transparent', color: 'var(--ink)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <Settings size={16} strokeWidth={2} style={{ color: 'var(--muted)' }} /> Account Settings
                  </button>
                </div>

                {/* Sign Out */}
                <div style={{ padding: '6px', borderTop: '1px solid var(--border)' }}>
                  <button 
                    onClick={() => { setDropdownOpen(false); signOut(); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', background: 'transparent', color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={16} strokeWidth={2} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => setAuthModalOpen(true)} className="text-[13px] font-bold text-[var(--muted)] hover:text-[var(--ink)] transition-colors bg-transparent border-none cursor-pointer" style={{ fontFamily: 'inherit' }}>
            Sign In
          </button>
        )}
      </div>

      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </header>
  )
}
