import { Component } from 'react'

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('Application render failed', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className="grid min-h-screen place-content-center gap-4 bg-[var(--bg)] px-6 text-center text-[var(--ink)]">
        <h1 className="text-3xl">MyWallet360 could not load</h1>
        <p className="text-[var(--muted)]">Refresh the page to try again.</p>
        <button
          className="mx-auto cursor-pointer rounded-xl border-0 bg-[var(--primary)] px-5 py-3 font-bold text-white"
          type="button"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
        {this.state.error && (
          <div className="mt-8 text-left max-w-4xl overflow-auto p-4 bg-red-50 text-red-900 rounded border border-red-200">
            <h3 className="font-bold">{this.state.error.toString()}</h3>
            <pre className="text-xs mt-2">{this.state.error.stack}</pre>
          </div>
        )}
      </main>
    )
  }
}
