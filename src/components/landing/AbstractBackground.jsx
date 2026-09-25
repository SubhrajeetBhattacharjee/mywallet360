import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function AbstractBackground({ children }) {
  const containerRef = useRef(null)
  const orb1Ref = useRef(null)
  const orb2Ref = useRef(null)
  const orb3Ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Very slow, continuous organic movement
      gsap.to(orb1Ref.current, {
        x: 'random(-50, 50)vw',
        y: 'random(-30, 30)vh',
        rotation: 360,
        duration: 'random(20, 30)',
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })

      gsap.to(orb2Ref.current, {
        x: 'random(-40, 60)vw',
        y: 'random(-40, 40)vh',
        scale: 'random(0.8, 1.2)',
        duration: 'random(25, 35)',
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })

      gsap.to(orb3Ref.current, {
        x: 'random(-30, 70)vw',
        y: 'random(-50, 50)vh',
        rotation: -360,
        duration: 'random(30, 40)',
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })

      // Slight parallax on scroll for the whole background layer
      gsap.to(containerRef.current, {
        y: -150,
        ease: 'none',
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', background: 'transparent' }}>
      {/* Abstract Background Layer */}
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '120vh',
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          opacity: 1,
          background: 'var(--bg)',
        }}
      >
        {/* Dotted Tech Grid */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.25,
        }} />

        {/* Orb 1 - Vibrant Teal */}
        <div
          ref={orb1Ref}
          style={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            width: '45vw',
            height: '45vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(24,197,192,0.22) 0%, rgba(24,197,192,0) 70%)',
            filter: 'blur(70px)',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Orb 2 - Deep Blue */}
        <div
          ref={orb2Ref}
          style={{
            position: 'absolute',
            top: '40%',
            right: '-10%',
            width: '55vw',
            height: '55vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.16) 0%, rgba(59,130,246,0) 70%)',
            filter: 'blur(80px)',
            transform: 'translate(50%, -50%)',
          }}
        />

        {/* Orb 3 - Mint Green */}
        <div
          ref={orb3Ref}
          style={{
            position: 'absolute',
            bottom: '0%',
            left: '20%',
            width: '50vw',
            height: '50vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20,184,166,0.2) 0%, rgba(20,184,166,0) 70%)',
            filter: 'blur(70px)',
            transform: 'translate(-50%, 50%)',
          }}
        />

        {/* Orb 4 - Soft Indigo (Web3 Vibe) */}
        <div
          style={{
            position: 'absolute',
            top: '60%',
            left: '50%',
            width: '40vw',
            height: '40vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(99,102,241,0) 70%)',
            filter: 'blur(80px)',
            transform: 'translate(-50%, -50%)',
            animation: 'pulse-slow 15s ease-in-out infinite alternate',
          }}
        />

        <style>{`
          @keyframes pulse-slow {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
            100% { transform: translate(-40%, -40%) scale(1.1); opacity: 1; }
          }
        `}</style>
        
        {/* Noise Texture Overlay for Premium Feel */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            opacity: 0.03,
            mixBlendMode: 'overlay',
          }}
        />
      </div>

      {/* Content wrapper relative to sit above the absolute background */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
