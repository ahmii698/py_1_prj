import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../services/api";

const homeFor: Record<Role, string> = {
  student: "/student",
  teacher: "/teacher",
  admin: "/admin",
};

/* ---------------------------------------------------------
   ProtectedRoute: sirf logged in aur sahi role wala user andar ja sakta hai
   - login nahi hai       -> /login
   - role match nahi hota -> apne hi panel par wapas
--------------------------------------------------------- */
export function ProtectedRoute({ allowedRoles }: { allowedRoles: Role[] }) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !role) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={homeFor[role]} replace />;
  }

  return <Outlet />;
}

/* ---------------------------------------------------------
   PublicRoute: login, register, forgot-password ke liye
   Agar user pehle se logged in hai to in pages par na aaye,
   seedha apne panel par chala jaye
--------------------------------------------------------- */
export function PublicRoute() {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated && role) {
    return <Navigate to={homeFor[role]} replace />;
  }

  return <Outlet />;
}