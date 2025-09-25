import "./styles.css";
import CalculatorCard from "./CalculatorCard.jsx";
import PolyCard from "./PolyCard.jsx";

export default function App() {
  return (
    <div className="container">
      <h1 style={{ textShadow: "0 0 18px rgba(0,195,255,.35)" }}>
         <span className="badge">Complex Calculator</span>
      </h1>
      <div className="row" style={{ marginTop: 14 }}>
        <CalculatorCard />
        <PolyCard />
      </div>
    </div>
  );
}
