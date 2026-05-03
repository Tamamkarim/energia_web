import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const styles = {
	page: {},
	card: {},
	title: {},
	input: {},
	button: {},
	link: {},
};

function Register() {
	const [form, setForm] = useState<{ name: string; email: string; password: string }>({
		name: "",
		email: "",
		password: "",
	});

	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			await axios.post("https://energia-web-1.onrender.com/api/auth/register", form);
			alert("Registration successful");
			navigate("/login");
		} catch (error) {
			alert("Registration failed");
		}
	};

	return (
		<div style={styles.page}>
			<form onSubmit={handleSubmit} style={styles.card}>
				<h2 style={styles.title}>Create Account</h2>
				<input
					style={styles.input}
					placeholder="Name"
					value={form.name}
					onChange={(e) => setForm({ ...form, name: e.target.value })}
					required
				/>
				<input
					style={styles.input}
					placeholder="Email"
					type="email"
					value={form.email}
					onChange={(e) => setForm({ ...form, email: e.target.value })}
					required
				/>
				<input
					style={styles.input}
					placeholder="Password"
					type="password"
					value={form.password}
					onChange={(e) => setForm({ ...form, password: e.target.value })}
					required
				/>
				<button style={styles.button} type="submit">
					Register
				</button>

				<p style={styles.link} onClick={() => (window.location.href = "/")}> 
					Already have an account? Login
				</p>
			</form>
		</div>
	);
}

export default Register;
