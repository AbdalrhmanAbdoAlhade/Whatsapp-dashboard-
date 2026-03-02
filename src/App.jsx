import { useState, useEffect, useRef } from "react";

const BASE_URL = "https://bakewats.playprodammam.com";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0f0a;
    --surface: #111811;
    --surface2: #162016;
    --border: #1f2e1f;
    --green: #22c55e;
    --green-dim: #16a34a;
    --green-glow: rgba(34,197,94,0.15);
    --red: #ef4444;
    --yellow: #eab308;
    --text: #e8f5e8;
    --text-dim: #6b8f6b;
    --mono: 'JetBrains Mono', monospace;
    --sans: 'Syne', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--sans); min-height: 100vh; }

  .app { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }

  /* Sidebar */
  .sidebar {
    background: var(--surface);
    border-right: 1px solid var(--border);
    padding: 24px 0;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
  }

  .logo {
    padding: 0 20px 24px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 16px;
  }

  .logo-mark {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .logo-icon {
    width: 36px; height: 36px;
    background: var(--green);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }

  .logo-text { font-size: 16px; font-weight: 800; letter-spacing: -0.5px; }
  .logo-sub { font-size: 10px; color: var(--text-dim); font-family: var(--mono); letter-spacing: 2px; }

  .nav-section { padding: 0 12px; margin-bottom: 8px; }
  .nav-label {
    font-size: 9px; letter-spacing: 3px; color: var(--text-dim);
    font-family: var(--mono); padding: 0 8px; margin-bottom: 6px;
  }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 8px;
    cursor: pointer; transition: all 0.15s;
    font-size: 13px; font-weight: 600;
    color: var(--text-dim); border: none; background: none; width: 100%; text-align: left;
  }

  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: var(--green-glow); color: var(--green); border: 1px solid rgba(34,197,94,0.2); }
  .nav-icon { font-size: 15px; width: 20px; text-align: center; }

  /* Session selector */
  .session-bar {
    margin: auto 12px 0;
    padding: 12px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
  }

  .session-label { font-size: 9px; letter-spacing: 2px; color: var(--text-dim); font-family: var(--mono); margin-bottom: 6px; }

  .session-input {
    width: 100%; background: var(--bg); border: 1px solid var(--border);
    color: var(--text); padding: 6px 10px; border-radius: 6px;
    font-family: var(--mono); font-size: 12px; outline: none;
    transition: border-color 0.15s;
  }
  .session-input:focus { border-color: var(--green); }

  /* Main content */
  .main { padding: 32px; overflow-y: auto; }

  .page-header { margin-bottom: 28px; }
  .page-title { font-size: 28px; font-weight: 800; letter-spacing: -1px; }
  .page-desc { font-size: 13px; color: var(--text-dim); margin-top: 4px; font-family: var(--mono); }

  /* Cards */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 16px;
    transition: border-color 0.2s;
  }
  .card:hover { border-color: rgba(34,197,94,0.3); }

  .card-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
  }

  .card-title-row { display: flex; align-items: center; gap: 10px; }
  .method-badge {
    font-family: var(--mono); font-size: 10px; font-weight: 500;
    padding: 3px 8px; border-radius: 4px; letter-spacing: 1px;
  }
  .method-GET { background: rgba(34,197,94,0.15); color: var(--green); border: 1px solid rgba(34,197,94,0.3); }
  .method-POST { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); }
  .method-DELETE { background: rgba(239,68,68,0.15); color: var(--red); border: 1px solid rgba(239,68,68,0.3); }

  .endpoint-name { font-size: 14px; font-weight: 700; }
  .endpoint-path { font-family: var(--mono); font-size: 11px; color: var(--text-dim); }

  .chevron { color: var(--text-dim); transition: transform 0.2s; font-size: 12px; }
  .chevron.open { transform: rotate(90deg); }

  .card-body { padding: 20px; }

  /* Form fields */
  .field { margin-bottom: 14px; }
  .field-label { font-size: 11px; font-weight: 700; letter-spacing: 1px; color: var(--text-dim); margin-bottom: 6px; font-family: var(--mono); }

  .input, .textarea {
    width: 100%; background: var(--bg); border: 1px solid var(--border);
    color: var(--text); padding: 10px 12px; border-radius: 8px;
    font-family: var(--mono); font-size: 12px; outline: none;
    transition: border-color 0.15s; resize: vertical;
  }
  .input:focus, .textarea:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(34,197,94,0.08); }
  .textarea { min-height: 80px; }

  /* File upload */
  .file-zone {
    border: 1px dashed var(--border); border-radius: 8px;
    padding: 20px; text-align: center; cursor: pointer;
    transition: all 0.15s; position: relative;
  }
  .file-zone:hover { border-color: var(--green); background: var(--green-glow); }
  .file-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .file-zone-text { font-size: 12px; color: var(--text-dim); font-family: var(--mono); }
  .file-zone-name { color: var(--green); font-size: 12px; font-family: var(--mono); margin-top: 4px; }

  /* Send button */
  .btn-send {
    background: var(--green); color: #000; border: none;
    padding: 10px 24px; border-radius: 8px; font-family: var(--sans);
    font-size: 13px; font-weight: 800; cursor: pointer; letter-spacing: 0.5px;
    transition: all 0.15s; display: flex; align-items: center; gap: 8px;
  }
  .btn-send:hover { background: #16a34a; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(34,197,94,0.3); }
  .btn-send:active { transform: translateY(0); }
  .btn-send:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .btn-danger {
    background: rgba(239,68,68,0.1); color: var(--red);
    border: 1px solid rgba(239,68,68,0.3);
    padding: 10px 24px; border-radius: 8px; font-family: var(--sans);
    font-size: 13px; font-weight: 800; cursor: pointer;
    transition: all 0.15s;
  }
  .btn-danger:hover { background: rgba(239,68,68,0.2); }
  .btn-danger:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Response area */
  .response-box {
    margin-top: 16px; border-radius: 8px; overflow: hidden;
    border: 1px solid var(--border);
  }

  .response-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 14px; background: var(--surface2);
    border-bottom: 1px solid var(--border);
  }

  .status-pill {
    font-family: var(--mono); font-size: 10px; font-weight: 500;
    padding: 2px 8px; border-radius: 20px;
  }
  .status-ok { background: rgba(34,197,94,0.15); color: var(--green); }
  .status-err { background: rgba(239,68,68,0.15); color: var(--red); }
  .status-loading { background: rgba(234,179,8,0.15); color: var(--yellow); }

  .response-body {
    padding: 14px; font-family: var(--mono); font-size: 11px;
    line-height: 1.7; white-space: pre-wrap; word-break: break-all;
    max-height: 300px; overflow-y: auto; background: var(--bg); color: #86efac;
  }

  /* QR Display */
  .qr-container {
    display: flex; flex-direction: column; align-items: center;
    padding: 24px;
  }

  .qr-img {
    background: white; padding: 16px; border-radius: 12px;
    max-width: 280px; width: 100%;
    box-shadow: 0 0 40px rgba(34,197,94,0.2);
  }

  .qr-label {
    font-family: var(--mono); font-size: 11px; color: var(--text-dim);
    text-align: center; margin-top: 12px;
  }

  .qr-refresh-btn {
    margin-top: 12px; background: none; border: 1px solid var(--border);
    color: var(--text-dim); padding: 6px 16px; border-radius: 6px;
    font-family: var(--mono); font-size: 11px; cursor: pointer;
    transition: all 0.15s;
  }
  .qr-refresh-btn:hover { border-color: var(--green); color: var(--green); }

  /* Sessions list */
  .sessions-grid { display: grid; gap: 12px; }
  .session-card {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 10px; padding: 14px 16px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .session-info { display: flex; align-items: center; gap: 10px; }
  .session-dot {
    width: 8px; height: 8px; border-radius: 50%; background: var(--green);
    box-shadow: 0 0 6px var(--green); flex-shrink: 0;
  }
  .session-id { font-family: var(--mono); font-size: 13px; font-weight: 500; }
  .session-status { font-size: 11px; color: var(--text-dim); font-family: var(--mono); }

  /* Spinner */
  .spin { animation: spin 0.8s linear infinite; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Grid */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  /* Tabs */
  .section-tabs { display: flex; gap: 4px; margin-bottom: 24px; }
  .tab-btn {
    padding: 8px 18px; border-radius: 8px; border: 1px solid var(--border);
    background: none; color: var(--text-dim); font-family: var(--sans);
    font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s;
  }
  .tab-btn.active { background: var(--green-glow); color: var(--green); border-color: rgba(34,197,94,0.3); }
  .tab-btn:hover:not(.active) { background: var(--surface2); color: var(--text); }

  .divider { height: 1px; background: var(--border); margin: 20px 0; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text-dim); }
`;

// ── helpers ──────────────────────────────────────────────────────────────────

function ResponseBox({ res }) {
  if (!res) return null;
  const isOk = res.status >= 200 && res.status < 300;
  return (
    <div className="response-box">
      <div className="response-header">
        <span style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "var(--mono)" }}>RESPONSE</span>
        <span className={`status-pill ${isOk ? "status-ok" : "status-err"}`}>
          {res.status} {res.statusText}
        </span>
      </div>
      <div className="response-body">{JSON.stringify(res.data, null, 2)}</div>
    </div>
  );
}

function LoadingRes() {
  return (
    <div className="response-box">
      <div className="response-header">
        <span style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "var(--mono)" }}>RESPONSE</span>
        <span className="status-pill status-loading">⏳ جاري الإرسال...</span>
      </div>
      <div className="response-body" style={{ textAlign: "center", padding: 24 }}>
        <span className="spin">⟳</span> Loading...
      </div>
    </div>
  );
}

async function apiFetch(method, path, body, isFormData) {
  const opts = { method, headers: {} };
  if (body) {
    if (isFormData) {
      opts.body = body;
    } else {
      opts.headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(body);
    }
  }
  try {
    const r = await fetch(`${BASE_URL}${path}`, opts);
    let data;
    const ct = r.headers.get("content-type") || "";
    if (ct.includes("application/json")) data = await r.json();
    else data = await r.text();
    return { status: r.status, statusText: r.statusText, data };
  } catch (e) {
    return { status: 0, statusText: "Network Error", data: { error: e.message } };
  }
}

// ── QR Image helper ───────────────────────────────────────────────────────────
function QRDisplay({ qrData }) {
  if (!qrData) return null;
  // could be a URL, base64, or raw qr string
  const isBase64 = typeof qrData === "string" && qrData.startsWith("data:");
  const isUrl = typeof qrData === "string" && (qrData.startsWith("http") || qrData.startsWith("/"));

  if (isBase64 || isUrl) {
    return (
      <div className="qr-container">
        <img src={qrData} alt="QR Code" className="qr-img" />
        <p className="qr-label">امسح الـ QR Code بتطبيق WhatsApp</p>
      </div>
    );
  }
  // raw string → use qr API
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;
  return (
    <div className="qr-container">
      <img src={qrUrl} alt="QR Code" className="qr-img" />
      <p className="qr-label">امسح الـ QR Code بتطبيق WhatsApp</p>
    </div>
  );
}

// ── PAGES ─────────────────────────────────────────────────────────────────────

// Sessions List
function PageSessions({ sessionId }) {
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true); setRes(null);
    const r = await apiFetch("GET", "/api/sessions");
    setRes(r); setLoading(false);
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">كل الجلسات</div>
        <div className="page-desc">List All Sessions — GET /api/sessions</div>
      </div>
      <div className="card">
        <div className="card-body">
          <p style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 16, fontFamily: "var(--mono)" }}>
            جلب قائمة بجميع الجلسات النشطة حالياً على السيرفر
          </p>
          <button className="btn-send" onClick={load} disabled={loading}>
            {loading ? <span className="spin">⟳</span> : "▶"} جلب الجلسات
          </button>
          {loading && <LoadingRes />}
          {res && !loading && <ResponseBox res={res} />}
        </div>
      </div>
    </div>
  );
}

// Start Session / QR
function PageStartSession({ sessionId }) {
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState(null);

  async function start() {
    setLoading(true); setRes(null); setQrData(null);
    const r = await apiFetch("POST", `/api/sessions/${sessionId}/start`);
    setRes(r); setLoading(false);
    // try to extract qr from response
    const d = r.data;
    if (d && typeof d === "object") {
      const q = d.qr || d.qrCode || d.qr_code || d.data?.qr || d.data?.qrCode;
      if (q) setQrData(q);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">بدء جلسة جديدة</div>
        <div className="page-desc">Start Session / Get QR — POST /api/sessions/{"{sessionId}"}/start</div>
      </div>
      <div className="card">
        <div className="card-body">
          <p style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 16, fontFamily: "var(--mono)" }}>
            Session ID: <span style={{ color: "var(--green)" }}>{sessionId}</span>
          </p>
          <button className="btn-send" onClick={start} disabled={loading}>
            {loading ? <span className="spin">⟳</span> : "▶"} بدء الجلسة
          </button>
          {loading && <LoadingRes />}
          {qrData && <QRDisplay qrData={qrData} />}
          {res && !loading && <ResponseBox res={res} />}
        </div>
      </div>
    </div>
  );
}

// Get Session Status (with QR refresh)
function PageSessionStatus({ sessionId }) {
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [qrData, setQrData] = useState(null);
  const timerRef = useRef(null);

  async function getStatus() {
    setLoading(true);
    const r = await apiFetch("GET", `/api/sessions/${sessionId}`);
    setRes(r); setLoading(false);
    const d = r.data;
    if (d && typeof d === "object") {
      const q = d.qr || d.qrCode || d.qr_code || d.data?.qr || d.data?.qrCode;
      if (q) setQrData(q); else setQrData(null);
    }
  }

  useEffect(() => {
    if (autoRefresh) {
      timerRef.current = setInterval(getStatus, 5000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [autoRefresh, sessionId]);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">حالة الجلسة</div>
        <div className="page-desc">Get Session Status — GET /api/sessions/{"{sessionId}"}</div>
      </div>
      <div className="card">
        <div className="card-body">
          <p style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 16, fontFamily: "var(--mono)" }}>
            إذا لم يتم مسح الـ QR، هيتجدد تلقائياً كل 5 ثواني عند تفعيل التحديث التلقائي
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
            <button className="btn-send" onClick={getStatus} disabled={loading}>
              {loading ? <span className="spin">⟳</span> : "▶"} جلب الحالة
            </button>
            <button
              className={`tab-btn ${autoRefresh ? "active" : ""}`}
              onClick={() => setAutoRefresh(v => !v)}
            >
              {autoRefresh ? "⏹ إيقاف التجديد" : "🔄 تجديد تلقائي (5s)"}
            </button>
          </div>
          {loading && <LoadingRes />}
          {qrData && !loading && (
            <>
              <QRDisplay qrData={qrData} />
              <div className="divider" />
            </>
          )}
          {res && !loading && <ResponseBox res={res} />}
        </div>
      </div>
    </div>
  );
}

// Delete Session
function PageDeleteSession({ sessionId }) {
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function del() {
    setLoading(true); setRes(null); setConfirm(false);
    const r = await apiFetch("DELETE", `/api/sessions/${sessionId}`);
    setRes(r); setLoading(false);
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">حذف الجلسة</div>
        <div className="page-desc">Delete Session (Logout) — DELETE /api/sessions/{"{sessionId}"}</div>
      </div>
      <div className="card">
        <div className="card-body">
          <p style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 16, fontFamily: "var(--mono)" }}>
            سيتم حذف الجلسة: <span style={{ color: "var(--red)" }}>{sessionId}</span> والخروج من WhatsApp
          </p>
          {!confirm ? (
            <button className="btn-danger" onClick={() => setConfirm(true)}>🗑 حذف الجلسة</button>
          ) : (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "var(--text-dim)", fontFamily: "var(--mono)" }}>متأكد؟</span>
              <button className="btn-danger" onClick={del} disabled={loading}>
                {loading ? <span className="spin">⟳</span> : "✓ تأكيد الحذف"}
              </button>
              <button className="tab-btn" onClick={() => setConfirm(false)}>إلغاء</button>
            </div>
          )}
          {loading && <LoadingRes />}
          {res && !loading && <ResponseBox res={res} />}
        </div>
      </div>
    </div>
  );
}

// Send Text
function PageSendText({ sessionId }) {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!to || !message) return;
    setLoading(true); setRes(null);
    const r = await apiFetch("POST", `/api/sessions/${sessionId}/send`, { to, message });
    setRes(r); setLoading(false);
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">إرسال رسالة نصية</div>
        <div className="page-desc">Send Text Message — POST /api/sessions/{"{sessionId}"}/send</div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="field">
            <div className="field-label">TO — رقم المستقبل</div>
            <input
              className="input"
              placeholder="201234567890"
              value={to}
              onChange={e => setTo(e.target.value)}
            />
          </div>
          <div className="field">
            <div className="field-label">MESSAGE — نص الرسالة</div>
            <textarea
              className="textarea"
              placeholder="اكتب رسالتك هنا..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>
          <button className="btn-send" onClick={send} disabled={loading || !to || !message}>
            {loading ? <span className="spin">⟳</span> : "📤"} إرسال
          </button>
          {loading && <LoadingRes />}
          {res && !loading && <ResponseBox res={res} />}
        </div>
      </div>
    </div>
  );
}

// Send File Upload
function PageSendFileUpload({ sessionId }) {
  const [to, setTo] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!to || !file) return;
    setLoading(true); setRes(null);
    const fd = new FormData();
    fd.append("to", to);
    fd.append("caption", caption);
    fd.append("file", file);
    const r = await apiFetch("POST", `/api/sessions/${sessionId}/send`, fd, true);
    setRes(r); setLoading(false);
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">إرسال ملف (رفع مباشر)</div>
        <div className="page-desc">Send Message with File Upload — POST /api/sessions/{"{sessionId}"}/send</div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="field">
            <div className="field-label">TO — رقم المستقبل</div>
            <input className="input" placeholder="201234567890" value={to} onChange={e => setTo(e.target.value)} />
          </div>
          <div className="field">
            <div className="field-label">CAPTION — تعليق (اختياري)</div>
            <input className="input" placeholder="وصف الملف..." value={caption} onChange={e => setCaption(e.target.value)} />
          </div>
          <div className="field">
            <div className="field-label">FILE — الملف</div>
            <div className="file-zone">
              <input type="file" onChange={e => setFile(e.target.files[0])} />
              {file ? (
                <p className="file-zone-name">✓ {file.name}</p>
              ) : (
                <p className="file-zone-text">📎 اسحب الملف أو اضغط للرفع</p>
              )}
            </div>
          </div>
          <button className="btn-send" onClick={send} disabled={loading || !to || !file}>
            {loading ? <span className="spin">⟳</span> : "📤"} إرسال
          </button>
          {loading && <LoadingRes />}
          {res && !loading && <ResponseBox res={res} />}
        </div>
      </div>
    </div>
  );
}

// Send URL Media
function PageSendUrlMedia({ sessionId }) {
  const [to, setTo] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!to || !fileUrl) return;
    setLoading(true); setRes(null);
    const r = await apiFetch("POST", `/api/sessions/${sessionId}/send`, { to, file: fileUrl, caption });
    setRes(r); setLoading(false);
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">إرسال وسائط من رابط</div>
        <div className="page-desc">Send Message with URL Media — POST /api/sessions/{"{sessionId}"}/send</div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="field">
            <div className="field-label">TO — رقم المستقبل</div>
            <input className="input" placeholder="201234567890" value={to} onChange={e => setTo(e.target.value)} />
          </div>
          <div className="field">
            <div className="field-label">FILE URL — رابط الملف</div>
            <input className="input" placeholder="https://example.com/image.png" value={fileUrl} onChange={e => setFileUrl(e.target.value)} />
          </div>
          <div className="field">
            <div className="field-label">CAPTION — تعليق (اختياري)</div>
            <input className="input" placeholder="وصف الوسيط..." value={caption} onChange={e => setCaption(e.target.value)} />
          </div>
          <button className="btn-send" onClick={send} disabled={loading || !to || !fileUrl}>
            {loading ? <span className="spin">⟳</span> : "🔗"} إرسال
          </button>
          {loading && <LoadingRes />}
          {res && !loading && <ResponseBox res={res} />}
        </div>
      </div>
    </div>
  );
}

// Send Multiple
function PageSendMultiple({ sessionId }) {
  const [numbers, setNumbers] = useState("");
  const [message, setMessage] = useState("");
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!numbers || !message) return;
    setLoading(true); setRes(null);
    const r = await apiFetch("POST", `/api/sessions/${sessionId}/send`, { to: numbers, message });
    setRes(r); setLoading(false);
  }

  const count = numbers.split(",").filter(n => n.trim()).length;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">إرسال جماعي</div>
        <div className="page-desc">Send to Multiple Recipients — POST /api/sessions/{"{sessionId}"}/send</div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="field">
            <div className="field-label">
              RECIPIENTS — الأرقام {count > 0 && <span style={{ color: "var(--green)" }}>({count} رقم)</span>}
            </div>
            <textarea
              className="textarea"
              placeholder={"201234567890,201234567891,201234567892"}
              value={numbers}
              onChange={e => setNumbers(e.target.value)}
              style={{ minHeight: 60 }}
            />
            <p style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "var(--mono)", marginTop: 4 }}>
              افصل الأرقام بفاصلة (,)
            </p>
          </div>
          <div className="field">
            <div className="field-label">MESSAGE — نص الرسالة</div>
            <textarea
              className="textarea"
              placeholder="اكتب رسالتك هنا..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>
          <button className="btn-send" onClick={send} disabled={loading || !numbers || !message}>
            {loading ? <span className="spin">⟳</span> : "📡"} إرسال للكل
          </button>
          {loading && <LoadingRes />}
          {res && !loading && <ResponseBox res={res} />}
        </div>
      </div>
    </div>
  );
}

// ── NAV CONFIG ─────────────────────────────────────────────────────────────────
const nav = [
  { id: "sessions-list",   icon: "📋", label: "كل الجلسات",          section: "SESSIONS" },
  { id: "session-start",   icon: "🔌", label: "بدء جلسة / QR",       section: "SESSIONS" },
  { id: "session-status",  icon: "🔍", label: "حالة الجلسة",          section: "SESSIONS" },
  { id: "session-delete",  icon: "🗑", label: "حذف الجلسة",           section: "SESSIONS" },
  { id: "send-text",       icon: "💬", label: "رسالة نصية",           section: "MESSAGING" },
  { id: "send-file",       icon: "📎", label: "إرسال ملف",            section: "MESSAGING" },
  { id: "send-url",        icon: "🔗", label: "وسائط من رابط",        section: "MESSAGING" },
  { id: "send-multiple",   icon: "📡", label: "إرسال جماعي",          section: "MESSAGING" },
];

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("sessions-list");
  const [sessionId, setSessionId] = useState("session1");

  const renderPage = () => {
    switch (page) {
      case "sessions-list":  return <PageSessions sessionId={sessionId} />;
      case "session-start":  return <PageStartSession sessionId={sessionId} />;
      case "session-status": return <PageSessionStatus sessionId={sessionId} />;
      case "session-delete": return <PageDeleteSession sessionId={sessionId} />;
      case "send-text":      return <PageSendText sessionId={sessionId} />;
      case "send-file":      return <PageSendFileUpload sessionId={sessionId} />;
      case "send-url":       return <PageSendUrlMedia sessionId={sessionId} />;
      case "send-multiple":  return <PageSendMultiple sessionId={sessionId} />;
      default:               return null;
    }
  };

  const sections = ["SESSIONS", "MESSAGING"];

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-mark">
              <div className="logo-icon">📱</div>
              <div>
                <div className="logo-text">WhatsApp API</div>
                <div className="logo-sub">DASHBOARD</div>
              </div>
            </div>
          </div>

          {sections.map(sec => (
            <div className="nav-section" key={sec}>
              <div className="nav-label">{sec}</div>
              {nav.filter(n => n.section === sec).map(n => (
                <button
                  key={n.id}
                  className={`nav-item ${page === n.id ? "active" : ""}`}
                  onClick={() => setPage(n.id)}
                >
                  <span className="nav-icon">{n.icon}</span>
                  {n.label}
                </button>
              ))}
            </div>
          ))}

          <div className="session-bar">
            <div className="session-label">SESSION ID</div>
            <input
              className="session-input"
              value={sessionId}
              onChange={e => setSessionId(e.target.value)}
              placeholder="session1"
            />
          </div>
        </aside>

        {/* Main */}
        <main className="main">{renderPage()}</main>
      </div>
    </>
  );
}