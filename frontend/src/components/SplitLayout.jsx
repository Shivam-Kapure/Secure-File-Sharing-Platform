import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SplitLayout({ 
  mainContent, 
  sidebarContent, 
  mainNav = null,
  sidebarNav = null 
}) {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="split-layout">
      {/* Main Content Pane */}
      <div className="split-pane-main">
        <header className="header-top">
          <Link to="/" className="brand-logo" style={{ fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase', lineHeight: 1.2 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>Private exchange,</span>
              <span>framed with editorial clarity.</span>
            </div>
          </Link>
          <nav className="flex gap-1 align-center">
            {mainNav || (
              <>
                <Link to="/app/files" className="btn btn-outline dark" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>Files</Link>
              </>
            )}
          </nav>
        </header>

        <main>
          {mainContent}
        </main>
      </div>

      {/* Sidebar Pane */}
      <div className="split-pane-sidebar">
        <header className="header-top sidebar">
          <div style={{ flex: 1 }}></div> {/* Spacer */}
          <nav className="flex gap-1 align-center">
            {sidebarNav || (
              isAuthenticated ? (
                <>
                  <span className="pill">My Vault</span>
                  <button onClick={logout} className="btn btn-outline light" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline light" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>Log In</Link>
                  <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', backgroundColor: '#FDFDFD', color: '#1A1A1A' }}>Sign Up</Link>
                </>
              )
            )}
          </nav>
        </header>

        <aside className="sidebar-content">
          {sidebarContent}
        </aside>
      </div>
    </div>
  );
}
