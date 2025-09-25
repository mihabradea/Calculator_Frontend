import { useEffect, useMemo, useState } from "react";

// Custom simple modal
function Modal({ open, onClose, onConfirm, children }) {
  if (!open) return null;
  return (
    <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.35)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#181c2b',padding:24,borderRadius:12,minWidth:320,boxShadow:'0 4px 32px #000'}}>
        <div style={{marginBottom:18}}>{children}</div>
        <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
          <button className="btn" onClick={onClose}>No</button>
          <button className="btn neon" onClick={onConfirm}>Yes</button>
        </div>
      </div>
    </div>
  );
}


export default function CalculatorCard() {
  const [mode, setMode] = useState("RAD");
  const [expr, setExpr] = useState("sin(pi/6) + sqrt(2)^3");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => { setBackendMode(mode) }, [mode]);

  async function setBackendMode(m) {
    setError("");
    try { await fetch(`${import.meta.env.VITE_API_BASE}/api/calc/mode/${m.toLowerCase()}`, { method: "POST" }) }
    catch (e) { setError(e.message) }
  }
  async function evaluate() {
    setError(""); setResult(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/calc/eval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expression: expr })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data));
      setResult(data.result);
      setHistory(h => [{ expr, result: data.result, at: new Date().toLocaleTimeString() }, ...h].slice(0, 12));
    } catch (e) { setError(e.message) }
  }

  const buttons = useMemo(() => [
    "sin()", "cos()", "tan()", "asin()", "acos()", "atan()", "cot()", "sec()", "csc()", "sqrt()", "abs()", "log()", "log10()", "(", ")", "^", "pi", "e", "tau", "+", "-", "*", "/", "mod()", "round()", "floor()", "ceil()"
  ], []);

  return (
  <div className="card" style={{ flex: "1 1 520px", minWidth: 420, maxWidth: 520, minHeight: 820 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Calculator</h2>
        <div className="row">
          <label className="btn"><input type="radio" name="m" checked={mode === "RAD"} onChange={() => setMode("RAD")} /> RAD</label>
          <label className="btn"><input type="radio" name="m" checked={mode === "DEG"} onChange={() => setMode("DEG")} /> DEG</label>
        </div>
      </div>

      <input
        className="display"
        style={{ marginTop: 10, width: "100%", fontSize: "1.1em", padding: "14px", background: "#0a111d", color: "#fff", border: "1px solid rgba(255,255,255,.08)", borderRadius: "12px" }}
        type="text"
        value={expr}
        onChange={e => { setExpr(e.target.value); setResult(null); setError(""); }}
        placeholder="type or click buttons…"
        autoFocus
      />
      <div className="row" style={{ marginTop: 8 }}>
        <button className="btn neon" onClick={evaluate}>Evaluate</button>
        <button className="btn" onClick={() => { setExpr(""); setResult(null) }}>Clear</button>
      </div>


      <div className="grid" style={{ marginTop: 10 }}>
        {buttons.map(b => (
          <button key={b} className="btn"
            onClick={() => setExpr(x => x + b)}
            onMouseEnter={e => e.currentTarget.classList.add("neon")}
            onMouseLeave={e => e.currentTarget.classList.remove("neon")}
          >{b}</button>
        ))}
      </div>

      {/* Number pad for mouse input (3x4 grid) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 8,
        marginTop: 10,
        maxWidth: 180
      }}>
        {[7,8,9,4,5,6,1,2,3,'.',0,'⌫'].map((n, i) => {
          if (n === 0) {
            return (
              <button key={n+''+i} className="btn"
                onClick={() => setExpr(x => x + n)}
                style={{ fontWeight: 600, fontSize: '1.15em', gridColumn: '2 / 3' }}
              >{n}</button>
            );
          } else if (n === '⌫') {
            return (
              <button key={n+''+i} className="btn"
                onClick={() => setExpr(x => x.slice(0, -1))}
                style={{ fontWeight: 600, fontSize: '1.15em', gridColumn: '3 / 4', color: '#ff4d6d' }}
                aria-label="Backspace"
              >⌫</button>
            );
          } else {
            return (
              <button key={n+''+i} className="btn"
                onClick={() => setExpr(x => x + n)}
                style={{ fontWeight: 600, fontSize: '1.15em' }}
              >{n}</button>
            );
          }
        })}
      </div>

      {result !== null && (
        <>
          <p style={{ marginTop: 12 }}>
            Result: <b className="ok">{result}</b>
            <span style={{ marginLeft: 8, color: '#7fd0ff', fontSize: '0.95em' }}>({mode === "RAD" ? "rad" : "°"})</span>
          </p>

        </>
      )}
      <button className="btn" style={{ marginTop: 10, float: 'right' }} onClick={() => setShowHistory(v => !v)}>
        {showHistory ? "Close History" : "Show History"}
      </button>
      {error && <p className="err" style={{ marginTop: 8 }}>Error: {error}</p>}

      {showHistory && !!history.length && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: '320px',
          background: 'rgba(18,24,36,0.98)',
          boxShadow: '-2px 0 18px 0 rgba(0,0,0,0.25)',
          zIndex: 1000,
          padding: '32px 18px 18px 18px',
          overflowY: 'auto',
          transition: 'transform 0.2s',
        }}>
          <h3 style={{ marginTop: 0, marginBottom: 18, textAlign: 'center' }}>History</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {history.map((h, i) => (
              <li key={i} className="row" style={{ justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,.06)", padding: "6px 0" }}>
                <code style={{ cursor: "pointer" }} onClick={() => setExpr(h.expr)}>{h.expr}</code>
                <span className="small">{h.result} ({mode === "RAD" ? "rad" : "°"}) • {h.at}</span>
              </li>
            ))}
          </ul>
          <button className="btn" style={{ marginTop: 18, width: '100%' }} onClick={() => setShowHistory(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
