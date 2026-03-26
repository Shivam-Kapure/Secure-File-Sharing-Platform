import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, buildShareUrl } from "../lib/api";
import { formatBytes, formatDate } from "../lib/format";
import { useAuth } from "../context/AuthContext";
import SplitLayout from "../components/SplitLayout";
import Reveal from "../components/Reveal";

const DEFAULT_PERMISSION = "view";

function FilesPage() {
  const { markLoggedOut } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [storageKey, setStorageKey] = useState("");
  const [permission, setPermission] = useState(DEFAULT_PERMISSION);
  const [expiresAt, setExpiresAt] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [busyId, setBusyId] = useState("");
  const [shareBusy, setShareBusy] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  async function loadFiles() {
    setLoading(true);
    setError("");
    try {
      const data = await api.listFiles();
      setFiles(data.files || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const sortedFiles = useMemo(
    () =>
      [...files].sort(
        (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      ),
    [files]
  );

  async function onLogout() {
    // handled in SplitLayout now via useAuth(), but we keep function if needed
  }

  async function onCreateMetadata(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = form.elements.namedItem("file");
    const file = fileInput?.files?.[0];

    setActionError("");
    if (!file) {
      setActionError("Select a file first.");
      return;
    }

    setUploadBusy(true);
    try {
      // Step 1: Get presigned upload URL from backend
      const { uploadURL, key } = await api.getUploadURL({
        filename: file.name,
        mime_type: file.type || "application/octet-stream"
      });

      // Step 2: PUT actual file binary to R2 via presigned URL
      const uploadResponse = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to cloud storage.");
      }

      // Step 3: Register file metadata in database
      await api.createFile({
        filename: file.name,
        mime_type: file.type || "application/octet-stream",
        size: file.size,
        storage_key: key
      });

      setStorageKey("");
      form.reset();
      await loadFiles();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUploadBusy(false);
    }
  }

  async function onDelete(fileId) {
    const confirmed = window.confirm("Delete this file record? This cannot be undone.");
    if (!confirmed) return;

    setActionError("");
    setBusyId(fileId);
    try {
      await api.deleteFile(fileId);
      setFiles((current) => current.filter((item) => String(item.id) !== String(fileId)));
      if (selectedFile?.id === fileId) {
        closeShareModal();
      }
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId("");
    }
  }

  function openShareModal(file) {
    setSelectedFile(file);
    setPermission(DEFAULT_PERMISSION);
    setExpiresAt("");
    setShareLink("");
    setActionError("");
  }

  function closeShareModal() {
    setSelectedFile(null);
    setPermission(DEFAULT_PERMISSION);
    setExpiresAt("");
    setShareLink("");
    setShareBusy(false);
  }

  async function onGenerateShare(event) {
    event.preventDefault();
    if (!selectedFile) return;

    setActionError("");
    setShareBusy(true);
    try {
      const data = await api.createShare(selectedFile.id, {
        permission,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null
      });

      if (permission === "download" && data.cloudflareLink) {
        setShareLink(data.cloudflareLink);
      } else {
        setShareLink(buildShareUrl(data.share.share_token));
      }
    } catch (err) {
      setActionError(err.message);
    } finally {
      setShareBusy(false);
    }
  }

  async function copyShareLink() {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
    } catch {
      setActionError("Could not copy to clipboard.");
    }
  }

  const mainContent = (
    <div>
      <Reveal>
        <div className="flex justify-between align-center" style={{ padding: '3rem 2.5rem 1rem' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 500, letterSpacing: '-0.05em' }}>Library</h1>
          <button className="btn btn-outline dark" onClick={loadFiles} style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
            Refresh
          </button>
        </div>
      </Reveal>

      {loading ? (
        <div style={{ padding: '2.5rem', display: 'flex', justifyContent: 'center' }}>
          <div className="loading-spinner" />
        </div>
      ) : null}

      {!loading && error ? (
        <div style={{ padding: '2.5rem', color: '#B71C1C' }}>
          <p>{error}</p>
        </div>
      ) : null}

      {!loading && !error && sortedFiles.length === 0 ? (
        <div style={{ padding: '3rem 2.5rem', color: 'var(--text-muted)' }}>
          <p>No files yet. Upload your first document via the sidebar.</p>
        </div>
      ) : null}

      {!loading && !error && sortedFiles.length > 0 ? (
        <ul className="dotted-list">
          {sortedFiles.map((file, i) => (
            <Reveal key={file.id} delay={i * 100}>
              <li className="dotted-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                <div className="flex justify-between align-center" style={{ width: '100%' }}>
                  <div className="item-main">
                    <h3>{file.filename}</h3>
                    <div className="flex gap-1 align-center item-sub" style={{ marginTop: '0.5rem' }}>
                      <span className="pill" style={{ borderColor: 'rgba(0,0,0,0.2)' }}>{file.mime_type || "Unknown type"}</span>
                      <span>{formatBytes(Number(file.size))}</span>
                      <span>•</span>
                      <span>{formatDate(file.created_at)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-1" style={{ marginTop: '0.5rem' }}>
                  <button className="btn btn-outline dark" onClick={() => openShareModal(file)} style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
                    Share
                  </button>
                  <button
                    className="btn btn-outline dark"
                    onClick={() => onDelete(file.id)}
                    disabled={busyId === file.id}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', color: '#B71C1C', borderColor: 'rgba(183, 28, 28, 0.4)' }}
                  >
                    {busyId === file.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      ) : null}
    </div>
  );

  const sidebarContent = (
    <>
      <div style={{ flex: 1 }}>
        {selectedFile ? (
          <div style={{ background: '#FFF', color: '#1A1A1A', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', wordBreak: 'break-word' }}>Share: <br/><span style={{ opacity: 0.6 }}>{selectedFile.filename}</span></h3>
            <form onSubmit={onGenerateShare} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="form-group">
                <label className="form-label light">Permission</label>
                <select 
                  className="form-input light" 
                  value={permission} 
                  onChange={(event) => setPermission(event.target.value)}
                  style={{ backgroundColor: 'transparent' }}
                >
                  <option value="view">view</option>
                  <option value="download">download</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label light">Expiration (optional)</label>
                <input
                  className="form-input light"
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(event) => setExpiresAt(event.target.value)}
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={shareBusy}>
                {shareBusy ? "Generating..." : "Generate link"}
              </button>
            </form>

            {shareLink && (
              <div style={{ marginTop: '2rem', padding: '1rem', border: '1px dashed #E2E2E2', borderRadius: '12px' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Share URL:</p>
                <code style={{ display: 'block', padding: '0.75rem', background: '#F5F5F5', borderRadius: '8px', wordBreak: 'break-all', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {shareLink}
                </code>
                <button className="btn btn-outline dark" onClick={copyShareLink} style={{ width: '100%' }}>
                  Copy to clipboard
                </button>
              </div>
            )}

            <button className="btn btn-outline dark" onClick={closeShareModal} style={{ width: '100%', marginTop: '1rem', border: 'none' }}>
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <h2 style={{ fontSize: '2.5rem' }}>Upload</h2>
            <p style={{ opacity: 0.8, marginBottom: '2rem', fontSize: '0.875rem' }}>
              Upload a file directly to secure cloud storage (Cloudflare R2).
            </p>
            
            <form onSubmit={onCreateMetadata} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="form-group">
                <label className="form-label">Select file</label>
                <input 
                  className="form-input" 
                  name="file" 
                  type="file" 
                  style={{ border: '1px solid rgba(255,255,255,0.3)', padding: '1rem', borderRadius: '8px' }}
                />
              </div>
              
              {actionError && <p className="form-error">{actionError}</p>}
              
              <button className="btn btn-primary" type="submit" disabled={uploadBusy} style={{ backgroundColor: '#FDFDFD', color: '#1A1A1A', marginTop: '1rem' }}>
                {uploadBusy ? "Uploading..." : "Upload to cloud"}
              </button>
            </form>
          </div>
        )}
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

export default FilesPage;
