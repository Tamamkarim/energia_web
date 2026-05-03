import { useEffect, useState } from "react";
import API from "../services/api";
import { io } from "socket.io-client";

interface InteractionsProps {
	recordId: string;
}

interface Comment {
	id: string;
	comment: string;
	record_id: string;
	// أضف خصائص أخرى إذا لزم الأمر
}

const socket = io("https://energia-web-1.onrender.com");

export default function Interactions({ recordId }: InteractionsProps) {
	const [comments, setComments] = useState<Comment[]>([]);
	const [comment, setComment] = useState("");
	const [likes, setLikes] = useState(0);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editText, setEditText] = useState("");

	const fetchComments = async () => {
		const res = await API.get(`/interactions/comments/${recordId}`);
		setComments(res.data);
	};

	const fetchLikes = async () => {
		const res = await API.get(`/interactions/likes/${recordId}`);
		setLikes(res.data.count);
	};

	useEffect(() => {
		if (recordId) {
			fetchComments();
			fetchLikes();
		}
	}, [recordId]);

	useEffect(() => {
		socket.on("new-comment", (data: any) => {
			if (data.record_id === recordId) {
				fetchComments();
			}
		});
		return () => {
			socket.off("new-comment");
		};
	}, [recordId]);

	const addComment = async () => {
		if (!comment.trim()) return;

		await API.post("/interactions/comments", {
			record_id: recordId,
			comment,
		});

		setComment("");
		fetchComments();
	};

	const toggleLike = async () => {
		await API.post("/interactions/likes", {
			record_id: recordId,
		});
		fetchLikes();
	};

	// ... أكمل نقل بقية الكود من الملف الأصلي حسب الحاجة ...
	// لاحقًا: أضف JSX الخاص بالواجهة كما هو مع تعديلات بسيطة للأنواع إذا لزم الأمر

	return null; // استبدل هذا بالـ JSX الفعلي لاحقًا
}
