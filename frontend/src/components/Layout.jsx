import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Loader from './Loader';

const Layout = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const location = useLocation();

  // First time website load animation (1s smooth experience)
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="layout">
      {initialLoading && (
        <Loader fullScreen blur text="Welcome to Airbnb..." />
      )}
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
