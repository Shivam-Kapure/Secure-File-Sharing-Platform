import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FilesPage from "./pages/FilesPage";
import SharePage from "./pages/SharePage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const { ready, isAuthenticated } = useAuth();

  if (!ready) {
    return (
      <main className="screen-center">
        <div className="loading-dot-grid" aria-label="Loading application" />
      </main>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/app/files" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/app/files" replace /> : <RegisterPage />}
      />
      <Route
        path="/app/files"
        element={
          <ProtectedRoute>
            <FilesPage />
          </ProtectedRoute>
        }
      />
      <Route path="/share/:token" element={<SharePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
