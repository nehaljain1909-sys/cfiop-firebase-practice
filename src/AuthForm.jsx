import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function AuthForm() {
  const { signup, login } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "signup") {
        await signup(email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>{mode === "login" ? "Log in" : "Sign up"}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
        </button>
      </form>
      <button
        className="link-button"
        onClick={() => {
          setMode(mode === "login" ? "signup" : "login");
          setError("");
        }}
      >
        {mode === "login"
          ? "Need an account? Sign up"
          : "Already have an account? Log in"}
      </button>
    </div>
  );
}
