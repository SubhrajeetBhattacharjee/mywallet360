import { useEffect, useRef } from 'react'
import { Search, ArrowRight } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function CTASection({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  isLoading,
}) {
  const containerRef = useRef(null)
  const bannerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(bannerRef.current,
        { opacity: 0, scale: 0.95, y: 30 },
        {
          opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power4.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 85%', toggleActions: 'play none none none' }
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about"
      ref={containerRef}
      style={{
        background: 'transparent',
        padding: '0 0 100px',
        fontFamily: "'Inter', 'DM Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>
        <div
          ref={bannerRef}
          style={{
            background: 'linear-gradient(135deg, rgba(24,197,192,0.08) 0%, rgba(24,197,192,0.03) 100%)',
            borderRadius: 24,
            padding: '56px 64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 40,
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(24,197,192,0.1)',
          }}
        >
          {/* Subtle background pattern */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, pointerEvents: 'none' }}>
             {/* A subtle SVG wave pattern could go here, but keeping it simple for now */}
          </div>

          {/* Left Side: Text */}
          <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
            <h2 style={{ margin: 0, marginBottom: 12, fontWeight: 900, fontSize: 'clamp(28px, 3vw, 36px)', letterSpacing: '-0.02em', color: 'var(--ink)' }}>
              Start exploring.
            </h2>
            <p style={{ margin: 0, fontSize: 15.5, color: 'var(--muted)', fontWeight: 450 }}>
              Enter a wallet or ENS name and see the difference.
            </p>
          </div>

          {/* Right Side: Search */}
          <div style={{ flex: '0 0 500px', position: 'relative', zIndex: 1 }}>
            <form
              onSubmit={(e) => { e.preventDefault(); onSearchSubmit(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                height: 60,
                overflow: 'hidden',
              }}
            >
              <span style={{ paddingLeft: 18, color: 'var(--muted)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <Search size={18} strokeWidth={1.8} />
              </span>
              <input
                type="text"
                value={searchValue}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Enter Ethereum address or ENS name..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: 14.5,
                  color: 'var(--ink)',
                  fontFamily: 'inherit',
                  fontWeight: 450,
                  padding: '0 12px',
                  background: 'transparent',
                  height: '100%',
                }}
              />
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  background: '#0f172a',
                  color: 'white',
                  border: 'none',
                  borderRadius: 10,
                  margin: 6,
                  padding: '0 22px',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  height: 'calc(100% - 12px)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? 'Analyzing...' : 'Analyze'} <ArrowRight size={14} strokeWidth={2} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}
