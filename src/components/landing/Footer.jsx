import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function Footer() {
  const footerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(footerRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: footerRef.current, start: 'top 95%', toggleActions: 'play none none none' }
        }
      )
    }, footerRef)

    return () => ctx.revert()
  }, [])

  return (
    <footer
      ref={footerRef}
      style={{
        background: 'transparent',
        fontFamily: "'Inter', 'DM Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>
        
        {/* Top Footer Area */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 40, borderBottom: '1px solid var(--border)' }}>
          
          {/* Left: Logo & Tagline */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <img src="/images/darklogo.svg" alt="" style={{ width: 28, height: 28 }} />
              <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                MyWallet<span style={{ color: '#18c5c0' }}>360</span>
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)', fontWeight: 450 }}>
              Ethereum wallet analytics, explained in plain English.
            </p>
          </div>

          {/* Right: Links & Social */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
            {/* Nav Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              {['Features', 'How it works', 'About', 'FAQ'].map(label => (
                <a
                  key={label}
                  href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
                  style={{
                    fontSize: 13.5,
                    fontWeight: 500,
                    color: 'var(--muted)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.target.style.color = '#0f172a'}
                  onMouseLeave={e => e.target.style.color = '#64748b'}
                >
                  {label}
                </a>
              ))}
            </div>

            {/* Social Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <a href="#" style={{ color: 'var(--ink)' }}>
                {/* X / Twitter Icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" style={{ color: 'var(--ink)' }}>
                {/* Discord Icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Area */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 0 48px' }}>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>
            © 2026 MyWallet360. All rights reserved.
          </p>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>
            Same blockchain. More clarity.
          </p>
        </div>

      </div>
    </footer>
  )
}
