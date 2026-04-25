
import useLanguage from "../hooks/useLanguage";

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 32px",
  background: "#1976d2",
  color: "white",
  fontSize: "20px",
};

const langBtnStyle = {
  fontSize: "20px",
  marginLeft: "10px",
  padding: "6px 16px",
  borderRadius: "6px",
  border: "none",
  background: "#fff",
  color: "#1976d2",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  transition: "background 0.2s, color 0.2s",
};

function Navbar() {
  const { language, changeLanguage } = useLanguage();
  return (
    <nav style={navStyle}>
      <span>Eco Energy Tracker</span>
      <div>
        <button
          style={{
            ...langBtnStyle,
            background: language === "fi" ? "#1976d2" : "#fff",
            color: language === "fi" ? "#fff" : "#1976d2",
          }}
          onClick={() => changeLanguage("fi")}
        >
          🇫🇮 FI
        </button>
        <button
          style={{
            ...langBtnStyle,
            background: language === "en" ? "#1976d2" : "#fff",
            color: language === "en" ? "#fff" : "#1976d2",
          }}
          onClick={() => changeLanguage("en")}
        >
          🇬🇧 EN
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
