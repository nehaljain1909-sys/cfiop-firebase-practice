import { AuthProvider, useAuth } from "./AuthContext";
import AuthForm from "./AuthForm";
import ItemsList from "./ItemsList";
import "./App.css";
import { firebaseConfigured } from "./firebase";

function AppContent() {
  const { user, authLoading } = useAuth();

  if (!firebaseConfigured) {
    return (
      <div className="app-shell">
        <h1>Firebase + React Practice</h1>
        <p>Firebase is not configured yet.</p>
        <p>Copy .env.example to .env and add your Firebase web app values, then restart the dev server.</p>
      </div>
    );
  }

  if (authLoading) return <p className="loading">Loading...</p>;

  return (
    <div className="app-shell">
      <h1>Firebase + React Practice</h1>
      {user ? <ItemsList /> : <AuthForm />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
