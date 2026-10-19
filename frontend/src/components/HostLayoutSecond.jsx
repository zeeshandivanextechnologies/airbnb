import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import HostHeaderSecond from './HostHeaderSecond';
import HostFooter from './HostFooter';
import Loader from './Loader';

function HostLayoutSecond() {
  const [initialLoading, setInitialLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setInitialLoading(true);
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {initialLoading && (
        <Loader fullScreen blur text="Welcome to Hosting..." />
      )}
      <HostHeaderSecond />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <HostFooter />
    </div>
  );
}

export default HostLayoutSecond;