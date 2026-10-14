import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api";

function RoleRoute({ allowedRole, children }) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    api.get("/api/auth/me")
      .then((response) => setRole(response.data.role))
      .catch(() => setRole(null))
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) return <Navigate to="/login" replace />;

  if (loading) {
    return <p className="py-20 text-center text-slate-500">Checking account...</p>;
  }

  if (!role) return <Navigate to="/login" replace />;

  if (role !== allowedRole) {
    return <Navigate to={role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return children;
}

export default RoleRoute;