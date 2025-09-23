import "./styles.css";

import CalculatorCard from "./CalculatorCard.jsx";
import PolyCard from "./PolyCard.jsx";

import { useState } from "react";

export default function App() {
  const [graphExpr, setGraphExpr] = useState(null);

  function handleGraphRequest(expr) {
    setGraphExpr(expr);
  }

  return (
    <div className="container">
      <h1 style={{ textShadow: "0 0 18px rgba(0,195,255,.35)" }}>
         <span className="badge">Complex Calculator</span>
      </h1>
      <div className="row" style={{ marginTop: 14 }}>
        <CalculatorCard onGraphRequest={handleGraphRequest} />
        <PolyCard externalExpr={graphExpr} onGraphed={() => setGraphExpr(null)} />
      </div>
    </div>
  );
}
