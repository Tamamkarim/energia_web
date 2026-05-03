import { useState } from "react";
import axios from "axios";

const styles = {
	page: {
		minHeight: "100vh",
		background: "#f1f8f4",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	card: {
		width: "350px",
		background: "white",
		// ... أكمل بقية الأنماط حسب الحاجة ...
	},
	title: {},
	input: {},
	button: {},
	link: {},
};

function Login() {
	const [form, setForm] = useState<{ email: string; password: string }>({ email: "", password: "" });

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const res = await axios.post("https://energia-web-1.onrender.com/api/auth/login", form);
			localStorage.setItem("token", res.data.token);
			localStorage.setItem("user", JSON.stringify(res.data.user));
			window.location.href = "/dashboard";
		} catch (err) {
			alert("Login failed");
		}
	};

	return (
		<div style={styles.page}>
			<form onSubmit={handleSubmit} style={styles.card}>
				<h2 style={styles.title}>Kirjaudu sisään</h2>

				<input
					style={styles.input}
					placeholder="Sähköposti"
					type="email"
					onChange={(e) => setForm({ ...form, email: e.target.value })}
				/>

				<input
					style={styles.input}
					placeholder="Salasana"
					type="password"
					onChange={(e) => setForm({ ...form, password: e.target.value })}
				/>

				<button style={styles.button} type="submit">
					Kirjaudu
				</button>
				<p style={styles.link} onClick={() => (window.location.href = "/register")}> 
					Ei vielä tiliä? Rekisteröidy
				</p>
			</form>
		</div>
	);
}

export default Login;
