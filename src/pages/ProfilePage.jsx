import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { LogOut, ArrowLeft, Trash2, ExternalLink, Wallet, Shield, User, Camera, Key, AlertTriangle, ChevronRight, Mail, Check, X, Loader2, ChevronDown, Settings, Bookmark } from 'lucide-react'

export function ProfilePage() {
  const { user, signOut, loading } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [trackedWallets, setTrackedWallets] = useState([])
  const [fetching, setFetching] = useState(true)
  const [activeTab, setActiveTab] = useState('portfolios')

  // Settings state
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState(null) // { type: 'success' | 'error', text: '' }

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState(null)

  // Danger zone
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deactivateConfirm, setDeactivateConfirm] = useState(false)

  // Init user data
  useEffect(() => {
    if (!user) return
    setDisplayName(user.user_metadata?.full_name || user.user_metadata?.display_name || user.email?.split('@')[0] || '')
    setAvatarUrl(user.user_metadata?.avatar_url || '')
  }, [user])

  // Fetch bookmarks
  useEffect(() => {
    if (!user) return

    const fetchBookmarks = async () => {
      try {
        const { data } = await supabase
          .from('tracked_wallets')
          .select('*')
          .eq('user_id', user.id)

        const localStr = localStorage.getItem(`mywallet360_bookmarks_${user.id}`)
        const localBookmarks = localStr ? JSON.parse(localStr) : []
        
        let merged = [...(data || [])]
        localBookmarks.forEach(local => {
          if (!merged.some(m => m.address === local.address)) {
            merged.push(local)
          }
        })

        setTrackedWallets(merged)
      } catch (err) {
        console.error(err)
      } finally {
        setFetching(false)
      }
    }

    fetchBookmarks()
  }, [user])

  const removeBookmark = async (id) => {
    await supabase.from('tracked_wallets').delete().eq('id', id)
    setTrackedWallets(prev => {
      const next = prev.filter(w => w.id !== id && w.address !== id)
      localStorage.setItem(`mywallet360_bookmarks_${user?.id}`, JSON.stringify(next))
      return next
    })
  }

  // ─── Save Display Name ───
  const handleSaveProfile = async () => {
    setSaving(true)
    setSaveMsg(null)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: displayName, display_name: displayName }
      })
      if (error) throw error
      setSaveMsg({ type: 'success', text: 'Profile updated successfully!' })
      setTimeout(() => setSaveMsg(null), 3000)
    } catch (err) {
      setSaveMsg({ type: 'error', text: err.message || 'Failed to update profile.' })
    } finally {
      setSaving(false)
    }
  }

  // ─── Upload Avatar ───
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setSaveMsg({ type: 'error', text: 'Image must be under 2MB.' })
      return
    }

    setSaving(true)
    setSaveMsg(null)
    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}/avatar.${fileExt}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        // If bucket doesn't exist, fall back to base64
        const reader = new FileReader()
        reader.onload = async (ev) => {
          const base64 = ev.target.result
          const { error: updateError } = await supabase.auth.updateUser({
            data: { avatar_url: base64 }
          })
          if (updateError) throw updateError
          setAvatarUrl(base64)
          setSaveMsg({ type: 'success', text: 'Avatar updated!' })
          setTimeout(() => setSaveMsg(null), 3000)
          setSaving(false)
        }
        reader.readAsDataURL(file)
        return
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update user metadata
      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      })

      setAvatarUrl(publicUrl)
      setSaveMsg({ type: 'success', text: 'Avatar updated!' })
      setTimeout(() => setSaveMsg(null), 3000)
    } catch (err) {
      setSaveMsg({ type: 'error', text: err.message || 'Failed to upload avatar.' })
    } finally {
      setSaving(false)
    }
  }

  // ─── Change Password ───
  const handleChangePassword = async () => {
    setPasswordMsg(null)

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters.' })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match.' })
      return
    }

    setPasswordSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' })
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        setShowPasswordForm(false)
        setPasswordMsg(null)
      }, 2000)
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message || 'Failed to change password.' })
    } finally {
      setPasswordSaving(false)
    }
  }

  // ─── Delete Account ───
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return
    try {
      // Sign out and clear local data
      localStorage.removeItem(`mywallet360_bookmarks_${user?.id}`)
      await signOut()
      navigate('/')
    } catch (err) {
      setSaveMsg({ type: 'error', text: 'Failed to process request.' })
    }
  }

  // ─── Deactivate Account ───
  const handleDeactivate = async () => {
    if (!deactivateConfirm) return
    try {
      localStorage.removeItem(`mywallet360_bookmarks_${user?.id}`)
      await signOut()
      navigate('/')
    } catch (err) {
      setSaveMsg({ type: 'error', text: 'Failed to deactivate.' })
    }
  }

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div style={{ width: 32, height: 32, border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )
  if (!user) return <Navigate to="/" replace />

  const currentDisplayName = displayName || user?.email?.split('@')[0] || 'User'
  const provider = user?.app_metadata?.provider || 'email'
  const joinDate = user ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>
      
      {/* Ambient Glows */}
      <div style={{ position: 'fixed', top: '-15%', right: '-8%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(24,197,192,0.12) 0%, transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-15%', left: '-8%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(44,122,123,0.08) 0%, transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Hidden file input for avatar */}
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleAvatarUpload} />

      {/* ─── Top Nav ─── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'color-mix(in srgb, var(--bg) 80%, transparent)', backdropFilter: 'blur(20px) saturate(180%)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'var(--muted)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', padding: '8px 0', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
            <ArrowLeft size={18} strokeWidth={2.5} /> Back
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
              style={{ fontFamily: 'inherit' }}
            >
              <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[13px] font-bold text-white" style={{ background: 'linear-gradient(135deg, var(--primary), #0d9488)', overflow: 'hidden' }}>
                {avatarUrl ? <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : currentDisplayName[0]?.toUpperCase()}
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
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{currentDisplayName}</p>
                  <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                </div>

                {/* Menu Items */}
                <div style={{ padding: '6px' }}>
                  <button 
                    onClick={() => { setDropdownOpen(false); setActiveTab('portfolios'); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', background: 'transparent', color: 'var(--ink)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <Bookmark size={16} strokeWidth={2} style={{ color: 'var(--muted)' }} /> Saved Wallets
                  </button>
                  <button 
                    onClick={() => { setDropdownOpen(false); setActiveTab('settings'); }}
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
        </div>
      </nav>

      {/* ─── Profile Hero Banner ─── */}
      <div style={{ position: 'relative' }}>
        {/* Gradient Banner */}
        <div style={{ height: 160, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0d9488 100%)' }}>
          <div style={{ position: 'absolute', inset: 0, height: 160, background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        </div>

        {/* Centered Avatar + Info */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -56, position: 'relative', zIndex: 5 }}>
          {/* Avatar */}
          <div 
            style={{ cursor: 'pointer', position: 'relative' }}
            onClick={() => fileInputRef.current?.click()}
          >
            <div style={{ width: 112, height: 112, borderRadius: '50%', background: avatarUrl ? 'none' : 'linear-gradient(145deg, var(--primary), #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42, fontWeight: 900, color: '#fff', border: '5px solid var(--bg)', boxShadow: '0 6px 24px rgba(0,0,0,0.12)', position: 'relative', overflow: 'hidden' }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                currentDisplayName[0].toUpperCase()
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                <Camera size={22} color="#fff" strokeWidth={2} />
              </div>
            </div>
            {saving && (
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '5px solid var(--bg)' }}>
                <div style={{ width: 22, height: 22, border: '3px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            )}
          </div>

          {/* Name */}
          <h1 style={{ margin: '16px 0 0', fontSize: 26, fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--ink)', textAlign: 'center' }}>{currentDisplayName}</h1>

          {/* Email + Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Mail size={13} strokeWidth={2} /> {user.email}
            </span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border)' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', background: 'color-mix(in srgb, var(--primary) 10%, transparent)', padding: '4px 12px', borderRadius: 999 }}>
              Joined {joinDate}
            </span>
          </div>
        </div>
      </div>

      {/* Global save message toast */}
      {saveMsg && (
        <div style={{ maxWidth: 1200, margin: '16px auto 0', padding: '0 32px', position: 'relative', zIndex: 10 }}>
          <div style={{ padding: '12px 18px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600, background: saveMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: saveMsg.type === 'success' ? '#10b981' : '#ef4444', border: `1px solid ${saveMsg.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
            {saveMsg.type === 'success' ? <Check size={16} strokeWidth={2.5} /> : <X size={16} strokeWidth={2.5} />}
            {saveMsg.text}
          </div>
        </div>
      )}

      {/* ─── Tab Navigation ─── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid var(--border)', marginTop: 32 }}>
          {[
            { key: 'portfolios', label: 'Tracked Portfolios', icon: <Wallet size={16} strokeWidth={2.5} /> },
            { key: 'settings', label: 'Account Settings', icon: <User size={16} strokeWidth={2.5} /> },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '14px 24px',
                fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
                background: 'none', border: 'none', cursor: 'pointer',
                color: activeTab === tab.key ? 'var(--primary)' : 'var(--muted)',
                borderBottom: activeTab === tab.key ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                marginBottom: -2,
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => { if (activeTab !== tab.key) e.currentTarget.style.color = 'var(--ink)' }}
              onMouseLeave={e => { if (activeTab !== tab.key) e.currentTarget.style.color = 'var(--muted)' }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Tab Content ─── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 32px 80px', position: 'relative', zIndex: 1 }}>

        {/* ═══ PORTFOLIOS TAB ═══ */}
        {activeTab === 'portfolios' && (
          <div>
            {fetching ? (
              <div style={{ display: 'grid', gap: 16 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ height: 88, borderRadius: 20, background: 'var(--card)', border: '1px solid var(--border)', animation: 'pulse 1.5s infinite' }} />
                ))}
              </div>
            ) : trackedWallets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 24px 80px' }}>
                {/* Inline ghost SVG — no white-box issues */}
                <div style={{ width: 80, height: 80, margin: '0 auto 32px', borderRadius: 24, background: 'color-mix(in srgb, var(--primary) 8%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wallet size={36} strokeWidth={1.5} style={{ color: 'var(--primary)', opacity: 0.6 }} />
                </div>
                <h3 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--ink)', margin: '0 0 14px' }}>No tracked wallets yet</h3>
                <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--muted)', maxWidth: 420, margin: '0 auto 40px', lineHeight: 1.7 }}>
                  Search for any Ethereum wallet on the dashboard and click the bookmark icon to start tracking it here.
                </p>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', borderRadius: 999, background: 'linear-gradient(145deg, var(--primary), #0d9488)', color: '#fff', fontWeight: 800, fontSize: 15, textDecoration: 'none', boxShadow: '0 8px 24px rgba(24,197,192,0.3)', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(24,197,192,0.4)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(24,197,192,0.3)'; }}>
                  Explore Wallets
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {trackedWallets.map(wallet => (
                  <div key={wallet.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', borderRadius: 20, background: 'var(--card)', border: '1px solid var(--border)', transition: 'all 0.25s ease' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <div style={{ width: 48, height: 48, borderRadius: 16, background: 'color-mix(in srgb, var(--primary) 10%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Wallet size={20} strokeWidth={2.5} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{wallet.wallet_name || 'Unnamed Wallet'}</h4>
                      <p style={{ margin: '4px 0 0', fontSize: 12, fontWeight: 600, color: 'var(--muted)', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{wallet.address}</p>
                    </div>
                    <Link to={`/wallet/${wallet.address}`} onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 12, background: 'color-mix(in srgb, var(--primary) 10%, transparent)', color: 'var(--primary)', fontWeight: 700, fontSize: 13, textDecoration: 'none', flexShrink: 0, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--primary) 18%, transparent)'} onMouseLeave={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--primary) 10%, transparent)'}>
                      View <ExternalLink size={13} strokeWidth={2.5} />
                    </Link>
                    <button onClick={() => removeBookmark(wallet.id)} style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)'; }} title="Remove">
                      <Trash2 size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ SETTINGS TAB ═══ */}
        {activeTab === 'settings' && (
          <div style={{ display: 'grid', gap: 24, maxWidth: 720 }}>
            
            {/* Profile Info Card */}
            <div style={{ padding: 28, borderRadius: 24, background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'color-mix(in srgb, var(--primary) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} strokeWidth={2.5} style={{ color: 'var(--primary)' }} />
                </div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--ink)' }}>Profile Information</h2>
              </div>

              <div style={{ display: 'grid', gap: 20 }}>
                {/* Display Name */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--muted)', marginBottom: 8 }}>Display Name</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input 
                      type="text" 
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      style={{ flex: 1, padding: '12px 16px', borderRadius: 14, border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 15, fontWeight: 600, fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} 
                      onFocus={e => e.target.style.borderColor = 'var(--primary)'} 
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                    <button 
                      onClick={handleSaveProfile}
                      disabled={saving}
                      style={{ padding: '12px 24px', borderRadius: 14, border: 'none', background: 'var(--primary)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'opacity 0.2s', opacity: saving ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
                    >
                      {saving ? <><div style={{ width: 14, height: 14, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Saving...</> : 'Save'}
                    </button>
                  </div>
                </div>
                
                {/* Email (read-only) */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--muted)', marginBottom: 8 }}>Email Address</label>
                  <div style={{ padding: '12px 16px', borderRadius: 14, border: '1.5px solid var(--border)', background: 'color-mix(in srgb, var(--bg) 60%, var(--card))', color: 'var(--muted)', fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{user.email}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', background: 'color-mix(in srgb, var(--primary) 12%, transparent)', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified</span>
                  </div>
                </div>

                {/* Provider */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--muted)', marginBottom: 8 }}>Sign-in Method</label>
                  <div style={{ padding: '12px 16px', borderRadius: 14, border: '1.5px solid var(--border)', background: 'color-mix(in srgb, var(--bg) 60%, var(--card))', color: 'var(--ink)', fontSize: 15, fontWeight: 600, textTransform: 'capitalize' }}>
                    {provider}
                  </div>
                </div>
              </div>
            </div>

            {/* Security Card */}
            <div style={{ padding: 28, borderRadius: 24, background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'color-mix(in srgb, var(--primary) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={16} strokeWidth={2.5} style={{ color: 'var(--primary)' }} />
                </div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--ink)' }}>Security</h2>
              </div>

              {!showPasswordForm ? (
                <button 
                  onClick={() => setShowPasswordForm(true)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '14px 18px', borderRadius: 14, border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', boxSizing: 'border-box' }} 
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'color-mix(in srgb, var(--primary) 4%, var(--bg))'; }} 
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg)'; }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Key size={16} strokeWidth={2.5} style={{ color: 'var(--muted)' }} /> Change Password
                  </span>
                  <ChevronRight size={16} strokeWidth={2.5} style={{ color: 'var(--muted)' }} />
                </button>
              ) : (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--muted)', marginBottom: 8 }}>New Password</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      style={{ width: '100%', padding: '12px 16px', borderRadius: 14, border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 15, fontWeight: 600, fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} 
                      onFocus={e => e.target.style.borderColor = 'var(--primary)'} 
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--muted)', marginBottom: 8 }}>Confirm Password</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      style={{ width: '100%', padding: '12px 16px', borderRadius: 14, border: `1.5px solid ${confirmPassword && confirmPassword !== newPassword ? 'rgba(239,68,68,0.5)' : 'var(--border)'}`, background: 'var(--bg)', color: 'var(--ink)', fontSize: 15, fontWeight: 600, fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} 
                      onFocus={e => e.target.style.borderColor = confirmPassword && confirmPassword !== newPassword ? 'rgba(239,68,68,0.5)' : 'var(--primary)'} 
                      onBlur={e => e.target.style.borderColor = confirmPassword && confirmPassword !== newPassword ? 'rgba(239,68,68,0.5)' : 'var(--border)'}
                    />
                    {confirmPassword && confirmPassword !== newPassword && (
                      <p style={{ fontSize: 12, color: '#ef4444', fontWeight: 600, marginTop: 6 }}>Passwords don't match</p>
                    )}
                  </div>

                  {/* Password strength indicator */}
                  {newPassword && (
                    <div>
                      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: newPassword.length >= i * 3 ? (newPassword.length >= 12 ? '#10b981' : newPassword.length >= 8 ? '#f59e0b' : '#ef4444') : 'var(--border)', transition: 'background 0.3s' }} />
                        ))}
                      </div>
                      <p style={{ fontSize: 11, fontWeight: 600, color: newPassword.length >= 12 ? '#10b981' : newPassword.length >= 8 ? '#f59e0b' : '#ef4444' }}>
                        {newPassword.length >= 12 ? 'Strong password' : newPassword.length >= 8 ? 'Good password' : newPassword.length >= 6 ? 'Weak password' : 'Too short'}
                      </p>
                    </div>
                  )}

                  {passwordMsg && (
                    <div style={{ padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: passwordMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: passwordMsg.type === 'success' ? '#10b981' : '#ef4444' }}>
                      {passwordMsg.text}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button 
                      onClick={() => { setShowPasswordForm(false); setNewPassword(''); setConfirmPassword(''); setPasswordMsg(null); }}
                      style={{ flex: 1, padding: '12px 16px', borderRadius: 14, border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleChangePassword}
                      disabled={passwordSaving || newPassword.length < 6 || newPassword !== confirmPassword}
                      style={{ flex: 1, padding: '12px 16px', borderRadius: 14, border: 'none', background: 'var(--primary)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: passwordSaving || newPassword.length < 6 || newPassword !== confirmPassword ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: passwordSaving || newPassword.length < 6 || newPassword !== confirmPassword ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    >
                      {passwordSaving ? <><div style={{ width: 14, height: 14, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Updating...</> : 'Update Password'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Danger Zone */}
            <div style={{ padding: 28, borderRadius: 24, background: 'var(--card)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={16} strokeWidth={2.5} style={{ color: '#ef4444' }} />
                </div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#ef4444' }}>Danger Zone</h2>
              </div>

              <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)', marginBottom: 20, lineHeight: 1.6 }}>
                These actions are permanent and cannot be undone. Please proceed with caution.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Deactivate */}
                <div style={{ padding: 18, borderRadius: 16, border: '1px solid rgba(249,115,22,0.2)', background: 'rgba(249,115,22,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: deactivateConfirm ? 14 : 0, flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#f97316' }}>Deactivate Account</h4>
                      <p style={{ margin: '4px 0 0', fontSize: 12, fontWeight: 500, color: 'var(--muted)' }}>Temporarily disable your account</p>
                    </div>
                    {!deactivateConfirm ? (
                      <button onClick={() => setDeactivateConfirm(true)} style={{ padding: '8px 18px', borderRadius: 10, border: '1.5px solid rgba(249,115,22,0.3)', background: 'transparent', color: '#f97316', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        Deactivate
                      </button>
                    ) : null}
                  </div>
                  {deactivateConfirm && (
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={() => setDeactivateConfirm(false)} style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Cancel
                      </button>
                      <button onClick={handleDeactivate} style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: '#f97316', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Yes, Deactivate
                      </button>
                    </div>
                  )}
                </div>

                {/* Delete */}
                <div style={{ padding: 18, borderRadius: 16, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.03)' }}>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#ef4444', marginBottom: 4 }}>Delete Account</h4>
                  <p style={{ margin: '0 0 14px', fontSize: 12, fontWeight: 500, color: 'var(--muted)' }}>Permanently delete your account and all data. Type <strong style={{ color: '#ef4444' }}>DELETE</strong> to confirm.</p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input 
                      type="text"
                      value={deleteConfirm}
                      onChange={e => setDeleteConfirm(e.target.value)}
                      placeholder='Type "DELETE"'
                      style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1.5px solid rgba(239,68,68,0.2)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = '#ef4444'}
                      onBlur={e => e.target.style.borderColor = 'rgba(239,68,68,0.2)'}
                    />
                    <button 
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirm !== 'DELETE'}
                      style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: deleteConfirm === 'DELETE' ? '#ef4444' : 'rgba(239,68,68,0.2)', color: deleteConfirm === 'DELETE' ? '#fff' : 'rgba(239,68,68,0.5)', fontSize: 13, fontWeight: 700, cursor: deleteConfirm === 'DELETE' ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all 0.2s' }}
                    >
                      Delete Forever
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  )
}
