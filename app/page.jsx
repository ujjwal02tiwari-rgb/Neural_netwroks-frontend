"use client";

import { motion } from "framer-motion";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";

/* ======================
   Animation Variants
   ====================== */
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};
const scaleIn = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 15 },
  },
};

/* ======================
   UI Components
   ====================== */
const Card = ({ className = "", children }) => (
  <div
    className={`rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg shadow-slate-900/40 ${className}`}
  >
    {children}
  </div>
);
const CardContent = ({ className = "", children }) => (
  <div className={className}>{children}</div>
);
const Button = ({ className = "", variant, children, ...rest }) => (
  <button
    className={`${
      variant === "secondary"
        ? "bg-slate-800 text-slate-100"
        : "bg-cyan-500/90 text-slate-900"
    } rounded-xl px-4 py-2 border border-slate-700 hover:brightness-110 transition ${className}`}
    {...rest}
  >
    {children}
  </button>
);
const Input = ({ className = "", ...rest }) => (
  <input
    className={`rounded-xl px-3 py-2 border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${className}`}
    {...rest}
  />
);
const Textarea = ({ className = "", ...rest }) => (
  <textarea
    className={`rounded-xl px-3 py-2 border border-slate-800 bg-slate-950 text-slate-100 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${className}`}
    {...rest}
  />
);
const Slider = ({ value, min, max, step = 1, onValueChange, className = "" }) => (
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={value[0]}
    onChange={(e) => onValueChange([Number(e.target.value)])}
    className={`w-full h-2 accent-cyan-400 bg-slate-800 rounded-lg ${className}`}
  />
);
const Badge = ({ className = "", children }) => (
  <span
    className={`inline-flex items-center text-[10px] uppercase tracking-wide font-semibold px-2 py-1 rounded-lg bg-slate-800/90 border border-slate-700 ${className}`}
  >
    {children}
  </span>
);
const Progress = ({ value, className = "" }) => (
  <div className={`w-full h-2 bg-slate-800 rounded ${className}`}>
    <div
      style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      className="h-full bg-cyan-400 rounded"
    ></div>
  </div>
);

/* ======================
   Tabs (Context API)
   ====================== */
const TabsCtx = createContext(null);
const Tabs = ({ defaultValue, className = "", children }) => {
  const [v, setV] = useState(defaultValue);
  return (
    <div className={className}>
      <TabsCtx.Provider value={{ value: v, set: setV }}>
        {children}
      </TabsCtx.Provider>
    </div>
  );
};
const TabsList = ({ className = "", children }) => (
  <div className={`inline-grid gap-2 ${className}`}>{children}</div>
);
const TabsTrigger = ({ value, children }) => {
  const ctx = useContext(TabsCtx);
  const active = ctx.value === value;
  return (
    <Button
      onClick={() => ctx.set(value)}
      variant={active ? undefined : "secondary"}
      className={`${active ? "" : "opacity-80"}`}
    >
      {children}
    </Button>
  );
};
const TabsContent = ({ value, className = "", children }) => {
  const ctx = useContext(TabsCtx);
  return ctx.value === value ? <div className={className}>{children}</div> : null;
};

/* ======================
   Icons
   ====================== */
const Icon = {
  Brain: (props) => (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path d="M7 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm10 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
      <path d="M4 10v4a4 4 0 0 0 4 4h1v-8H7a3 3 0 0 0-3 3Zm16 0v4a4 4 0 0 1-4 4h-1v-8h2a3 3 0 0 1 3 3Z" />
    </svg>
  ),
  Link: (props) => (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L10 5" />
      <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L14 19" />
    </svg>
  ),
};

/* ======================
   Helper
   ====================== */
function resolveApiBase() {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const meta = document.querySelector('meta[name="api-base"]');
    if (meta && meta.content) return meta.content.trim();
    const winAny = window;
    if (winAny.__API_BASE__) return String(winAny.__API_BASE__);
    const { protocol, hostname, port } = window.location;
    if (port === "3000") return `${protocol}//${hostname}:8080`;
  }
  return "https://api.yourdomain.com";
}

/* ======================
   Main Component
   ====================== */
export default function NeuralNetStudio() {
  const apiBase = useMemo(resolveApiBase, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Header */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="max-w-6xl mx-auto px-4 py-10 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <motion.div variants={scaleIn} initial="hidden" animate="visible">
            <div className="p-2 rounded-2xl bg-slate-800/80 backdrop-blur border border-slate-700">
              <Icon.Brain className="w-6 h-6" />
            </div>
          </motion.div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Neural Net Studio
            </h1>
            <p className="text-sm text-slate-400">
              Train, stream metrics, and test your CNN models
            </p>
          </div>
        </div>
        <Badge className="bg-slate-800 border border-slate-700 flex items-center gap-2">
          <Icon.Link className="w-3 h-3" />
          API: {apiBase}
        </Badge>
      </motion.header>

      <main className="max-w-6xl mx-auto px-4 pb-16">
        {/* Tabs */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mt-6"
        >
          <Tabs defaultValue="train">
            <TabsList className="grid grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="train">Training</TabsTrigger>
              <TabsTrigger value="inference">Inference</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="tests">Tests</TabsTrigger>
            </TabsList>

            {/* Training tab with animated cards */}
            <TabsContent value="train" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                >
                  <Card>
                    <CardContent className="p-6 space-y-5">
                      <h2 className="text-lg font-semibold">Hyperparameters</h2>
                      <p className="text-slate-400 text-sm">
                        Launch training and stream metrics via SSE.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                >
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <h2 className="text-lg font-semibold">Training metrics</h2>
                      <div className="h-40 flex items-center justify-center text-slate-500">
                        Chart goes here…
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        <footer className="mt-10 text-center text-slate-500 text-xs">
          Frontend calls a separate API domain. Dev: Next.js :3000, Spring Boot
          :8080. Metrics stream via <b>SSE</b> (fallback <b>WebSocket</b>) with
          auto-reconnect.
        </footer>
      </main>
    </div>
  );
}
