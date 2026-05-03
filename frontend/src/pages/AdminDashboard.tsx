import { useEffect, useState } from "react";
import API from "../services/api";

interface User {
	id: string;
	name: string;
	email: string;
	role: string;
}

interface Record {
	id: string;
	name: string;
	email: string;
	consumption: number;
	date: string;
}

function AdminDashboard() {
	const [users, setUsers] = useState<User[]>([]);
	const [records, setRecords] = useState<Record[]>([]);

	useEffect(() => {
		API.get("/admin/users").then((res) => setUsers(res.data));
		API.get("/admin/records").then((res) => setRecords(res.data));
	}, []);

	return (
		<div style={styles.page}>
			<h2 style={styles.title}>Admin Dashboard</h2>

			<section style={styles.card}>
				<h3>Käyttäjät</h3>

				{users.map((user) => (
					<p key={user.id}>
						{user.name} - {user.email} - {user.role}
					</p>
				))}
			</section>

			<section style={styles.card}>
				<h3>Kaikki kulutustiedot</h3>

				{records.map((record) => (
					<div key={record.id} style={styles.record}>
						<p>
							<strong>Käyttäjä:</strong> {record.name} ({record.email})
						</p>
						<p>
							<strong>Kulutus:</strong> {record.consumption} kWh
						</p>
						<p>
							<strong>Päivämäärä:</strong> {record.date}
						</p>
					</div>
				))}
			</section>
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
	card: {
		background: "white",
		padding: "20px",
		borderRadius: "10px",
	},
	record: {
		marginBottom: "10px",
		padding: "10px",
		border: "1px solid #eee",
		borderRadius: "6px",
	},
};

export default AdminDashboard;
