import { useEffect, useState } from "react";
// Admin Dashboard button style
const adminButtonStyle = {
  background: '#1976d2',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  padding: '8px 16px',
  margin: '12px 0',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: 16,
  footer: {
    textAlign: "center",
    marginTop: "40px",
    padding: "20px",
    color: "#666",
  },
};
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement);



function Dashboard() {
  const [records, setRecords] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({
    consumption: "",
    date: "",
    notes: "",
  });
  // Loading state
  const [loading, setLoading] = useState(true);
  // Electricity price state
  const [electricityPrice, setElectricityPrice] = useState(null);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // File upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  // Fetch uploaded files
  const fetchFiles = async () => {
    try {
      const res = await API.get("/files");
      setFiles(res.data);
    } catch (error) {
      alert("Virhe tiedostojen haussa");
    }
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Valitse tiedosto");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await API.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSelectedFile(null);
      fetchFiles();
    } catch (error) {
      alert("Tiedoston lataus epäonnistui");
    }
  };

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    consumption: "",
    date: "",
    notes: "",
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const calculateCO2 = (consumption) => {
    return (Number(consumption) * 0.5).toFixed(2);
  };

  const fetchRecords = async () => {
    try {
      const res = await API.get("/energy");
      setRecords(res.data);
    } catch (error) {
      alert("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch electricity price
  const fetchElectricityPrice = async () => {
    try {
      const res = await API.get("/prices/current");
      setElectricityPrice(res.data);
    } catch (error) {
      setElectricityPrice(null);
    }
  };

  // Sort records by date descending
  const sortedRecords = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculate total consumption
  const totalConsumption = sortedRecords.reduce((sum, item) => sum + Number(item.consumption), 0);

  // Set pricePerKwh and monthlyFixedFee
  const pricePerKwh = electricityPrice ? electricityPrice.price / 100 : 0.0; // convert snt to euro
  const monthlyFixedFee = 5.0; // Example fixed fee, adjust as needed

  const estimatedBill = totalConsumption * pricePerKwh + monthlyFixedFee;

  // --- Company and Invoice Number ---
  const companyName = "Eco Energy Tracker Oy";
  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(user?.id || 1).padStart(3, "0")}`;

  // --- Payment Due Date Calculation ---
  const today = new Date();
  const paymentDate = new Date();
  paymentDate.setDate(today.getDate() + 14); // +14 days
  const formattedPaymentDate = paymentDate.toLocaleDateString("fi-FI");
  const invoiceDate = today.toLocaleDateString("fi-FI");

  // PDF download function
  const downloadInvoice = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Eco Energy Tracker - Kuukausilasku", 20, 20);

    doc.setFontSize(12);
    doc.text(`Yritys: ${companyName}`, 20, 35);
    doc.text(`Laskun numero: ${invoiceNumber}`, 20, 45);
    doc.text(`Käyttäjä: ${user?.name || "User"}`, 20, 60);
    doc.text(`Päivämäärä: ${invoiceDate}`, 20, 70);
    doc.text(`Eräpäivä: ${formattedPaymentDate}`, 20, 80);

    doc.text(`Kokonaiskulutus: ${totalConsumption.toFixed(2)} kWh`, 20, 95);
    doc.text(`Sähkön hinta: ${pricePerKwh.toFixed(2)} €/kWh`, 20, 105);
    doc.text(`Kuukausimaksu: ${monthlyFixedFee.toFixed(2)} €`, 20, 115);
    doc.text(`CO2-päästöt: ${calculateCO2(totalConsumption)} kg`, 20, 125);

    doc.setFontSize(16);
    doc.text(`Arvioitu kuukausilasku: ${estimatedBill.toFixed(2)} €`, 20, 140);

    doc.setFontSize(11);
    doc.text(
      "Huom: Lasku on arvio, joka perustuu käyttäjän lisäämiin kulutustietoihin.",
      20,
      155
    );

    doc.save("eco-energy-kuukausilasku.pdf");
  };

  const chartData = {
    labels: sortedRecords.map((item) => formatDate(item.date)),
    datasets: [
      {
        label: "Energy consumption kWh",
        data: sortedRecords.map((item) => Number(item.consumption)),
      },
    ],
  };

  const peakData = {
    labels: ["Peak Hours", "Off-Peak Hours"],
    datasets: [
      {
        label: "Energy usage distribution",
        data: [
          totalConsumption * 0.7,
          totalConsumption * 0.3,
        ],
        backgroundColor: ["#ff9800", "#4caf50"],
      },
    ],
  };

  // --- Comparison Data ---
  const comparisonData = {
    labels: ["Today", "Yesterday"], // or ["Uusin", "Edellinen"] for Finnish
    datasets: [
      {
        label: "Consumption (kWh)",
        data:
          sortedRecords.length >= 2
            ? [
                Number(sortedRecords[0].consumption),
                Number(sortedRecords[1].consumption),
              ]
            : [],
        backgroundColor: ["#2e7d32", "#c62828"], // Green = better, Red = worse
      },
    ],
  };
  // --- getComparison function ---
  const getComparison = () => {
    if (sortedRecords.length < 2) {
      return "Ei tarpeeksi tietoja vertailuun.";
    }

    const latest = Number(sortedRecords[0].consumption);
    const previous = Number(sortedRecords[1].consumption);

    if (latest < previous) {
      return "Hienoa! Kulutuksesi on pienentynyt";
    }

    if (latest > previous) {
      return "Kulutuksesi on kasvanut";
    }

    return "Kulutuksesi pysyi samana.";
  };



  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <div>
          <h2 style={styles.logo}>Eco Energy Tracker</h2>
          <p style={styles.userText}>Tervetuloa, {user?.name}</p>
          {user?.role === "admin" && (
            <span style={styles.adminBadge}>Ylläpitäjä</span>
          )}
        </div>
        <div style={styles.navActions}>
          {user?.role === "admin" && (
            <button
              style={styles.adminButton}
              onClick={() => (window.location.href = "/admin")}
            >
              Admin Dashboard
            </button>
          )}
          <button style={styles.logoutButton} onClick={handleLogout}>
            Kirjaudu ulos
          </button>
        </div>
      </div>
      <h2 style={styles.title}>Energiapaneeli</h2>

      {/* Electricity price and bill */}
      <h3>
        Sähkön hinta nyt:{" "}
        {electricityPrice
          ? `${electricityPrice.price.toFixed(2)} snt/kWh`
          : "Ladataan..."}
      </h3>
      <h3>
        Arvioitu lasku: {estimatedBill.toFixed(2)} €
      </h3>

      {/* Admin Dashboard Button - Only for Admins */}
      {user?.role === "admin" && (
        <button
          style={adminButtonStyle}
          onClick={() => (window.location.href = "/admin")}
        >
          Admin Dashboard
        </button>
      )}


      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3>Kokonaiskulutus</h3>
          <p>{totalConsumption.toFixed(2)} kWh</p>
        </div>
        <div style={styles.statCard}>
          <h3>CO2-päästöt</h3>
          <p>{calculateCO2(totalConsumption)} kg</p>
        </div>
        <div style={styles.statCard}>
          <h3>Kuukausilasku</h3>
          <p>{estimatedBill.toFixed(2)} €</p>
        </div>
        <div style={styles.statCard}>
          <h3>Merkinnät</h3>
          <p>{records.length}</p>
        </div>
      </div>

      {/* File Upload Section */}
      <div style={styles.section}>
        <h3>Lataa sähkölasku</h3>
        <form onSubmit={handleFileUpload} style={styles.form}>
          <input
            style={styles.input}
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <button style={styles.button} type="submit">
            Lataa tiedosto
          </button>
        </form>
      </div>

      <h3>Ladatut tiedostot</h3>
      {files.map((file) => (
        <div key={file.id} style={styles.card}>
          <p>
            <strong>Tiedosto:</strong> {file.original_name}
          </p>
          <a
            href={`http://localhost:5000/${file.file_path.replace("\\", "/")}`}
            target="_blank"
            rel="noreferrer"
          >
            Avaa tiedosto
          </a>
          {file.mimetype && file.mimetype.startsWith("image/") && (
            <img
              src={`http://localhost:5000/${file.file_path.replace("\\", "/")}`}
              alt={file.original_name}
              style={{ maxWidth: "250px", borderRadius: "8px", display: "block", marginTop: "10px" }}
            />
          )}
        </div>
      ))}

      {/* Kuukausilasku (Invoice) Section */}
      <div style={styles.invoiceBox}>
        <h3>Kuukausilasku</h3>
        <p>
          <strong>Yritys:</strong> {companyName}
        </p>
        <p>
          <strong>Laskun numero:</strong> {invoiceNumber}
        </p>
        <p>
          <strong>Kokonaiskulutus:</strong> {totalConsumption.toFixed(2)} kWh
        </p>
        <p>
          <strong>Sähkön hinta:</strong> {pricePerKwh.toFixed(2)} €/kWh
        </p>
        <p>
          <strong>Kuukausimaksu:</strong> {monthlyFixedFee.toFixed(2)} €
        </p>
        <p>
          <strong>CO2-päästöt:</strong> {calculateCO2(totalConsumption)} kg
        </p>
        {/* Payment Due Date */}
        <p>
          <strong>Eräpäivä:</strong> {formattedPaymentDate}
        </p>
        <h3>Arvioitu kuukausilasku: {estimatedBill.toFixed(2)} €</h3>
        <button style={styles.button} onClick={downloadInvoice}>
          Lataa lasku PDF
        </button>
      </div>


      {/* Energy Records Section */}
      <div style={styles.section}>
        <h3>Lisää kulutustieto</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="number"
            placeholder="Kulutus (kWh)"
            value={form.consumption}
            onChange={(e) => setForm({ ...form, consumption: e.target.value })}
            required
          />

          <input
            style={styles.input}
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />

          <input
            style={styles.input}
            type="text"
            placeholder="Muistiinpanot"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          <button style={styles.button} type="submit">
            Lisää merkintä
          </button>
        </form>
      </div>

      <div style={styles.chartBox}>
        <Bar data={chartData} />
      </div>

      <div style={styles.chartBox}>
        <h3>Energiankäyttö</h3>
        <Pie data={peakData} />
      </div>

      <div style={{ margin: "20px 0", fontWeight: "bold", color: "#1976d2" }}>
        Energiansäästövinkki: Käytä suuritehoisia laitteita edullisina aikoina (off-peak).
      </div>

      <div style={styles.tipBox}>
        <h3>Kulutuksen vertailu</h3>
        <p>{getComparison()}</p>
      </div>


      <div style={styles.chartBox}>
        <h3>Kulutuksen vertailu (Uusin vs Edellinen)</h3>
        <Bar data={comparisonData} />
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "30px",
    background: "#f1f8f4",
    minHeight: "100vh",
  },
  title: {
    color: "#1b5e20",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#1976d2",
    padding: "18px 32px",
    borderRadius: "10px",
    marginBottom: "30px",
    color: "white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  logo: {
    margin: 0,
    fontWeight: "bold",
    fontSize: 28,
    letterSpacing: 1,
    color: "#fff",
  },
  userText: {
    margin: 0,
    fontSize: 16,
    color: "#e3f2fd",
  },
  adminBadge: {
    background: "#ff9800",
    color: "#fff",
    borderRadius: "6px",
    padding: "2px 10px",
    fontWeight: "bold",
    marginLeft: "10px",
    fontSize: 14,
  },
  navActions: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  adminButton: {
    background: "#fff",
    color: "#1976d2",
    border: "none",
    borderRadius: 4,
    padding: "8px 16px",
    fontWeight: "bold",
    fontSize: 16,
    cursor: "pointer",
    marginRight: "10px",
    boxShadow: "0 1px 4px rgba(25, 118, 210, 0.08)",
    transition: "background 0.2s, color 0.2s",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 18px",
    borderRadius: "6px",
    border: "none",
    background: "#2e7d32",
    color: "white",
    cursor: "pointer",
  },
  chartBox: {
    maxWidth: "900px",
    marginBottom: "30px",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
  },
  editButton: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    background: "#1976d2",
    color: "white",
    cursor: "pointer",
    marginRight: "10px",
  },
  cancelButton: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    background: "#777",
    color: "white",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    background: "#c62828",
    color: "white",
    cursor: "pointer",
  },
  invoiceBox: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "30px",
    maxWidth: "900px",
    border: "1px solid #c8e6c9",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  card: {
    border: "1px solid #ddd",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "8px",
    background: "white",
  },
};

export default Dashboard;