import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

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
        <div className="main-with-sidebar">
          <div key={location.pathname} className="page-transition">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
