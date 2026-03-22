import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { formatBytes } from "../lib/format";
import SplitLayout from "../components/SplitLayout";
import Reveal from "../components/Reveal";

function SharePage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadShare() {
      setLoading(true);
      setError("");
      try {
        const data = await api.getShare(token);
        if (!mounted) return;
        setPayload(data);
      } catch (err) {
        if (!mounted) return;
        setPayload(null);
        setError(err.message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadShare();
    return () => {
      mounted = false;
    };
  }, [token]);

  const renderViewer = () => {
    if (!payload?.downloadURL) return null;
    
    // Check permission to restrict viewer
    const mimeType = payload.file?.mime_type || "";
    
    if (mimeType.startsWith("image/")) {
      return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F8F8', borderRadius: '16px', overflow: 'hidden' }}>
          <img src={payload.downloadURL} alt={payload.file?.filename} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </div>
      );
    }
    
    if (mimeType.startsWith("video/")) {
      return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', borderRadius: '16px', overflow: 'hidden' }}>
          <video src={payload.downloadURL} controls controlsList="nodownload" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </div>
      );
    }

    if (mimeType === "application/pdf") {
      const securePdfUrl = `${payload.downloadURL}#toolbar=0&navpanes=0&scrollbar=0`;
      return (
        <iframe 
          src={securePdfUrl}
          title={payload.file?.filename}
          style={{ width: '100%', height: '100%', flex: 1, border: 'none', borderRadius: '16px', backgroundColor: '#fff', display: 'block' }}
        />
      );
    }

    // Fallback for unsupported types
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F8F8', borderRadius: '16px', opacity: 0.7 }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <p>Preview not available for this file type.</p>
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Please use the button on the right.</p>
      </div>
    );
  };

  const mainContent = (
    <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', height: '100vh', boxSizing: 'border-box' }}>
      {!loading && payload && payload.downloadURL && payload.permission === "view" ? (
        <>
          <Reveal>
            <h1 className="huge-title" style={{ padding: 0, paddingBottom: '1.5rem', fontSize: '2rem' }}>
              {payload.file?.filename}
            </h1>
          </Reveal>
          <Reveal delay={150} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {renderViewer()}
          </Reveal>
        </>
      ) : (
        <>
          <Reveal>
            <h1 className="huge-title" style={{ padding: 0 }}>Public share access.</h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="subtitle" style={{ padding: 0, marginTop: '1rem', flex: 1 }}>
              Secure access to shared files. Validate details on the right panel.
            </p>
          </Reveal>
        </>
      )}

      {loading && (
        <div style={{ margin: 'auto' }}>
          <div className="loading-spinner"></div>
        </div>
      )}

      {!loading && error && (
        <div style={{ margin: 'auto', color: '#B71C1C' }}>
          <p>{error}</p>
        </div>
      )}
    </div>
  );

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100% '}}>
      <h2>Shared file details</h2>

      {!loading && payload ? (
        <div style={{ background: '#FFF', color: '#1A1A1A', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 500, wordBreak: 'break-word' }}>{payload.file?.filename || "Unknown"}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 500 }}>{payload.file?.mime_type || "Unknown"}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Size</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 500 }}>{formatBytes(Number(payload.file?.size))}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Permission level</p>
              <span className="pill" style={{ marginTop: '0.5rem', backgroundColor: '#F5F5F5' }}>{payload.permission}</span>
            </div>
          </div>

          {/* Action button based on permission */}
          {payload.downloadURL && payload.permission === "download" && (
            <a
              href={payload.downloadURL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '2rem', textAlign: 'center' }}
            >
              Download file
            </a>
          )}
        </div>
      ) : (
        <div style={{ opacity: 0.8 }}>
          {loading ? "Checking link..." : "Details unavailable."}
        </div>
      )}

      <div style={{ marginTop: 'auto', paddingTop: '4rem', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        <Link className="btn btn-primary" style={{ backgroundColor: '#FDFDFD', color: '#1A1A1A' }} to="/login">
          Open workspace
        </Link>
        <Link className="btn btn-outline light" to="/">
          Back to home
        </Link>
      </div>
    </div>
  );

  return (
    <SplitLayout
      mainContent={mainContent}
      sidebarContent={sidebarContent}
      mainNav={<></>}
      sidebarNav={<></>}
    />
  );
}

export default SharePage;
