import { useMemo } from "react";
import {
    ResponsiveContainer, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine
} from "recharts";

// evaluates the polynomial with coefficients DESC (e.g., [a_n, ..., a1, a0])
function evalPolyDesc(coeffs, x) {
    let y = 0;
    for (const c of coeffs) y = y * x + c;
    return y;
}

//  generates N points (x,y) for the polynomial with coefficients DESC in [xmin, xmax]
function makePoints(coeffsDesc, xmin, xmax, N = 200) {
    const pts = [];
    if (!coeffsDesc || coeffsDesc.length === 0) return pts;
    const step = (xmax - xmin) / (N - 1);
    for (let i = 0; i < N; i++) {
        const x = xmin + i * step;
        const y = evalPolyDesc(coeffsDesc, x);
        pts.push({ x, y });
    }
    return pts;
}

export default function PolyGraph({
    coeffsDesc,
    xmin = -10,
    xmax = 10,
    samples = 300,
    height = 300
}) {
    const data = useMemo(() => makePoints(coeffsDesc, xmin, xmax, samples), [coeffsDesc, xmin, xmax, samples]);

    return (
        <div className="card" style={{ marginTop: 12 }}>
            <h3 style={{ marginTop: 0 }}>Graph</h3>
            <ResponsiveContainer width="100%" height={height}>
                <LineChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,.06)" />
                    <XAxis
                        dataKey="x"
                        type="number"
                        domain={[xmin, xmax]}
                        tick={{ fill: "var(--muted)" }}
                        stroke="rgba(255,255,255,.2)"
                    />
                    <YAxis
                        tick={{ fill: "var(--muted)" }}
                        stroke="rgba(255,255,255,.2)"
                    />
                    {/* axe */}
                    <ReferenceLine y={0} stroke="rgba(0,195,255,.45)" />
                    <ReferenceLine x={0} stroke="rgba(0,195,255,.45)" />
                    <Tooltip
                        contentStyle={{
                            background: "#0a111d",
                            border: "1px solid rgba(255,255,255,.1)",
                            color: "var(--ink)",
                        }}
                        formatter={(v) => Number(v).toPrecision(6)}
                    />
                
                    <Line
                        isAnimationActive={false}
                        type="monotone"
                        dataKey="y"
                        dot={false}
                        stroke="var(--neon)"
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
