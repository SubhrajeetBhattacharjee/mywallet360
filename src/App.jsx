import { useEffect } from 'react'
import { Routes, Route, useParams, useNavigate, Navigate, useLocation } from 'react-router-dom'
import { DashboardLoader } from './components/dashboard/DashboardLoader'
import { Insights } from './components/dashboard/Insights'
import { PortfolioHoldings } from './components/dashboard/PortfolioHoldings'
import { TransactionsExplorer } from './components/dashboard/TransactionsExplorer'
import { TransactionAnalytics } from './components/dashboard/TransactionAnalytics'
import { HeroSection } from './components/landing/HeroSection'
import { FeaturesSection } from './components/landing/FeaturesSection'
import { HowItWorksSection } from './components/landing/HowItWorksSection'
import { FAQSection } from './components/landing/FAQSection'
import { CTASection } from './components/landing/CTASection'
import { AbstractBackground } from './components/landing/AbstractBackground'
import { Footer } from './components/landing/Footer'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { OverviewTab } from './components/dashboard/OverviewTab'
import { useTheme } from './hooks/useTheme'
import { useWalletDashboard } from './hooks/useWalletDashboard'
import { walletService } from './services/walletService'

const exampleWallets = walletService.listExampleWallets()

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function DashboardRoute({ dashboard }) {
  const { address, tab } = useParams()
  const navigate = useNavigate()
  const { wallet, isLoading, isResolving, analyzeWallet, error } = dashboard
  
  // Keep URL in sync with wallet data
  useEffect(() => {
    if (address && wallet?.id?.toLowerCase() !== address.toLowerCase() && !isLoading && !isResolving) {
      analyzeWallet(address, undefined, { skipNavigate: true })
    }
  }, [address, wallet?.id, isLoading, isResolving, analyzeWallet])

  // Map URL param to tab name
  const activeTab = tab ? tab.charAt(0).toUpperCase() + tab.slice(1).toLowerCase() : 'Overview'

  if (error && !wallet) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg border border-[#f1f5f9] text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Wallet Not Found</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => analyzeWallet(address, dashboard.analysisDays, { skipNavigate: true })}
              className="w-full bg-[#18c5c0] text-white font-bold py-3 rounded-xl hover:bg-[#14a39f] transition-colors cursor-pointer"
            >
              Retry
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-[#f1f5f9] text-[#64748b] font-bold py-3 rounded-xl hover:bg-[#e2e8f0] transition-colors cursor-pointer"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!wallet) {
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm"><DashboardLoader /></div>
  }

  return (
    <DashboardLayout
      searchValue={dashboard.searchValue}
      onSearchChange={dashboard.setSearchValue}
      onSearchSubmit={dashboard.searchWallet}
      activeTab={activeTab}
      onTabChange={(newTab) => {
        navigate(`/wallet/${address}/${newTab === 'Overview' ? '' : newTab.toLowerCase()}`)
      }}
      resolvedIdentifier={dashboard.resolvedIdentifier}
      analysisDays={dashboard.analysisDays}
      customRange={dashboard.customRange}
      isPeriodLoading={dashboard.isPeriodLoading}
      onPeriodChange={(days, range) => dashboard.analyzeWallet(wallet.id, days, { periodChange: true, customRange: range, skipNavigate: true })}
    >
      {activeTab === 'Overview' && <OverviewTab wallet={wallet} resolvedIdentifier={dashboard.resolvedIdentifier} isLoading={isLoading} onRefresh={() => dashboard.analyzeWallet(wallet.id, dashboard.analysisDays, { skipNavigate: true })} />}
      {activeTab === 'Transactions' && <TransactionsExplorer wallet={wallet} analysisDays={dashboard.analysisDays} customRange={dashboard.customRange} />}
      {activeTab === 'Portfolio' && <PortfolioHoldings wallet={wallet} />}
      {activeTab === 'Analytics' && <TransactionAnalytics wallet={wallet} analysisDays={dashboard.analysisDays} customRange={dashboard.customRange} />}
      {activeTab === 'Insights' && <Insights wallet={wallet} />}
    </DashboardLayout>
  )
}

function HomeRoute({ dashboard, theme, toggleTheme }) {
  return (
    <>
      {(dashboard.isLoading || dashboard.isResolving) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <DashboardLoader />
        </div>
      )}
      <HeroSection
        searchValue={dashboard.searchValue}
        onSearchChange={dashboard.setSearchValue}
        onSearchSubmit={dashboard.searchWallet}
        searchError={dashboard.error}
        exampleWallets={exampleWallets}
        onSelectExample={dashboard.selectExampleWallet}
        isLoading={dashboard.isLoading || dashboard.isResolving}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <AbstractBackground>
        <FeaturesSection />
        <HowItWorksSection />
        <FAQSection />
        <CTASection
          searchValue={dashboard.searchValue}
          onSearchChange={dashboard.setSearchValue}
          onSearchSubmit={dashboard.searchWallet}
          isLoading={dashboard.isLoading || dashboard.isResolving}
        />
        <Footer />
      </AbstractBackground>
    </>
  )
}

import { AuthProvider } from './context/AuthContext'
import { AuthModal } from './components/auth/AuthModal'
import { ProfilePage } from './pages/ProfilePage'

export default function App() {
  const dashboard = useWalletDashboard()
  const { theme, toggleTheme } = useTheme()

  return (
    <AuthProvider>
      <ScrollToTop />
      <AuthModal />
      <Routes>
        <Route path="/" element={<HomeRoute dashboard={dashboard} theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/wallet/:address/:tab?" element={<DashboardRoute dashboard={dashboard} />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
