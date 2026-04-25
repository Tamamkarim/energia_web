import { useEffect, useState } from "react";
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

  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
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
      alert("Virhe energiatietojen haussa");
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchFiles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/energy", form);
      setForm({ consumption: "", date: "", notes: "" });
      fetchRecords();
    } catch (error) {
      alert("Energiamerkinnän lisääminen epäonnistui");
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      consumption: item.consumption,
      date: item.date.slice(0, 10),
      notes: item.notes || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/energy/${editingId}`, editForm);
      setEditingId(null);
      setEditForm({ consumption: "", date: "", notes: "" });
      fetchRecords();
    } catch (error) {
      alert("Merkinnän päivitys epäonnistui");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Poistetaanko tämä merkintä?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/energy/${id}`);
      fetchRecords();
    } catch (error) {
      alert("Merkinnän poistaminen epäonnistui");
    }
  };

  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );



  // Sample data for peak/off-peak usage
  const totalConsumption = records.reduce(
    (sum, item) => sum + Number(item.consumption),
    0
  );

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
      <div style={styles.header}>
        <h3>Tervetuloa, {user?.name}</h3>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Kirjaudu ulos
        </button>
      </div>
      <h2 style={styles.title}>Energiapaneeli</h2>

      {/* File Upload Section */}
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

      {/* Energy Records Section */}
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

      <h3>Energiatiedot</h3>

      {sortedRecords.map((item) => (
        <div key={item.id} style={styles.card}>
          <p>
            <strong>Päivämäärä:</strong> {formatDate(item.date)}
          </p>
          <p>
            <strong>Kulutus:</strong> {item.consumption} kWh
          </p>
          <p>
            <strong>CO2-päästöt:</strong> {calculateCO2(item.consumption)} kg
          </p>
          <p>
            <strong>Muistiinpanot:</strong> {item.notes}
          </p>

          {editingId === item.id ? (
            <form onSubmit={handleUpdate} style={styles.form}>
              <input
                style={styles.input}
                type="number"
                value={editForm.consumption}
                onChange={(e) =>
                  setEditForm({ ...editForm, consumption: e.target.value })
                }
                required
              />

              <input
                style={styles.input}
                type="date"
                value={editForm.date}
                onChange={(e) =>
                  setEditForm({ ...editForm, date: e.target.value })
                }
                required
              />

              <input
                style={styles.input}
                type="text"
                value={editForm.notes}
                onChange={(e) =>
                  setEditForm({ ...editForm, notes: e.target.value })
                }
              />

              <button style={styles.button} type="submit">
                Tallenna
              </button>

              <button
                style={styles.cancelButton}
                type="button"
                onClick={() => setEditingId(null)}
              >
                Peruuta
              </button>
            </form>
          ) : (
            <button style={styles.editButton} onClick={() => startEdit(item)}>
              Muokkaa
            </button>
          )}

          <button
            style={styles.deleteButton}
            onClick={() => handleDelete(item.id)}
          >
            Poista
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  logoutButton: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    background: "#c62828",
    color: "white",
    cursor: "pointer",
  },
  tipBox: {
    background: "#e8f5e9",
    border: "1px solid #a5d6a7",
    padding: "18px",
    borderRadius: "10px",
    marginBottom: "25px",
    maxWidth: "900px",
  },
  page: {
    padding: "30px",
    background: "#f1f8f4",
    minHeight: "100vh",
  },
  title: {
    color: "#1b5e20",
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
  card: {
    border: "1px solid #ddd",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "8px",
    background: "white",
  },
};

export default Dashboard;