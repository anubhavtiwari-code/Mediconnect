import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  // If role is an array
  if (role && Array.isArray(role)) {
    if (!role.includes(user.role)) {
      return <Navigate to="/" />;
    }
  }

  // If role is a single string
  if (role && typeof role === "string") {
    if (user.role !== role) {
      return <Navigate to="/" />;
    }
  }

  return children;
}