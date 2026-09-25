import { WalletHeader } from './WalletHeader'
import { MetricCards } from './MetricCards'
import { ChartsSection } from './ChartsSection'
import { ActivityInsightsSection } from './ActivityInsightsSection'

export function OverviewTab({ wallet, resolvedIdentifier, isLoading, onRefresh }) {
  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      <WalletHeader wallet={wallet} resolvedIdentifier={resolvedIdentifier} isLoading={isLoading} onRefresh={onRefresh} />
      <MetricCards wallet={wallet} />
      <ChartsSection wallet={wallet} />
      <ActivityInsightsSection wallet={wallet} />
    </div>
  )
}
