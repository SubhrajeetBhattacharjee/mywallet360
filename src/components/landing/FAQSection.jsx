import { useState, useEffect, useRef } from 'react'
import { Plus, Minus } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const faqs = [
  {
    question: 'Is MyWallet360 free to use?',
    answer: 'Yes, MyWallet360 is completely free to use. There are no hidden fees or subscriptions required to access standard analytics.',
  },
  {
    question: 'Do I need to connect my wallet?',
    answer: 'No, you do not need to connect your wallet. You can simply search any public Ethereum address or ENS name to view its data safely.',
  },
  {
    question: 'Where does the data come from?',
    answer: 'We fetch real-time and historical on-chain data directly from public Ethereum nodes and indexed APIs to ensure accuracy.',
  },
  {
    question: 'Does it include NFTs and DeFi positions?',
    answer: 'Currently, we focus on standard token transfers and portfolio valuation. Advanced NFT analytics and complex DeFi positions will be supported in future updates.',
  },
  {
    question: 'Can I search ENS names?',
    answer: 'Yes! You can search for any registered .eth name (e.g., vitalik.eth) and we will automatically resolve it to the correct wallet address.',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const faqRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power4.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%', toggleActions: 'play none none none' }
        }
      )

      // FAQs stagger in
      gsap.fromTo(faqRefs.current,
        { opacity: 0, x: 20 },
        {
          opacity: 1, x: 0, duration: 0.8, ease: 'power4.out', stagger: 0.1,
          scrollTrigger: { trigger: faqRefs.current[0], start: 'top 85%', toggleActions: 'play none none none' }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="faq"
      style={{
        background: 'transparent',
        padding: '120px 0',
        fontFamily: "'Inter', 'DM Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '0 48px', display: 'flex', gap: 64, alignItems: 'flex-start' }}>
        
        {/* Left Side: Header */}
        <div ref={headerRef} style={{ flex: '0 0 320px', opacity: 0 }}>
          <span style={{ display: 'block', color: '#18c5c0', fontWeight: 700, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 20 }}>
            FAQ
          </span>
          <h2 style={{ margin: 0, marginBottom: 12, fontWeight: 900, fontSize: 'clamp(32px, 4vw, 42px)', letterSpacing: '-0.03em', color: 'var(--ink)', lineHeight: 1.1 }}>
            Questions?
          </h2>
          <p style={{ margin: 0, fontSize: 16.5, color: 'var(--muted)', fontWeight: 450 }}>
            Here are some quick answers.
          </p>
        </div>

        {/* Right Side: Accordion */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <div key={index} ref={el => faqRefs.current[index] = el} style={{ borderBottom: '1px solid var(--border)', opacity: 0 }}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    style={{
                      width: '100%',
                      padding: '24px 0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      color: 'var(--ink)',
                    }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 500, paddingRight: 24 }}>
                      {faq.question}
                    </span>
                    <span style={{ color: 'var(--muted)', flexShrink: 0 }}>
                      {isOpen ? <Minus size={18} strokeWidth={2} /> : <Plus size={18} strokeWidth={2} />}
                    </span>
                  </button>
                  <div
                    style={{
                      maxHeight: isOpen ? 200 : 0,
                      overflow: 'hidden',
                      transition: 'max-height 0.3s ease-in-out',
                    }}
                  >
                    <p style={{ margin: 0, paddingBottom: 24, fontSize: 15, color: 'var(--muted)', lineHeight: 1.6, paddingRight: 40 }}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
