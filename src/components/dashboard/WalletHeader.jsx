import { useState, useEffect } from 'react'
import { Copy, ExternalLink, RefreshCw, Bookmark } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import makeBlockie from 'ethereum-blockies-base64'

export function WalletHeader({ wallet, resolvedIdentifier, isLoading, onRefresh }) {
  const { user, setAuthModalOpen } = useAuth()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarking, setBookmarking] = useState(false)

  const isDomain = resolvedIdentifier?.type === 'ens' || resolvedIdentifier?.type === 'unstoppable'
  const primaryName = isDomain ? resolvedIdentifier.originalInput : (wallet?.profile?.wallet || wallet?.id)
  const secondaryName = isDomain || wallet?.profile?.wallet ? wallet?.id : null
  const etherscanLink = `https://etherscan.io/address/${wallet?.id}`
  const lastUpdated = wallet?.generatedAt ? new Date(wallet.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''

  useEffect(() => {
    if (!user || !wallet) return
    const checkBookmark = async () => {
      let isBookmarkedDb = false
      try {
        const { data } = await supabase
          .from('tracked_wallets')
          .select('id')
          .eq('user_id', user.id)
          .eq('address', wallet.id)
          .single()
        isBookmarkedDb = !!data
      } catch (err) {
        console.error("Supabase error checking bookmark:", err)
      }
      
      const localStr = localStorage.getItem(`mywallet360_bookmarks_${user.id}`)
      const localBookmarks = localStr ? JSON.parse(localStr) : []
      const isBookmarkedLocal = localBookmarks.some(w => w.address === wallet.id)

      setIsBookmarked(isBookmarkedDb || isBookmarkedLocal)
    }
    checkBookmark()
  }, [user, wallet])

  const toggleBookmark = async () => {
    if (!user) {
      setAuthModalOpen(true)
      return
    }
    setBookmarking(true)
    try {
      const localStr = localStorage.getItem(`mywallet360_bookmarks_${user.id}`)
      let localBookmarks = localStr ? JSON.parse(localStr) : []

      if (isBookmarked) {
        const { error } = await supabase
          .from('tracked_wallets')
          .delete()
          .eq('user_id', user.id)
          .eq('address', wallet.id)
        if (error) console.error("Supabase delete error:", error)
        
        localBookmarks = localBookmarks.filter(w => w.address !== wallet.id)
        setIsBookmarked(false)
      } else {
        const { error } = await supabase
          .from('tracked_wallets')
          .insert({
            user_id: user.id,
            address: wallet.id,
            wallet_name: primaryName || 'Unknown Wallet'
          })
        if (error) console.error("Supabase insert error:", error)
        
        localBookmarks.push({
          id: wallet.id,
          user_id: user.id,
          address: wallet.id,
          wallet_name: primaryName || 'Unknown Wallet',
          created_at: new Date().toISOString()
        })
        setIsBookmarked(true)
      }
      
      localStorage.setItem(`mywallet360_bookmarks_${user.id}`, JSON.stringify(localBookmarks))
    } catch (err) {
      console.error(err)
    } finally {
      setBookmarking(false)
    }
  }

  if (!wallet) return null

  return (
    <div className="flex flex-col sm:flex-row items-start justify-between w-full mb-10 gap-6 sm:gap-0" style={{ fontFamily: "'Inter', 'DM Sans', system-ui, -apple-system, sans-serif" }}>
      
      {/* Left side identity */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full">
        
        {/* Eth Avatar */}
        <div 
          className="w-[100px] h-[100px] sm:w-[160px] sm:h-[160px] rounded-[32px] sm:rounded-[44px] flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 duration-300 shadow-2xl overflow-hidden bg-[var(--surface)]"
          style={{ border: '4px solid var(--surface)', boxShadow: '0 24px 48px rgba(0,0,0,0.1)' }}
        >
          <img 
            src={makeBlockie(wallet?.id || 'default')} 
            alt="Wallet Avatar" 
            className="w-full h-full object-cover" 
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Identity Details */}
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] sm:text-[32px] font-bold tracking-tight m-0 leading-none text-[var(--ink)] drop-shadow-sm break-all">{primaryName}</h1>
            <button 
              className="text-[var(--muted)] hover:text-[var(--primary)] transition-all bg-[var(--surface)] hover:bg-transparent border border-transparent hover:border-[var(--primary)] w-8 h-8 rounded-lg flex items-center justify-center"
              title="Copy Address"
              onClick={() => navigator.clipboard.writeText(isDomain ? primaryName : wallet.id)}
            >
              <Copy size={16} strokeWidth={2} />
            </button>
          </div>
          
          {secondaryName && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[14px] font-semibold text-[var(--muted)] px-3 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)]">{secondaryName}</span>
              <button 
                className="text-[var(--muted)] hover:text-[var(--primary)] transition-all bg-[var(--surface)] hover:bg-transparent border border-transparent hover:border-[var(--primary)] w-7 h-7 rounded-lg flex items-center justify-center"
                title="Copy Hex Address"
                onClick={() => navigator.clipboard.writeText(wallet.id)}
              >
                <Copy size={14} strokeWidth={2} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 mt-2">
            {resolvedIdentifier?.type === 'ens' && (
              <span className="px-3 py-1 rounded-full bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] text-[var(--primary)] text-[12px] font-bold uppercase tracking-wider border border-[color-mix(in_srgb,var(--primary)_30%,transparent)]">ENS Name</span>
            )}
            {resolvedIdentifier?.type === 'unstoppable' && (
              <span className="px-3 py-1 rounded-full bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] text-[var(--primary)] text-[12px] font-bold uppercase tracking-wider border border-[color-mix(in_srgb,var(--primary)_30%,transparent)]">Unstoppable</span>
            )}
            <span className="px-3 py-1 rounded-full bg-[var(--surface)] text-[var(--muted)] text-[12px] font-bold uppercase tracking-wider border border-[var(--border)]">Ethereum</span>
          </div>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex flex-col items-end gap-3 mt-2">
        <div className="flex gap-2">
          <button 
            onClick={toggleBookmark}
            disabled={bookmarking}
            className={`px-4 py-2.5 text-[13px] font-bold rounded-xl flex items-center gap-2 transition-all border shadow-sm ${
              isBookmarked 
                ? 'bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] text-[var(--primary)] border-[color-mix(in_srgb,var(--primary)_30%,transparent)] hover:bg-[color-mix(in_srgb,var(--primary)_25%,transparent)]' 
                : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--bg)]'
            }`}
          >
            <Bookmark size={16} strokeWidth={2.5} fill={isBookmarked ? 'currentColor' : 'none'} />
            {isBookmarked ? 'Saved' : 'Save'}
          </button>
          <a 
            href={etherscanLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[var(--ink)] hover:opacity-90 text-[var(--bg)] text-[13px] font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-opacity no-underline shadow-sm"
          >
            View on Etherscan <ExternalLink size={16} strokeWidth={2.5} />
          </a>
        </div>
        <div className="flex items-center gap-2 text-[var(--muted)] text-[12px] font-medium mr-1">
          Last updated: {lastUpdated}
          <button 
            className={`text-[var(--muted)] hover:text-[var(--primary)] bg-transparent border-none p-0 flex transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh data"
          >
            <RefreshCw size={14} strokeWidth={2.5} className={isLoading ? 'animate-spin text-[var(--primary)]' : ''} />
          </button>
        </div>
      </div>
      
    </div>
  )
}
