import { Link } from "react-router-dom";
import SplitLayout from "../components/SplitLayout";
import Reveal from "../components/Reveal";

function HomePage() {
  const mainContent = (
    <div>
      <Reveal>
        <h1 className="huge-title" style={{ fontSize: 'clamp(5rem, 15vw, 14rem)', fontWeight: 800, letterSpacing: '-0.08em', paddingRight: '1rem' }}>
          Vault<sup style={{ fontSize: '0.25em', verticalAlign: 'super', marginLeft: '0.05em', fontWeight: 800, letterSpacing: 'normal' }}>TM</sup>
        </h1>
      </Reveal>
      
      <div className="mb-2"></div>

      <ul className="dotted-list">
        <Reveal delay={100}>
          <li className="dotted-item">
            <div className="item-main">
              <h3>Library flow</h3>
              <p className="item-sub">Review each file record with type, size, and creation date.</p>
            </div>
            <span className="pill">01</span>
          </li>
        </Reveal>
        <Reveal delay={200}>
          <li className="dotted-item">
            <div className="item-main">
              <h3>Share setup</h3>
              <p className="item-sub">Choose permission and optional expiry before generating link token.</p>
            </div>
            <span className="pill">02</span>
          </li>
        </Reveal>
        <Reveal delay={300}>
          <li className="dotted-item">
            <div className="item-main">
              <h3>Public view</h3>
              <p className="item-sub">Recipients see trusted file details or clear invalid/expired status.</p>
            </div>
            <span className="pill">03</span>
          </li>
        </Reveal>
      </ul>
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
