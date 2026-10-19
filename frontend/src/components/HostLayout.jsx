import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import HostHeader from './HostHeader';
import HostFooter from './HostFooter';
import Loader from './Loader';

const HostLayout = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const location = useLocation();

  // Show the exact same Airbnb fullScreen blur loader when navigating into /hosting
  useEffect(() => {
    setInitialLoading(true);
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {initialLoading && (
        <Loader fullScreen blur text="Welcome to Hosting..." />
      )}
      <HostHeader />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <HostFooter />
    </div>
  );
};

export default HostLayout;