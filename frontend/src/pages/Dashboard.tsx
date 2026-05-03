import Interactions from "../components/Interactions";
import { useEffect, useState } from "react";
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

interface RecordType {
	id: string;
	name: string;
	email: string;
	consumption: number;
	date: string;
	notes?: string;
	category?: string;
}

function Dashboard() {
	const [fileSearch, setFileSearch] = useState("");
	const [records, setRecords] = useState<RecordType[]>([]);
	const user = JSON.parse(localStorage.getItem("user") || '{}');
	const [form, setForm] = useState({
		consumption: "",
		date: "",
		notes: "",
		category: "electricity",
	});

	// Handle add energy record
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await API.post("/energy", form);
			setForm({
				consumption: "",
				date: "",
				notes: "",
				category: "electricity",
			});
			// ... تحديث السجلات أو أي منطق آخر ...
		} catch (err) {
			// ... معالجة الخطأ ...
		}
	};

	// ... أكمل نقل بقية الكود من الملف الأصلي حسب الحاجة ...
	return null; // استبدل هذا بالـ JSX الفعلي لاحقًا
}

export default Dashboard;
