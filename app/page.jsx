"use client";

import React, { useEffect, useMemo, useRef, useState, createContext, useContext } from "react";

function useMotion() {
  const [motion, setMotion] = useState(undefined);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mod = await import("framer-motion");
        if (mounted) setMotion(mod.motion);
      } catch (_) {
        if (mounted) setMotion(null);
      }
    })();
    return () => { mounted = false; };
  }, []);
  return motion;
}


const Card = ({ className = "", children }) => (
  <div className={`rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg shadow-slate-900/40 ${className}`}>{children}</div>
);
const CardContent = ({ className = "", children }) => <div className={className}>{children}</div>;
const Button = ({ className = "", variant, children, ...rest }) => (
  <button className={`${variant === "secondary" ? "bg-slate-800 text-slate-100" : "bg-cyan-500/90 text-slate-900"} rounded-xl px-4 py-2 border border-slate-700 hover:brightness-110 transition ${className}`} {...rest}>{children}</button>
);
const Input = ({ className = "", ...rest }) => (
  <input className={`rounded-xl px-3 py-2 border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${className}`} {...rest} />
);
const Textarea = ({ className = "", ...rest }) => (
  <textarea className={`rounded-xl px-3 py-2 border border-slate-800 bg-slate-950 text-slate-100 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${className}`} {...rest} />
);
const Slider = ({ value, min, max, step = 1, onValueChange, className = "" }) => (
  <input type="range" min={min} max={max} step={step} value={value[0]} onChange={(e)=>onValueChange([Number(e.target.value)])} className={`w-full h-2 accent-cyan-400 bg-slate-800 rounded-lg ${className}`} />
);
const Badge = ({ className = "", children }) => (
  <span className={`inline-flex items-center text-[10px] uppercase tracking-wide font-semibold px-2 py-1 rounded-lg bg-slate-800/90 border border-slate-700 ${className}`}>{children}</span>
);
const Progress = ({ value, className="" }) => (
  <div className={`w-full h-2 bg-slate-800 rounded ${className}`}><div style={{ width: `${Math.max(0, Math.min(100, value))}%` }} className="h-full bg-cyan-400 rounded"></div></div>
);


const TabsCtx = createContext(null);
const Tabs = ({ defaultValue, className="", children }) => { const [v, setV] = useState(defaultValue); return <div className={className}><TabsCtx.Provider value={{ value: v, set: setV }}>{children}</TabsCtx.Provider></div>; };
const TabsList = ({ className="", children }) => <div className={`inline-grid gap-2 ${className}`}>{children}</div>;
const TabsTrigger = ({ value, children }) => { const ctx = useContext(TabsCtx); const active = ctx.value === value; return <Button onClick={()=>ctx.set(value)} variant={active?undefined:"secondary"} className={`${active?"": "opacity-80"}`}>{children}</Button>; };
const TabsContent = ({ value, className="", children }) => { const ctx = useContext(TabsCtx); return ctx.value === value ? <div className={className}>{children}</div> : null };

// Select mapped to native select
const SelectCtx = createContext(null);
const Select = ({ value, onValueChange, children }) => { const optionsRef = useRef([]); optionsRef.current = []; return <SelectCtx.Provider value={{ value, onChange: onValueChange, optionsRef }}>{children}</SelectCtx.Provider>; };
const SelectTrigger = ({ className="" }) => { const ctx = useContext(SelectCtx); return (<select className={`rounded-xl px-3 py-2 border border-slate-800 bg-slate-950 text-slate-100 w-full ${className}`} value={ctx.value} onChange={(e)=>ctx.onChange(e.target.value)}>{ctx.optionsRef.current.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select>); };
const SelectContent = ({ children }) => (<>{children}</>);
const SelectItem = ({ value, children }) => { const ctx = useContext(SelectCtx); useEffect(()=>{ ctx.optionsRef.current.push({ value, label: children }); }, [value, children]); return null; };


const Icon = {
  Brain: (props)=>(<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M7 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm10 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/><path d="M4 10v4a4 4 0 0 0 4 4h1v-8H7a3 3 0 0 0-3 3Zm16 0v4a4 4 0 0 1-4 4h-1v-8h2a3 3 0 0 1 3 3Z"/></svg>),
  Upload: (props)=>(<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5-5 5 5"/><path d="M12 15V5"/></svg>),
  Play: (props)=>(<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}><path d="M8 5v14l11-7z"/></svg>),
  Loader: (props)=>(<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" className={`animate-spin ${props.className||""}`}><circle cx="12" cy="12" r="10" opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>),
  Check: (props)=>(<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M20 6L9 17l-5-5"/></svg>),
  Link: (props)=>(<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L10 5"/><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L14 19"/></svg>),
  Beaker: (props)=>(<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M6 2h12"/><path d="M14 2v6l5 9a2 2 0 0 1-2 3H7a2 2 0 0 1-2-3l5-9V2"/></svg>),
  Sun: (p)=>(<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.536 6.364-1.414-1.414M6.879 6.879 5.464 5.464m12.728 0-1.415 1.415M6.879 17.121l-1.415 1.415"/></svg>),
  Moon: (p)=>(<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>),
};

const SimpleChart = ({ data }) => {
  const W = 800, H = 240, P = 30;
  if (!data || data.length === 0) return <div className="h-64" />;
  const xs = data.map(d => d.step);
  const ysLoss = data.map(d => d.loss);
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  const yMin = Math.min(...ysLoss), yMax = Math.max(...ysLoss);
  const x = (v)=> P + ((v - xMin) / (xMax - xMin || 1)) * (W - 2*P);
  const yLoss = (v)=> H - P - ((v - yMin) / (yMax - yMin || 1)) * (H - 2*P);
  const yAcc = (v)=> H - P - (Math.max(0, Math.min(1, v)) * (H - 2*P));
  const toPath = (pts)=> pts.map((p,i)=>`${i?"L":"M"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const lossPath = toPath(data.map(d=>({ x: x(d.step), y: yLoss(d.loss) })));
  const accPath  = toPath(data.map(d=>({ x: x(d.step), y: yAcc(d.acc ?? 0) })));
  return (
    <div className="h-64">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
        <rect x={0} y={0} width={W} height={H} fill="none" />
        {/* axes */}
        <line x1={P} y1={H-P} x2={W-P} y2={H-P} stroke="currentColor" opacity="0.3"/>
        <line x1={P} y1={P} x2={P} y2={H-P} stroke="currentColor" opacity="0.3"/>
        {/* series */}
        <path d={lossPath} fill="none" stroke="currentColor" strokeWidth={2} />
        <path d={accPath}  fill="none" stroke="currentColor" strokeWidth={2} opacity={0.7} />
        <text x={P} y={P-8} fontSize={10} fill="currentColor" opacity={0.6}>loss</text>
        <text x={W-P-20} y={P-8} fontSize={10} fill="currentColor" opacity={0.6}>acc</text>
      </svg>
    </div>
  );
};


function resolveApiBase() {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const meta = document.querySelector('meta[name="api-base"]');
    if (meta && meta.content) return meta.content.trim();
    const winAny = window;
    if (winAny.__API_BASE__) return String(winAny.__API_BASE__);
    const { protocol, hostname, port } = window.location;
    if (port === "3000") return `${protocol}//${hostname}:8080`;
  }
  // Explicit separate-domain default
  return "https://api.yourdomain.com";
}

const demoSeries = Array.from({ length: 5 }, (_, i) => ({
  step: i + 1,
  loss: 1 / (i + 1) + Math.random() * 0.05,
  acc: Math.min(0.1 + i * 0.1, 0.99),
}));

function extractPrediction(data) {
  try {
    if (data && typeof data === "object" && "label" in data) return String(data.label);
    if (typeof data === "string") return data;
    return JSON.stringify(data);
  } catch {
    return "unknown";
  }
}

// =====================
// Main Component (JS)
// =====================
export default function NeuralNetStudio() {
  const apiBase = useMemo(resolveApiBase, []);

  const [model, setModel] = useState("mlp");
  const [batch, setBatch] = useState(32);
  const [epochs, setEpochs] = useState(5);
  const [lr, setLr] = useState(0.01);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [series, setSeries] = useState(demoSeries);
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = useState("—");

  // Streaming config
  const [ssePath, setSsePath] = useState("/train/stream");
  const [wsPath, setWsPath] = useState("/train/ws");
  const streamRef = useRef(null);

  // Auto-reconnect state
  const [autoReconnect, setAutoReconnect] = useState(true);
  const retryRef = useRef(0);
  const reconnectTimerRef = useRef(null);

  // --- Smoke tests (existing + added) ---
  const [testOutput, setTestOutput] = useState("");
  const tests = useMemo(() => [
    { name: "Resolve API base", run: async () => `Resolved apiBase = ${apiBase}` },
    {
      name: "GET /health",
      run: async () => {
        const r = await fetch(`${apiBase}/health`, { method: "GET" });
        const txt = await r.text().catch(() => "(no body)");
        return `status=${r.status} body=${txt.slice(0, 200)}`;
      },
    },
    {
      name: "POST /train (dry-call)",
      run: async () => {
        const r = await fetch(`${apiBase}/train`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: "mlp", batch: 8, epochs: 1, lr: 0.01 }),
        });
        const txt = await r.text().catch(() => "(no body)");
        return `status=${r.status} body=${txt.slice(0, 200)}`;
      },
    },
    { name: "Build SSE URL", run: async () => `${apiBase}${ssePath}` },
    { name: "Build WebSocket URL", run: async () => apiBase.replace(/^http:/i, "ws:").replace(/^https:/i, "wss:") + wsPath },
    { name: "Parse sample predict payload (with label)", run: async () => `extractPrediction => ${extractPrediction({ label: 7, score: 0.98 })}` },
    { name: "Parse sample predict payload (no label)", run: async () => `extractPrediction => ${extractPrediction({ value: 3, confidence: 0.77 })}` },
    { name: "Preview backoff (1,2,4,8s)", run: async () => [0,1,2,3].map(n => 1000 * 2**n).join(", ") },
  ], [apiBase, ssePath, wsPath]);

  // Draw pad helpers
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    ctx.fillStyle = "white"; ctx.fillRect(0, 0, c.width, c.height);
    let drawing = false; let last = null;
    const scale = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const start = (e) => { drawing = true; last = { x: e.offsetX * scale, y: e.offsetY * scale }; };
    const move = (e) => {
      if (!drawing || !last || !ctx) return;
      ctx.strokeStyle = "black"; ctx.lineWidth = 20; ctx.lineCap = "round"; ctx.beginPath();
      ctx.moveTo(last.x, last.y); ctx.lineTo(e.offsetX * scale, e.offsetY * scale); ctx.stroke();
      last = { x: e.offsetX * scale, y: e.offsetY * scale };
    };
    const end = () => { drawing = false; last = null; };
    c.addEventListener("pointerdown", start);
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerup", end);
    c.addEventListener("pointerleave", end);
    return () => {
      c.removeEventListener("pointerdown", start);
      c.removeEventListener("pointermove", move);
      c.removeEventListener("pointerup", end);
      c.removeEventListener("pointerleave", end);
    };
  }, []);

  const clearCanvas = () => {
    const c = canvasRef.current; if (!c) return; const ctx = c.getContext("2d"); if (!ctx) return;
    ctx.fillStyle = "white"; ctx.fillRect(0, 0, c.width, c.height);
  };

  const postJSON = async (path, body) => {
    const r = await fetch(`${apiBase}${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  };

  // Auto-reconnect helpers
  const clearReconnectTimer = () => {
    if (reconnectTimerRef.current != null) {
      window.clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  };
  const computeDelay = (attempt) => {
    const base = 1000 * Math.pow(2, attempt); // 1s,2s,4s,...
    const jitter = Math.floor(Math.random() * 250); // up to +250ms
    return Math.min(base + jitter, 10000); // cap at 10s
  };
  const scheduleReconnect = (kind) => {
    if (!autoReconnect) return;
    const attempt = retryRef.current;
    const delay = computeDelay(attempt);
    setStatus(`${kind.toUpperCase()} reconnect in ${Math.round(delay)}ms (attempt ${attempt + 1})`);
    reconnectTimerRef.current = window.setTimeout(() => {
      if (!autoReconnect) return;
      if (kind === "sse") subscribeSSE(); else subscribeWS();
    }, delay);
    retryRef.current = Math.min(attempt + 1, 20);
  };

  // Streaming subscribe functions
  const closeStream = () => {
    clearReconnectTimer();
    if (streamRef.current && streamRef.current.close) streamRef.current.close();
    streamRef.current = null;
    retryRef.current = 0;
    setStatus("Stream stopped");
  };

  const applyMetric = (m) => {
    const step = typeof m.step === "number" ? m.step : (m.epoch ?? series.length + 1);
    const loss = typeof m.loss === "number" ? m.loss : undefined;
    const acc = typeof m.acc === "number" ? m.acc : (typeof m.accuracy === "number" ? m.accuracy : undefined);
    if (loss == null && acc == null) return; // ignore empty
    setSeries((s) => s.concat({ step, loss: loss ?? (s[s.length - 1]?.loss ?? 1), acc: acc ?? (s[s.length - 1]?.acc ?? 0) }));
  };

  const subscribeSSE = () => {
    clearReconnectTimer();
    const url = `${apiBase}${ssePath}`;
    const es = new EventSource(url);
    streamRef.current = es;
    setStatus(`SSE connected: ${url}`);
    retryRef.current = 0; // reset on success
    es.onmessage = (ev) => {
      try { const data = JSON.parse(ev.data); applyMetric(data); }
      catch { /* ignore */ }
    };
    es.onerror = () => {
      setStatus("SSE error; closing");
      es.close();
      streamRef.current = null;
      scheduleReconnect("sse");
    };
  };

  const subscribeWS = () => {
    clearReconnectTimer();
    const wsUrl = apiBase.replace(/^http:/i, "ws:").replace(/^https:/i, "wss:") + wsPath;
    const ws = new WebSocket(wsUrl);
    streamRef.current = ws;
    setStatus(`WS connecting: ${wsUrl}`);
    ws.onopen = () => { setStatus(`WS connected: ${wsUrl}`); retryRef.current = 0; };
    ws.onmessage = (ev) => {
      try { const data = JSON.parse(ev.data); applyMetric(data); }
      catch { /* ignore */ }
    };
    ws.onerror = () => setStatus("WS error");
    ws.onclose = () => { setStatus("WS closed"); streamRef.current = null; scheduleReconnect("ws"); };
  };

  const startTraining = async () => {
    closeStream();
    setSeries(demoSeries); // reset seed so users see movement
    setBusy(true); setStatus("Starting training...");
    try {
      try { await postJSON("/train/start", { model, batch, epochs, lr }); }
      catch {
        const r = await fetch(`${apiBase}/train`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model, batch, epochs, lr }) });
        if (!r.ok) throw new Error(await r.text());
      }
      try { subscribeSSE(); } catch { subscribeWS(); }
    } catch (err) { setStatus(`Error: ${err.message}`); }
    finally { setBusy(false); }
  };

  const predictCanvas = async () => {
    if (!canvasRef.current) return;
    const blob = await new Promise((res) => canvasRef.current.toBlob((b) => res(b), "image/png"));
    const fd = new FormData(); fd.append("file", blob, "digit.png");
    setBusy(true); setStatus("Predicting...");
    try {
      const r = await fetch(`${apiBase}/predict`, { method: "POST", body: fd });
      if (!r.ok) throw new Error(await r.text());
      const data = await r.json();
      setPrediction(extractPrediction(data));
      setStatus("Prediction complete");
    } catch (err) { setStatus(`Error: ${err.message}`); }
    finally { setBusy(false); }
  };

  const runTests = async () => {
    setTestOutput("");
    for (const t of tests) {
      setTestOutput((p) => p + `\n[RUN] ${t.name}`);
      try { const out = await t.run(); setTestOutput((p) => p + `\n[OK ] ${out}`); }
      catch (e) { setTestOutput((p) => p + `\n[ERR] ${e?.message || e}`); }
    }
  };

  useEffect(() => () => closeStream(), []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="max-w-6xl mx-auto px-4 py-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-slate-800/80 backdrop-blur border border-slate-700"><Icon.Brain className="w-6 h-6" /></div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Neural Net Studio</h1>
            <p className="text-sm text-slate-400">Train, stream metrics, and test your CNN models</p>
          </div>
        </div>
        <Badge className="bg-slate-800 border border-slate-700 flex items-center gap-2"><Icon.Link className="w-3 h-3"/>API: {apiBase}</Badge>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16">
        <Tabs defaultValue="train" className="">
          <TabsList className="grid grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="train">Training</TabsTrigger>
            <TabsTrigger value="inference">Inference</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="train" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6 space-y-5">
                  <div>
                    <h2 className="text-lg font-semibold">Hyperparameters</h2>
                    <p className="text-slate-400 text-sm">Launch training and stream metrics via SSE (fallback WS).</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-sm text-slate-300">Model</label>
                      <Select value={model} onValueChange={setModel}>
                        <SelectTrigger className="bg-slate-950 border-slate-800" />
                        <SelectContent>
                          <SelectItem value="mlp">Dense (MLP)</SelectItem>
                          <SelectItem value="cnn">CNN</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm text-slate-300">Batch size: {batch}</label>
                      <Slider value={[batch]} min={8} max={256} step={8} onValueChange={(v) => setBatch(v[0])} />
                    </div>
                    <div>
                      <label className="text-sm text-slate-300">Epochs: {epochs}</label>
                      <Slider value={[epochs]} min={1} max={200} step={1} onValueChange={(v) => setEpochs(v[0])} />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm text-slate-300">Learning rate: {lr}</label>
                      <Slider value={[lr]} min={0.0001} max={0.1} step={0.0001} onValueChange={(v) => setLr(Number(v[0].toFixed(4)))} />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm text-slate-300">Streaming endpoints</label>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Input value={ssePath} onChange={(e)=>setSsePath(e.target.value)} className="bg-slate-950 border-slate-800" placeholder="/train/stream (SSE)" />
                      <Input value={wsPath} onChange={(e)=>setWsPath(e.target.value)} className="bg-slate-950 border-slate-800" placeholder="/train/ws (WebSocket)" />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <input id="auto-reconnect" type="checkbox" className="accent-white" checked={autoReconnect} onChange={(e)=>{ setAutoReconnect(e.target.checked); if(!e.target.checked) clearReconnectTimer(); }} />
                      <label htmlFor="auto-reconnect" className="text-sm text-slate-300">Auto‑reconnect</label>
                    </div>
                    <div className="text-xs text-slate-500">UI tries <b>SSE</b> first at <code>{apiBase}{ssePath}</code>, then falls back to <b>WebSocket</b> at <code>{apiBase.replace(/^http:/i,'ws:').replace(/^https:/i,'wss:')}{wsPath}</code>. Auto‑reconnect uses exponential backoff with jitter (1s → 2s → 4s …, max 10s).</div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <Button onClick={startTraining} disabled={busy} className="gap-2"><Icon.Play className="w-4 h-4" />{busy ? "Working..." : "Start training (SSE/WS)"}</Button>
                    <Button variant="secondary" onClick={closeStream}>Stop stream</Button>
                    {busy && <Icon.Loader className="w-5 h-5" />}
                    <span className="text-slate-400 text-sm">{status}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2"><Icon.Beaker className="w-5 h-5" /><h2 className="text-lg font-semibold">Training metrics (live)</h2></div>
                  <SimpleChart data={series} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inference" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold">Draw a digit</h2>
                  <p className="text-slate-400 text-sm">
                    Draw and send to <code>/predict</code>. Your Spring API should accept multipart form-data under key <code>file</code> and return JSON <code>{'{'} label, score {'}'}</code>.
                  </p>
                  <div className="p-3 rounded-2xl bg-white shadow-inner">
                    <canvas ref={canvasRef} width={300} height={300} className="w-full rounded-xl border" />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={predictCanvas} disabled={busy} className="gap-2"><Icon.Upload className="w-4 h-4" />Predict</Button>
                    <Button onClick={clearCanvas} variant="secondary">Clear</Button>
                  </div>
                  <div className="text-sm text-slate-400">Prediction: <span className="text-slate-100 font-semibold">{prediction}</span></div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold">Upload an image</h2>
                  <p className="text-slate-400 text-sm">PNG/JPG will be resized to 28×28 in your backend before inference.</p>
                  <div className="flex gap-3 items-center">
                    <Input type="file" accept="image/*" className="bg-slate-950 border-slate-800" onChange={async (e) => {
                      const f = e.target.files?.[0]; if (!f) return; const fd = new FormData(); fd.append("file", f);
                      setBusy(true); setStatus("Predicting...");
                      try { const r = await fetch(`${apiBase}/predict`, { method: "POST", body: fd }); if (!r.ok) throw new Error(await r.text()); const data = await r.json(); setPrediction(extractPrediction(data)); setStatus("Prediction complete"); }
                      catch (err) { setStatus(`Error: ${err.message}`) } finally { setBusy(false); }
                    }} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="mt-6">
            <Card>
              <CardContent className="p-6 space-y-3">
                <h2 className="text-lg font-semibold">System</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-slate-400 text-sm">Model</div>
                    <div className="font-medium">{model.toUpperCase()}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Epochs</div>
                    <div className="font-medium">{epochs}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Learning rate</div>
                    <div className="font-medium">{lr}</div>
                  </div>
                </div>
                <div className="text-slate-400 text-sm">{status || "Idle"}</div>
                <Progress value={busy ? 66 : (status === "Done" ? 100 : 0)} className="h-2" />
                <Textarea placeholder="Console output (SSE/WS status & logs)" className="min-h-40" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests" className="mt-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">Smoke tests</h2>
                <p className="text-slate-400 text-sm">These simple tests help verify endpoints and client parsing without changing your backend.</p>
                <div className="flex gap-3 flex-wrap">
                  {tests.map((t) => (
                    <Button key={t.name} variant="secondary" onClick={async () => {
                      setTestOutput((p) => p + `\n\n=== ${t.name} ===`);
                      try { const out = await t.run(); setTestOutput((p) => p + `\n${out}`); }
                      catch (e) { setTestOutput((p) => p + `\nERROR: ${e?.message || e}`); }
                    }}>{t.name}</Button>
                  ))}
                  <Button onClick={runTests} className="gap-2"><span className="inline-flex items-center gap-1"><Icon.Beaker className="w-4 h-4"/>Run all</span></Button>
                </div>
                <Textarea value={testOutput} onChange={()=>{}} className="min-h-48 font-mono text-xs" />
                <div className="text-xs text-slate-500">Tip: Set <code>window.__API_BASE__</code> or add <code>&lt;meta name="api-base" content="https://api.yourdomain.com" /&gt;</code> to override.</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="mt-10 text-center text-slate-500 text-xs">Frontend calls a separate API domain. Dev: Next.js :3000, Spring Boot :8080. Metrics stream via <b>SSE</b> (fallback <b>WebSocket</b>) with auto‑reconnect.</footer>
        <style jsx global>{`
        :root{
          --bg-0:#0b1220;--bg-1:#0f172a;--bg-2:#0b1324;--card:#0f172a;--muted:#94a3b8;--text:#e5e7eb;--accent:#38bdf8;--border:#1f2937;
          --radius:16px;--shadow:0 10px 25px rgba(0,0,0,.35);
        }
        html,body{background:linear-gradient(180deg,var(--bg-0),var(--bg-1));color:var(--text);font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";}
        h1{font-size:28px;margin:0}
        h2{font-size:18px;margin:0}
        header{align-items:center}
        .rounded-2xl{border-radius:var(--radius)}
        .border{border:1px solid var(--border)}
        .bg-slate-900\/60{background:rgba(15,23,42,.6)}
        .bg-slate-800{background:#1f2937}
        .bg-slate-950{background:#0b1220}
        .text-slate-100{color:#f1f5f9}
        .text-slate-400{color:#94a3b8}
        .text-slate-500{color:#94a3b8}
        .p-6{padding:24px}
        .p-3{padding:12px}
        .px-3{padding-left:12px;padding-right:12px}
        .py-2{padding-top:8px;padding-bottom:8px}
        .gap-2{gap:8px}
        .gap-3{gap:12px}
        .gap-1{gap:4px}
        .grid{display:grid}
        .inline-grid{display:inline-grid}
        .grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}
        .md\:grid-cols-2{grid-template-columns:1fr}
        @media(min-width:768px){.md\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}}
        .space-y-5>*+*{margin-top:20px}
        .space-y-4>*+*{margin-top:16px}
        .w-full{width:100%}
        .h-64{height:16rem}
        .min-h-40{min-height:10rem}
        .min-h-screen{min-height:100vh}
        .mx-auto{margin-left:auto;margin-right:auto}
        .px-4{padding-left:16px;padding-right:16px}
        .py-10{padding-top:40px;padding-bottom:40px}
        .rounded-xl{border-radius:12px}
        .rounded{border-radius:8px}
        .border-slate-800{border-color:#1f2937}
        .border-slate-700{border-color:#334155}
        .shadow{box-shadow:var(--shadow)}
        .backdrop-blur{backdrop-filter:saturate(140%) blur(8px)}
        button{cursor:pointer}
        button.bg-white{background:#e2e8f0;color:#0b1220}
        button.bg-white:hover{filter:brightness(1.05)}
        button.bg-slate-800{background:#1f2937}
        button.bg-slate-800:hover{filter:brightness(1.1)}
        input[type="file"],input[type="text"],input[type="range"],select,textarea{
          color:var(--text);background:var(--bg-2);border:1px solid var(--border);
          border-radius:12px;padding:8px 12px;outline:none
        }
        input[type="range"]{padding:0;height:6px}
        code{background:rgba(148,163,184,.1);padding:2px 6px;border-radius:8px}
        canvas{background:#fff;border-radius:12px}
      `}</style>
      </main>
    </div>
  );
}
