import React from 'react';
import { Outlet } from 'react-router-dom';
import HostHeader from './HostHeader';
import HostFooter from './HostFooter';

const HostLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HostHeader />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <HostFooter />
    </div>
  );
};

export default HostLayout;