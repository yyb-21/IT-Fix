import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import NotificationDropdown from "../components/NotificationDropdown";
import { useAuth } from "../context/AuthContext";
import { useITNewTicketNotifications } from "../hooks/useITNewTicketNotifications";
import { useUserResolvedTicketNotifications } from "../hooks/useUserResolvedTicketNotifications";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { role, user, loading } = useAuth();
  const notifyIT =
    !loading && !!user?.id && (role === "it_support" || role === "admin");
  useITNewTicketNotifications(notifyIT, user?.id);
  useUserResolvedTicketNotifications();

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen">
      {sidebarOpen ? (
        <button
          type="button"
          className="sidebar-drawer-overlay md:hidden"
          aria-label="Close menu"
          onClick={closeSidebar}
        />
      ) : null}

      <Sidebar open={sidebarOpen} onNavigate={closeSidebar} />

      <div className="md:ml-[240px]">
        <Navbar toggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <div className="main-with-sidebar relative">
          <div className="hidden md:block absolute top-6 right-8 z-50">
            <NotificationDropdown />
          </div>
          <div key={location.pathname} className="page-transition">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
