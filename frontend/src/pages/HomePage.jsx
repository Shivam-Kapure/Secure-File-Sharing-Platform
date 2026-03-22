import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import SplitLayout from "../components/SplitLayout";
import Reveal from "../components/Reveal";

function AnimatedShape() {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const paths = svgRef.current.querySelectorAll('.draw, .draw-dashed');
    paths.forEach(el => {
      // Small timeout to ensure DOM is fully measured
      setTimeout(() => {
        let len = 300;
        if (el.getTotalLength) {
          len = el.getTotalLength();
        }
        el.style.setProperty('--len', `${len}px`);
        el.style.strokeDasharray = len;
        el.style.strokeDashoffset = len;
      }, 50);
    });
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '200px', height: 'auto', overflow: 'visible', mixBlendMode: 'multiply' }}>
      {/* 3D Outer Box */}
      <polyline className="draw p1" points="30,50 120,50 120,140 30,140 30,50" />
      <polyline className="draw p2" points="30,50 60,20 150,20 120,50" />
      <polyline className="draw p3" points="120,50 150,20 150,110 120,140" />
      
      {/* Heavy Hinge Mechanisms */}
      <polyline className="draw p3" points="26,70 34,70 34,84 26,84 26,70" />
      <polyline className="draw p3" points="26,106 34,106 34,120 26,120 26,106" />

      {/* Main Structural Circular Vault Door */}
      <circle className="draw p4" cx="75" cy="95" r="38" />
      <circle className="draw-dashed p5" cx="75" cy="95" r="32" />
      <circle className="draw p6" cx="75" cy="95" r="26" />

      {/* Center Handle Hub & Outer Turn Ring */}
      <circle className="draw p7" cx="75" cy="95" r="6" />
      <circle className="draw-dashed p7" cx="75" cy="95" r="16" />

      {/* Triple Lock Spoke Handle */}
      <line className="draw p7" x1="75" y1="89" x2="75" y2="79" />
      <line className="draw p7" x1="80.2" y1="98" x2="89.3" y2="103.2" />
      <line className="draw p7" x1="69.8" y1="98" x2="60.7" y2="103.2" />
    </svg>
  );
}

function HomePage() {
  const mainContent = (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '1rem', marginTop: '-5rem' }}>
        <Reveal>
          <h1 className="huge-title" style={{ fontSize: 'clamp(6rem, 20vw, 22rem)', fontWeight: 900, letterSpacing: '-0.08em', paddingRight: '1rem', lineHeight: 0.85, margin: 0, paddingBottom: 0 }}>
            Vault<sup style={{ fontSize: '0.25em', verticalAlign: 'super', marginLeft: '0.15em', fontWeight: 900, letterSpacing: 'normal' }}>TM</sup>
          </h1>
        </Reveal>
        <Reveal delay={200} style={{ padding: '0 2.5rem 1rem 0', marginLeft: 'auto', display: 'flex', alignItems: 'flex-end' }}>
          <AnimatedShape />
        </Reveal>
      </div>
      
      {/* Intro Text placed "somewhere else" (Below the header as a massive sub-headline) */}
      <Reveal delay={100} style={{ padding: '0 2.5rem 3rem' }}>
        <p style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', lineHeight: 1.3, fontWeight: 500, opacity: 0.9, maxWidth: '35ch', letterSpacing: '-0.02em', margin: 0 }}>
          Structural integrity for digital assets. Secure, verifiable object placement and cryptographic permission layering for the modern exchange.
        </p>
      </Reveal>

      {/* The 3 points aligned in a block structure (3 columns with structural top border) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', padding: '0 2.5rem 2rem' }}>
        
        {/* Block 1 */}
        <Reveal delay={150}>
          <div className="editorial-block">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="animate-float" style={{ opacity: 0.8 }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                </div>
                <span className="item-number" style={{ fontSize: '1.5rem', fontWeight: 600, opacity: 0.3, letterSpacing: '-0.02em', transition: 'all 300ms ease' }}>01</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Library flow</h3>
                <p style={{ opacity: 0.7, fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>Review each file record with type, size, and creation date.</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Block 2 */}
        <Reveal delay={250}>
          <div className="editorial-block">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="animate-pulse-slow" style={{ opacity: 0.8 }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                 <span className="item-number" style={{ fontSize: '1.5rem', fontWeight: 600, opacity: 0.3, letterSpacing: '-0.02em', transition: 'all 300ms ease' }}>02</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Share setup</h3>
                <p style={{ opacity: 0.7, fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>Choose permission and optional expiry before generating link token.</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Block 3 */}
        <Reveal delay={350}>
          <div className="editorial-block">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="animate-spin-slow" style={{ opacity: 0.8 }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </div>
                 <span className="item-number" style={{ fontSize: '1.5rem', fontWeight: 600, opacity: 0.3, letterSpacing: '-0.02em', transition: 'all 300ms ease' }}>03</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Public view</h3>
                <p style={{ opacity: 0.7, fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>Recipients see trusted file details or clear invalid/expired status.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );

  const sidebarContent = (
    <>
      <h2>Secure file sharing platform</h2>
      <p style={{ opacity: 0.9, lineHeight: 1.6, marginBottom: '2rem' }}>
        Upload metadata, generate permission-aware links, and hand off access with control.
        The system stays minimal, readable, and direct.
      </p>

      <div className="flex gap-1" style={{ flexDirection: 'column' }}>
        <Link className="btn btn-primary" style={{ backgroundColor: '#FDFDFD', color: '#1A1A1A' }} to="/register">
          Create account
        </Link>
        <Link className="btn btn-outline light" to="/login">
          Sign in
        </Link>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '4rem' }}>
        <p style={{ opacity: 0.7, fontSize: '0.875rem' }}>
          Cookie-authenticated sessions and token-based public access. Internal actions remain protected.
        </p>
      </div>
    </>
  );

  return (
    <SplitLayout
      mainContent={mainContent}
      sidebarContent={sidebarContent}
    />
  );
}

export default HomePage;
