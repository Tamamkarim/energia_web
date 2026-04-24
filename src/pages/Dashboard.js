import { useEffect, useState } from "react";
import API from "../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);


function Dashboard() {
  const calculateCO2 = (consumption) => {
    return (consumption * 0.5).toFixed(2);
  };
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    consumption: "",
    date: "",
    notes: "",
  });

  // File upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);

  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    consumption: "",
    date: "",
    notes: "",
  });
  // Fetch uploaded files
  const fetchFiles = async () => {
    try {
      const res = await API.get("/files");
      setFiles(res.data);
    } catch (error) {
      alert("Error fetching files");
    }
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please choose a file");
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
      alert("File upload failed");
    }
  };

  // Start editing a record
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      consumption: item.consumption,
      date: item.date.slice(0, 10),
      notes: item.notes || "",
    });
  };

  // Handle update submit
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/energy/${editingId}`, editForm);
      setEditingId(null);
      setEditForm({ consumption: "", date: "", notes: "" });
      fetchRecords();
    } catch (error) {
      alert("Failed to update record");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const fetchRecords = async () => {
    try {
      const res = await API.get("/energy");
      setRecords(res.data);
    } catch (error) {
      alert("Error fetching energy data");
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

      setForm({
        consumption: "",
        date: "",
        notes: "",
      });

      fetchRecords();
    } catch (error) {
      alert("Failed to add energy record");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this record?");

    if (!confirmDelete) return;

    try {
      await API.delete(`/energy/${id}`);
      fetchRecords();
    } catch (error) {
      alert("Failed to delete record");
    }
  };

  const chartData = {
    labels: records.map((item) => formatDate(item.date)),
    datasets: [
      {
        label: "Energy consumption kWh",
        data: records.map((item) => Number(item.consumption)),
      },
    ],
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Energy Dashboard</h2>

      {/* Upload Section */}
      <h3>Upload Electricity Bill</h3>
      <form onSubmit={handleFileUpload} style={styles.form}>
        <input
          style={styles.input}
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <button style={styles.button} type="submit">
          Upload File
        </button>
      </form>

      <h3>Uploaded Files</h3>
      {files.map((file) => (
        <div key={file.id} style={styles.card}>
          <p>
            <strong>File:</strong> {file.original_name}
          </p>

          <a
            href={`http://localhost:5000/${file.file_path.replace("\\", "/")}`}
            target="_blank"
            rel="noreferrer"
          >
            Open file
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
          placeholder="Consumption kWh"
          value={form.consumption}
          onChange={(e) =>
            setForm({ ...form, consumption: e.target.value })
          }
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
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <button style={styles.button} type="submit">
          Add Record
        </button>
      </form>

      <div style={styles.chartBox}>
        <Bar data={chartData} />
      </div>

      <h3>Energy Records</h3>

      {records.map((item) => (
        <div key={item.id} style={styles.card}>
          <p>
            <strong>Date:</strong> {formatDate(item.date)}
          </p>
          <p>
            <strong>Consumption:</strong> {item.consumption} kWh
          </p>
          <p>
            <strong>CO2 Impact:</strong> {calculateCO2(item.consumption)} kg
          </p>
          <p>
            <strong>Notes:</strong> {item.notes}
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
                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                required
              />
              <input
                style={styles.input}
                type="text"
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              />
              <button style={styles.button} type="submit">Save</button>
              <button
                style={styles.cancelButton}
                type="button"
                onClick={() => setEditingId(null)}
              >
                Cancel
              </button>
            </form>
          ) : (
            <button style={styles.editButton} onClick={() => startEdit(item)}>
              Edit
            </button>
          )}
          <button
            style={styles.deleteButton}
            onClick={() => handleDelete(item.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  page: {
    padding: "30px",
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
  deleteButton: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    background: "#c62828",
    color: "white",
    cursor: "pointer",
  },
  chartBox: {
    maxWidth: "900px",
    marginBottom: "30px",
  },
  card: {
    border: "1px solid #ddd",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "8px",
    background: "white",
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
};

export default Dashboard;