import React, { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Scene1Mockup, Scene2Mockup, Scene3Mockup, Scene4Mockup } from './FeaturesMockups'
import { TrendingUp, PieChart, CalendarDays, Zap, BarChart3, ArrowLeftRight, FileText, Settings2 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function FeaturesSection() {
  const sectionRef = useRef(null)
  const pinAreaRef = useRef(null)
  const [activeScene, setActiveScene] = useState(0)

  useGSAP(() => {
    const isMobile = window.matchMedia('(max-width: 1024px)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (isMobile || prefersReducedMotion) {
      gsap.utils.toArray('.scene-panel').forEach((panel) => {
        gsap.from(panel, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: panel,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        })
      })
      return
    }

    if (!pinAreaRef.current) return
    
    const panels = gsap.utils.toArray('.desktop-scene')
    const inners = gsap.utils.toArray('.scene-inner')
    
    // Initial states: panels 1+ are below viewport
    gsap.set(panels.slice(1), { y: '100%', opacity: 1 })
    // Ensure all scene inners start at scale 1, y 0
    gsap.set(inners, { scale: 1, y: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinAreaRef.current,
        start: 'top top',
        end: '+=400%',
        pin: true,
        scrub: 1,
        pinSpacing: true,
      }
    })

    // There are 4 panels, so 3 transitions
    panels.forEach((panel, i) => {
      if (i === 0) return
      
      const prevInner = inners[i - 1]

      // Hold phase for the current scene (20%)
      tl.to({}, { duration: 0.2 })

      // Transition phase (50%)
      tl.addLabel(`trans${i}`)
      
      tl.to(prevInner, {
        scale: 0.88,
        y: -80,
        ease: 'none',
        duration: 0.5
      }, `trans${i}`)

      tl.to(panel, {
        y: '0%',
        ease: 'none',
        duration: 0.5
      }, `trans${i}`)
      
      // Hold phase for the new scene (30%)
      tl.to({}, { duration: 0.3 })
    })

  }, { scope: sectionRef })


  return (
    <section
      ref={sectionRef}
      className="relative bg-[var(--surface)] border-t border-[var(--border)]"
      style={{ fontFamily: "'Inter', 'DM Sans', system-ui, -apple-system, sans-serif" }}
    >
      <div className="w-full z-10 hidden lg:block" ref={pinAreaRef} style={{ position: 'relative', height: '100svh', overflow: 'hidden' }}>
        
        {/* ================= SCENE 1 ================= */}
        <div className="desktop-scene w-full h-full bg-[var(--surface)]" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}>
          <div className="scene-inner w-full h-full flex items-center justify-center p-[clamp(24px,4svh,64px)] px-[clamp(24px,5vw,100px)]" style={{ willChange: 'transform', transformOrigin: 'top center' }}>
            <div className="w-full max-w-[1440px] h-full flex items-center gap-[clamp(24px,4vw,64px)] mx-auto relative">
              <div className="w-full max-w-[480px] shrink-0 flex flex-col pt-4">

                <div className="text-[12px] font-semibold text-[#18c5c0] tracking-[0.22em] uppercase mb-6 mt-[-10px]">WHAT YOU GET</div>
                <h2 className="text-[clamp(40px,4.5vw,64px)] font-black text-[var(--ink)] leading-[1.1] tracking-[-0.04em] mb-6 xl:mb-8">
                  Understand the<br/>wallet at a glance.
                </h2>
                <p className="text-[clamp(16px,2vw,20px)] text-[var(--muted)] font-medium leading-[1.6] mb-10 xl:mb-12">
                  Portfolio value, ETH balance, wallet age, activity and the signals that matter — all in one view.
                </p>
                
                <div className="flex flex-col gap-6 xl:gap-8 mb-8">
                  {[
                    { i: <TrendingUp size={16}/>, t: 'Key metrics instantly', d: 'See portfolio value, ETH balance, wallet age and transaction count.' },
                    { i: <PieChart size={16}/>, t: 'Token allocation', d: "Visualize what the wallet holds and how it's distributed." },
                    { i: <CalendarDays size={16}/>, t: 'Historical trends', d: 'Track portfolio value over time with clear, interactive charts.' },
                    { i: <Zap size={16}/>, t: 'Real blockchain data', d: 'Powered by BlockAction. No extra APIs, no setup.' },
                  ].map(f => (
                    <div key={f.t} className="flex gap-5 items-center">
                      <div className="w-12 h-12 rounded-xl bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center shrink-0">
                        {f.i}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="text-[clamp(15px,1.5vw,17px)] font-bold text-[var(--ink)] leading-tight">{f.t}</div>
                        <div className="text-[clamp(13px,1.2vw,15px)] font-medium text-[var(--muted)] leading-snug">{f.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 w-full max-h-[calc(100svh-120px)] flex flex-col justify-center items-center">
                <div style={{ transform: 'scale(min(1, calc((100vw - 550px) / 880), calc((100svh - 120px) / 750)))', transformOrigin: 'center center', width: '880px' }} className="flex justify-center shrink-0">
                  <Scene1Mockup />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SCENE 2 ================= */}
        <div className="desktop-scene w-full h-full bg-[var(--surface)]" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 20 }}>
          <div className="scene-inner w-full h-full flex flex-col p-[clamp(24px,4svh,64px)] px-[clamp(24px,5vw,100px)]" style={{ willChange: 'transform', transformOrigin: 'top center' }}>
            <div className="w-full max-w-[1440px] h-full flex flex-col mx-auto relative">
              <div className="flex flex-col items-center text-center max-w-[800px] mx-auto shrink-0 mb-[clamp(16px,4svh,48px)]">

                <div className="text-[12px] font-semibold text-[var(--muted)] tracking-[0.22em] uppercase mb-6 mt-[-10px]">DEEPER INSIGHTS</div>
                <h2 className="text-[clamp(40px,4.5vw,64px)] font-black text-[var(--ink)] leading-[1.1] tracking-[-0.04em] mb-6">
                  Go beyond simple balances.
                </h2>
                <p className="text-[clamp(16px,2vw,20px)] text-[var(--muted)] font-medium leading-[1.6]">
                  Explore detailed transaction analytics, token flows, and wallet behavior with beautiful, easy-to-read visualizations.
                </p>
              </div>
              
              <div className="w-full flex-1 max-h-[calc(100svh-300px)] flex flex-row-reverse items-start gap-[clamp(24px,4vw,64px)] justify-between">
                <div className="w-full max-w-[420px] shrink-0 flex flex-col gap-6 xl:gap-8 pt-4 xl:pt-8">
                  <div className="bg-[var(--surface)] rounded-2xl p-[clamp(16px,2svh,24px)] shadow-[0_8px_30px_rgba(15,23,42,0.04)] border border-[var(--border)] flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-[#ecfdf5] text-[#10b981] flex items-center justify-center shrink-0">
                      <BarChart3 size={20} />
                    </div>
                    <div>
                      <div className="text-[clamp(16px,1.5vw,18px)] font-bold text-[var(--ink)] mb-1">Transaction Analytics</div>
                      <div className="text-[clamp(12px,1.2vw,14px)] font-medium text-[var(--muted)] leading-snug">Visualize incoming/outgoing transactions, fees, and activity patterns over time.</div>
                    </div>
                  </div>

                  <div className="bg-[var(--surface)] rounded-2xl p-[clamp(16px,2svh,24px)] shadow-[0_8px_30px_rgba(15,23,42,0.04)] border border-[var(--border)] flex gap-4 items-center opacity-50">
                    <div className="w-12 h-12 rounded-xl bg-[#e0e7ff] text-[#6366f1] flex items-center justify-center shrink-0">
                      <PieChart size={20} />
                    </div>
                    <div>
                      <div className="text-[clamp(16px,1.5vw,18px)] font-bold text-[var(--ink)] mb-1">Token Transfers</div>
                      <div className="text-[clamp(12px,1.2vw,14px)] font-medium text-[var(--muted)] leading-snug">See what tokens move in and out, including ERC-20s, NFTs, and more.</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 w-full h-full flex justify-start items-start">
                  <div style={{ transform: 'scale(min(0.65, calc((100vw - 550px) / 1000), calc((100svh - 300px) / 850)))', transformOrigin: 'top left', width: '880px' }} className="shrink-0">
                    <Scene2Mockup />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SCENE 3 ================= */}
        <div className="desktop-scene w-full h-full bg-[var(--surface)]" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 30 }}>
          <div className="scene-inner w-full h-full flex items-center justify-center p-[clamp(24px,4svh,64px)] px-[clamp(24px,5vw,100px)]" style={{ willChange: 'transform', transformOrigin: 'top center' }}>
            <div className="w-full max-w-[1440px] h-full flex items-center gap-[clamp(24px,4vw,64px)] mx-auto relative">
              <div className="w-full max-w-[450px] shrink-0 flex flex-col pt-4">

                <div className="text-[12px] font-semibold text-[var(--muted)] tracking-[0.22em] uppercase mb-4 mt-[-10px]">FOLLOW THE FLOW</div>
                <h2 className="text-[clamp(40px,4.5vw,64px)] font-black text-[var(--ink)] leading-[0.95] tracking-[-0.04em] mb-4 xl:mb-6">
                  See where the<br/>money moves.
                </h2>
                <p className="text-[clamp(16px,2vw,20px)] text-[var(--muted)] font-medium leading-[1.5] mb-[clamp(16px,3svh,48px)]">
                  Understand what came in, what went out, and how the balance changed over time.
                </p>
                
                <div className="flex flex-col gap-[clamp(12px,2svh,24px)] mb-[clamp(24px,4svh,48px)]">
                  <div className="bg-[var(--surface)] rounded-2xl p-[clamp(16px,2svh,24px)] shadow-[0_8px_30px_rgba(15,23,42,0.06)] border border-[var(--border)] flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-[#ecfdf5] text-[#10b981] flex items-center justify-center shrink-0">
                      <ArrowLeftRight size={20} />
                    </div>
                    <div>
                      <div className="text-[clamp(16px,1.5vw,18px)] font-bold text-[var(--ink)] mb-1">Money Flow</div>
                      <div className="text-[clamp(12px,1.2vw,14px)] font-medium text-[var(--muted)] leading-snug">Visualize incoming and outgoing transfers across tokens, contracts, and protocols.</div>
                    </div>
                  </div>

                  <div className="bg-[var(--surface)] rounded-2xl p-[clamp(16px,2svh,24px)] shadow-[0_8px_30px_rgba(15,23,42,0.04)] border border-[var(--border)] flex gap-4 items-center opacity-50">
                    <div className="w-12 h-12 rounded-xl bg-[#e0e7ff] text-[#6366f1] flex items-center justify-center shrink-0">
                      <PieChart size={20} />
                    </div>
                    <div>
                      <div className="text-[clamp(16px,1.5vw,18px)] font-bold text-[var(--ink)] mb-1">Portfolio & Holdings</div>
                      <div className="text-[clamp(12px,1.2vw,14px)] font-medium text-[var(--muted)] leading-snug">See token balances, estimated values, allocation and pricing coverage.</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 w-full max-h-[calc(100svh-120px)] flex flex-col justify-center items-center">
                <div style={{ transform: 'scale(min(1, calc((100vw - 550px) / 880), calc((100svh - 120px) / 850)))', transformOrigin: 'center center', width: '880px' }} className="flex justify-center shrink-0">
                  <Scene3Mockup />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SCENE 4 ================= */}
        <div className="desktop-scene w-full h-full bg-[var(--surface)]" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }}>
          <div className="scene-inner w-full h-full flex items-center justify-center p-[clamp(24px,4svh,64px)] px-[clamp(24px,5vw,100px)]" style={{ willChange: 'transform', transformOrigin: 'top center' }}>
            <div className="w-full max-w-[1440px] h-full flex flex-row-reverse items-center gap-[clamp(24px,4vw,64px)] mx-auto relative">
              <div className="w-full max-w-[450px] shrink-0 flex flex-col pt-4">

                <div className="text-[12px] font-semibold text-[var(--muted)] tracking-[0.22em] uppercase mb-4 mt-[-10px]">TURN DATA INTO CLARITY</div>
                <h2 className="text-[clamp(40px,4.5vw,64px)] font-black text-[var(--ink)] leading-[1] tracking-[-0.04em] mb-4 xl:mb-6">
                  More than data.<br/>Real insights.
                </h2>
                <p className="text-[clamp(16px,2vw,20px)] text-[var(--muted)] font-medium leading-[1.5] mb-[clamp(16px,3svh,48px)]">
                  Understand wallet behavior, patterns, and opportunities with transparent, data-backed insights.
                </p>
                
                <div className="flex flex-col gap-[clamp(12px,2svh,24px)] mb-[clamp(24px,4svh,48px)]">
                  {[
                    { i: <TrendingUp size={16}/>, t: 'Wallet Insights', d: 'Identify behavioral patterns like holder, trader, DEX user, or NFT collector.' },
                    { i: <BarChart3 size={16}/>, t: 'Actionable Signals', d: 'See concentration risk, activity trends, and key wallet characteristics.' },
                    { i: <Settings2 size={16}/>, t: 'No Extra APIs', d: 'Built on BlockAction data you already fetch — no Etherscan Pro, no extra setup.' },
                  ].map((f, i) => (
                    <div key={f.t} className={`flex gap-4 items-center ${i > 0 ? 'opacity-50' : ''}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${i === 0 ? 'bg-[#ecfdf5] text-[#10b981]' : i === 1 ? 'bg-[#e0e7ff] text-[#6366f1]' : 'bg-[#fff1f2] text-[#e11d48]'}`}>
                        {f.i}
                      </div>
                      <div>
                        <div className="text-[clamp(14px,1.5vw,16px)] font-bold text-[var(--ink)] leading-tight mb-1">{f.t}</div>
                        <div className="text-[clamp(12px,1.2vw,14px)] font-medium text-[var(--muted)] leading-snug">{f.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 w-full max-h-[calc(100svh-120px)] flex flex-col justify-center items-center">
                <div style={{ transform: 'scale(min(1, calc((100vw - 550px) / 880), calc((100svh - 120px) / 850)))', transformOrigin: 'center center', width: '880px' }} className="flex justify-center shrink-0">
                  <Scene4Mockup />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE FALLBACK (Simple Stack) ================= */}
      <div className="lg:hidden flex flex-col gap-24 py-16 px-6">
        <div className="scene-panel flex flex-col gap-8">
          <div>
            <div className="text-[11px] font-semibold text-[#18c5c0] tracking-[0.2em] uppercase mb-4">WHAT YOU GET</div>
            <h2 className="text-[40px] font-black text-[var(--ink)] leading-[1.1] tracking-[-0.03em] mb-4">Understand the wallet at a glance.</h2>
            <p className="text-[16px] text-[var(--muted)] font-medium">Portfolio value, ETH balance, wallet age, activity and the signals that matter.</p>
          </div>
          <div className="h-[500px] -mx-6 overflow-hidden relative"><Scene1Mockup /></div>
        </div>
        <div className="scene-panel flex flex-col gap-8">
          <div>
            <div className="text-[11px] font-semibold text-[var(--muted)] tracking-[0.2em] uppercase mb-4">DEEPER INSIGHTS</div>
            <h2 className="text-[40px] font-black text-[var(--ink)] leading-[1.1] tracking-[-0.03em] mb-4">Go beyond simple balances.</h2>
            <p className="text-[16px] text-[var(--muted)] font-medium">Explore detailed transaction analytics, token flows, and wallet behavior.</p>
          </div>
          <div className="h-[500px] -mx-6 overflow-hidden relative"><Scene2Mockup /></div>
        </div>
      </div>
    </section>
  )
}
