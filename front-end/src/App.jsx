import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import PublicLayout from "./layouts/PublicLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import NewTicketPage from "./pages/NewTicketPage";
import ITDashboardPage from "./pages/ITDashboardPage";
import AdminPage from "./pages/AdminPage";
import ITTeamPage from "./pages/ITTeamPage";
import ProfilePage from "./pages/ProfilePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import HomeRedirectPage from "./pages/HomeRedirectPage";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomeRedirectPage />} />

          <Route element={<RoleGuard allowedRoles={["user"]} />}>
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/tickets/new" element={<NewTicketPage />} />
          </Route>

          <Route element={<RoleGuard allowedRoles={["it_support", "admin"]} />}>
            <Route path="/it/dashboard" element={<ITDashboardPage />} />
            <Route path="/it/team" element={<ITTeamPage />} />
          </Route>

          <Route element={<RoleGuard allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          <Route element={<RoleGuard allowedRoles={["user", "it_support", "admin"]} />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
