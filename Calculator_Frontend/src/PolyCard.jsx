import { useState, useEffect } from "react";
import PolyGraph from "./PolyGraph.jsx";

export default function PolyCard() {
  const [input, setInput] = useState("3x^3 - 2x + 5");
  const [parsed, setParsed] = useState(null);
  const [x, setX] = useState("1.5");
  const [y, setY] = useState(null);
  const [err, setErr] = useState("");
  const [xmin, setXmin] = useState(-10);
  const [xmax, setXmax] = useState(10);
  const [samples, setSamples] = useState(300);



  async function parsePoly(exprOverride) {
    setErr(""); setParsed(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/poly/parse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ poly: input })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data));
      setParsed(data);
    } catch (e) { setErr(e.message) }
  }
  async function evalAtX() {
    if (!parsed) return;
    setErr(""); setY(null);
    try {
      const body = { coeffs: [...parsed.coeffs].reverse(), x: Number(x) };
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/poly/eval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data));
      setY(data.y);
    } catch (e) { setErr(e.message) }
  }

  return (
    <div className="card" style={{ flex: "1 1 520px" }}>
      <h2 style={{ marginTop: 0 }}>Polynomials</h2>
  <textarea className="input" rows={8} style={{ minHeight: '56px' }} value={input} onChange={e => setInput(e.target.value)} />
      <div className="row" style={{ marginTop: 8 }}>
        <button className="btn neon" onClick={parsePoly}>Parse</button>
        <input className="input" style={{ maxWidth: 120 }} value={x} onChange={e => setX(e.target.value)} />
        <button className="btn" onClick={evalAtX}>Evaluate at x</button>
      </div>

      {/* Always show the graph grid, only draw the line after Parse */}
      <div style={{ marginTop: 10 }}>
        <div className="row" style={{ marginTop: 0 }}>
          <label className="small">xmin
            <input className="input" style={{ maxWidth: 100, marginLeft: 6 }}
              value={xmin} onChange={e => setXmin(Number(e.target.value) || 0)} />
          </label>
          <label className="small">xmax
            <input className="input" style={{ maxWidth: 100, marginLeft: 6 }}
              value={xmax} onChange={e => setXmax(Number(e.target.value) || 0)} />
          </label>
          <label className="small">samples
            <input className="input" style={{ maxWidth: 100, marginLeft: 6 }}
              value={samples} onChange={e => setSamples(parseInt(e.target.value) || 200)} />
          </label>
          <button className="btn" onClick={() => { // zoom 2x
            const mid = (xmin + xmax) / 2;
            const range = (xmax - xmin) / 4;
            setXmin(mid - range); setXmax(mid + range);
          }}>Zoom In</button>
          <button className="btn" onClick={() => { // unzoom
            const mid = (xmin + xmax) / 2;
            const range = (xmax - xmin);
            setXmin(mid - range); setXmax(mid + range);
          }}>Zoom Out</button>
        </div>
        <PolyGraph coeffsDesc={parsed ? parsed.coeffs : []} xmin={xmin} xmax={xmax} samples={samples} />
      </div>
      {y !== null && <p style={{ marginTop: 10 }}>f({x}) = <b className="ok">{y}</b></p>}
      {err && <p className="err" style={{ marginTop: 8 }}>Error: {err}</p>}
    </div>
  );
}
