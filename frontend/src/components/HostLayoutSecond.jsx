import React from 'react';
import { Outlet } from 'react-router-dom';
import HostHeaderSecond from './HostHeaderSecond';
import HostFooter from './HostFooter';

function HostLayoutSecond() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <HostHeaderSecond />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <HostFooter />
    </div>
  );
}

export default HostLayoutSecond;