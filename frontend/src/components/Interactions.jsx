
import { useEffect, useState } from "react";
import API from "../services/api";
import { io } from "socket.io-client";

const socket = io("https://energia-web-1.onrender.com");

export default function Interactions({ recordId }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [editingId, setEditingId] = useState(null);
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
    socket.on("new-comment", (data) => {
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

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditText(c.comment);
  };

  const saveEdit = async () => {
    if (!editText.trim()) return;

    await API.put(`/interactions/comments/${editingId}`, {
      comment: editText,
    });

    setEditingId(null);
    setEditText("");
    fetchComments();
  };

  const deleteComment = async (commentId) => {
    await API.delete(`/interactions/comments/${commentId}`);
    fetchComments();
  };

  return (
    <div className="interactions-card">
      <button className="like-btn" onClick={toggleLike}>
        ❤️ Like ({likes})
      </button>

      <div className="comment-form">
        <input
          type="text"
          placeholder="Kirjoita kommentti..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={addComment}>Lisää</button>
      </div>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p>Ei kommentteja vielä.</p>
        ) : (
          comments.map((c) => (
            <div className="comment-item" key={c.id}>
              <strong>{c.name}</strong>

              {editingId === c.id ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={saveEdit}>Tallenna</button>
                  <button onClick={() => setEditingId(null)}>Peruuta</button>
                </>
              ) : (
                <>
                  <p>{c.comment}</p>
                  <button onClick={() => startEdit(c)}>Muokkaa</button>
                  <button onClick={() => deleteComment(c.id)}>Poista</button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
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
