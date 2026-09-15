import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./AuthContext";

// Shared collection: every logged-in user reads and writes the same list.
const ITEMS_COLLECTION = "items";

export default function ItemsList() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = query(collection(db, ITEMS_COLLECTION), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await addDoc(collection(db, ITEMS_COLLECTION), {
        text: text.trim(),
        createdAt: serverTimestamp(),
        addedBy: user.email,
      });
      setText("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="items-card">
      <div className="items-header">
        <span>Logged in as {user.email}</span>
        <button onClick={logout}>Log out</button>
      </div>

      <form onSubmit={handleAdd} className="add-form">
        <input
          type="text"
          placeholder="Add an item..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading items...</p>
      ) : items.length === 0 ? (
        <p>No items yet — add the first one.</p>
      ) : (
        <ul className="items-list">
          {items.map((item) => (
            <li key={item.id}>
              <span>{item.text}</span>
              <small> — added by {item.addedBy}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
