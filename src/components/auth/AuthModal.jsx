import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { X, Mail, Lock, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export function AuthModal() {
  const { authModalOpen, setAuthModalOpen, signIn, signUp } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState(null)

  // Password strength
  const [strength, setStrength] = useState(0)
  
  useEffect(() => {
    let score = 0
    if (password.length > 5) score += 1
    if (password.length > 8) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    setStrength(score)
  }, [password])

  if (!authModalOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      if (isLogin) {
        await signIn(email, password)
        setAuthModalOpen(false)
      } else {
        await signUp(email, password)
        setSuccessMsg("Check your email for the confirmation link!")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
    if (error) setError(error.message)
  }

  const handleMetamaskLogin = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError("MetaMask is not installed. Please install it to continue.")
      return
    }
    try {
      setLoading(true)
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const address = accounts[0]
      // Note: Full SIWE (Sign In With Ethereum) requires backend verification to issue a JWT.
      // This initiates the connection on the frontend.
      setError("MetaMask connected! Full SIWE (Sign In With Ethereum) requires backend JWT verification setup in Supabase.")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[420px] overflow-hidden relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button 
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors z-10 bg-white/80 rounded-full p-1"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Header */}
        <div className="pt-10 px-8 pb-6 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200 shadow-sm">
            <ShieldCheck className="text-slate-700" size={26} strokeWidth={2} />
          </div>
          <h2 className="text-[24px] font-black text-slate-800 tracking-tight mb-1.5">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-[14px] text-slate-500 font-medium">
            {isLogin 
              ? 'Sign in to access your saved wallets & insights.' 
              : 'Join to track portfolios and bookmark addresses.'}
          </p>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium text-center">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-5 p-3 rounded-xl bg-[#f0fdfa] border border-[#ccfbf1] text-[#0f766e] text-[13px] font-bold text-center flex items-center justify-center gap-2">
              <CheckCircle2 size={16} /> {successMsg}
            </div>
          )}

          <div className="flex gap-3 mb-6">
            <button onClick={handleGoogleLogin} className="flex-1 h-11 flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-slate-700 text-[14px] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button onClick={handleMetamaskLogin} className="flex-1 h-11 flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-slate-700 text-[14px] transition-colors">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" width="18" height="18" />
              MetaMask
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-[1px] bg-slate-100"></div>
            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Or continue with email</span>
            <div className="flex-1 h-[1px] bg-slate-100"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={18} strokeWidth={2} />
                </span>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-[15px] font-medium text-slate-800 outline-none focus:border-[#18c5c0] focus:ring-4 focus:ring-[#18c5c0]/10 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-1.5 ml-1">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} strokeWidth={2} />
                </span>
                <input 
                  type="password"
                  required 
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-[15px] font-medium text-slate-800 outline-none focus:border-[#18c5c0] focus:ring-4 focus:ring-[#18c5c0]/10 transition-all"
                  placeholder="••••••••"
                />
              </div>
              
              {/* Password Strength Indicator */}
              {!isLogin && password.length > 0 && (
                <div className="mt-2.5 flex items-center gap-1.5 px-1">
                  {[1, 2, 3, 4].map(level => (
                    <div 
                      key={level} 
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        strength >= level 
                          ? strength < 2 ? 'bg-amber-400' : strength < 4 ? 'bg-blue-400' : 'bg-emerald-500'
                          : 'bg-slate-100'
                      }`}
                    />
                  ))}
                  <span className={`text-[10px] font-bold ml-1 uppercase tracking-wider ${
                    strength < 2 ? 'text-amber-500' : strength < 4 ? 'text-blue-500' : 'text-emerald-500'
                  }`}>
                    {strength < 2 ? 'Weak' : strength < 4 ? 'Good' : 'Strong'}
                  </span>
                </div>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5 ml-1">Confirm Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={18} strokeWidth={2} />
                  </span>
                  <input 
                    type="password"
                    required 
                    minLength={6}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-[15px] font-medium text-slate-800 outline-none focus:border-[#18c5c0] focus:ring-4 focus:ring-[#18c5c0]/10 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || (!isLogin && password !== confirmPassword && confirmPassword.length > 0)}
              className="w-full h-12 mt-6 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-xl font-bold text-[15px] flex items-center justify-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>
        </div>

        {/* Footer Toggle */}
        <div className="bg-slate-50 border-t border-slate-100 p-5 text-center">
          <p className="text-[13px] font-medium text-slate-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin)
                setError(null)
                setSuccessMsg(null)
                setPassword('')
                setConfirmPassword('')
              }} 
              className="text-[#18c5c0] font-bold hover:underline"
            >
              {isLogin ? 'Sign up for free' : 'Sign in instead'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
