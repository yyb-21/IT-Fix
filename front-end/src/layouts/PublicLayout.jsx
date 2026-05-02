import { Outlet, useLocation } from "react-router-dom";

const PublicLayout = () => {
  const location = useLocation();
  return (
    <main className="auth-screen">
      <div className="auth-blobs" aria-hidden>
        <div className="auth-blob auth-blob--a" />
        <div className="auth-blob auth-blob--b" />
      </div>
      <div key={location.pathname} className="page-transition w-full max-w-[480px]">
        <Outlet />
      </div>
    </main>
  );
};

export default PublicLayout;
