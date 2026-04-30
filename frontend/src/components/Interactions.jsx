import { useEffect, useState } from "react";
import API from "../services/api";

export default function Interactions({ recordId }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [likes, setLikes] = useState(0);

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

  return (
    <div className="interactions">
      <button onClick={toggleLike}>
        ❤️ Like ({likes})
      </button>

      <div>
        <input
          type="text"
          placeholder="Kirjoita kommentti..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button onClick={addComment}>
          Lisää kommentti
        </button>
      </div>

      <div>
        {comments.length === 0 ? (
          <p>Ei kommentteja vielä.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id}>
              <strong>{c.name}</strong>
              <p>{c.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
