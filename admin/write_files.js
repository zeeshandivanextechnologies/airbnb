const fs = require('fs');

const appContent = import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path= / element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path=approvals element={<Dashboard />} />
          <Route path=listings element={<Dashboard />} />
          <Route path=users element={<Dashboard />} />
          <Route path=bookings element={<Dashboard />} />
          <Route path=settings element={<Dashboard />} />
          <Route path=* element={<Navigate to=/ replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
;
fs.writeFileSync('src/App.jsx', appContent);

const layoutContent = import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  FaAirbnb, 
  FaBars, 
  FaThLarge, 
  FaClock, 
  FaHome, 
  FaUsers, 
  FaCalendarCheck, 
  FaCog,
  FaBell,
  FaSearch
} from 'react-icons/fa';
import styles from './styles/AdminLayout.module.css';

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard Overview';
      case '/approvals':
        return 'Pending Listing Approvals';
      case '/listings':
        return 'All Listings Management';
      case '/users':
        return 'Users & Hosts';
      case '/bookings':
        return 'Bookings & Reservations';
      case '/settings':
        return 'Platform Settings';
      default:
        return 'Admin Portal';
    }
  };

  const navLinks = [
    { to: '/', icon: <FaThLarge />, label: 'Dashboard' },
    { to: '/approvals', icon: <FaClock />, label: 'Pending Approvals' },
    { to: '/listings', icon: <FaHome />, label: 'All Listings' },
    { to: '/users', icon: <FaUsers />, label: 'Users & Hosts' },
    { to: '/bookings', icon: <FaCalendarCheck />, label: 'Bookings' },
    { to: '/settings', icon: <FaCog />, label: 'Settings' },
  ];

  const handleToggle = () => {
    if (window.innerWidth <= 991) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className={styles.adminContainer}>
      {/* Mobile Backdrop */}
      <div 
        className={\\ \\}
        onClick={() => setMobileOpen(false)}
      />

      {/* Left Sidebar */}
      <aside className={\\ \ \\}>
        <div className={styles.sidebarBrand}>
          <FaAirbnb className={styles.brandLogo} />
          <span className={styles.brandText}>Airbnb Admin</span>
        </div>

        <nav className={styles.sidebarNav}>
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => \\ \\}
              onClick={() => setMobileOpen(false)}
              title={item.label}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navText}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.adminAvatar}>A</div>
          <div className={styles.adminInfo}>
            <span className={styles.adminName}>Super Admin</span>
            <span className={styles.adminRole}>Administrator</span>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className={styles.mainWrapper}>
        {/* Header with Left Bar Button */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button 
              type=button 
              className={styles.toggleBtn} 
              onClick={handleToggle}
              title=Toggle Sidebar
            >
              <FaBars />
            </button>
            <h1 className={styles.pageHeaderTitle}>{getPageTitle()}</h1>
          </div>

          <div className={styles.headerRight}>
            <button type=button className={styles.headerActionBtn} title=Search>
              <FaSearch size={14} />
            </button>
            <button type=button className={styles.headerActionBtn} title=Notifications>
              <FaBell size={14} />
              <span className={styles.badgeDot} />
            </button>
          </div>
        </header>

        {/* Content Body with Outlet */}
        <main className={styles.contentBody}>
          <div className=container-fluid>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
;
fs.writeFileSync('src/components/AdminLayout.jsx', layoutContent);

const dashboardContent = import React from 'react';
import { FaClock, FaHome, FaUsers, FaCalendarCheck } from 'react-icons/fa';

export default function Dashboard() {
  const stats = [
    { title: 'Pending Approvals', value: '12', change: '+3 today', bg: '#fff1f2', color: '#e11d48', icon: <FaClock /> },
    { title: 'Total Listings', value: '1,280', change: '+18% this month', bg: '#eff6ff', color: '#2563eb', icon: <FaHome /> },
    { title: 'Active Hosts', value: '840', change: '+5% this month', bg: '#f0fdf4', color: '#16a34a', icon: <FaUsers /> },
    { title: 'Total Bookings', value: '4,320', change: '₹12.4L revenue', bg: '#fefce8', color: '#ca8a04', icon: <FaCalendarCheck /> },
  ];

  return (
    <div>
      {/* Bootstrap Grid: Metric Cards */}
      <div className=row g-4 mb-4>
        {stats.map((stat, i) => (
          <div key={i} className=col-12 col-sm-6 col-xl-3>
            <div className=card border-0 shadow-sm rounded-4 p-4 h-100 bg-white>
              <div className=d-flex justify-content-between align-items-center mb-3>
                <span className=text-secondary fw-semibold small>{stat.title}</span>
                <div 
                  className=rounded-3 d-flex align-items-center justify-content-center
                  style={{ width: '40px', height: '40px', backgroundColor: stat.bg, color: stat.color }}
                >
                  {stat.icon}
                </div>
              </div>
              <h2 className=fw-bold mb-1 style={{ color: '#111' }}>{stat.value}</h2>
              <span className=small text-muted>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bootstrap Grid: Recent Pending Approvals Table */}
      <div className=row g-4>
        <div className=col-12 col-lg-8>
          <div className=card border-0 shadow-sm rounded-4 p-4 bg-white>
            <div className=d-flex justify-content-between align-items-center mb-4>
              <div>
                <h5 className=fw-bold mb-1>Recent Submissions Awaiting Approval</h5>
                <p className=text-muted small mb-0>Hosts who recently requested to publish their listing.</p>
              </div>
            </div>

            <div className=table-responsive>
              <table className=table table-hover align-middle mb-0>
                <thead className=table-light>
                  <tr>
                    <th>Listing Title</th>
                    <th>Host</th>
                    <th>Price</th>
                    <th>Location</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { title: 'Creative hair styles by Mohammad', host: 'Mohammad', price: '₹500', city: 'Sawai Madhopur' },
                    { title: 'Travel sketching with an art host', host: 'Priya S.', price: '₹800', city: 'Jaipur' },
                    { title: 'Sunset Hilltop Heritage Homestay', host: 'Vikram R.', price: '₹2,400', city: 'Udaipur' }
                  ].map((row, idx) => (
                    <tr key={idx}>
                      <td className=fw-semibold>{row.title}</td>
                      <td>{row.host}</td>
                      <td className=fw-bold text-dark>{row.price}</td>
                      <td><span className=badge bg-light text-dark border>{row.city}</span></td>
                      <td>
                        <div className=d-flex gap-2>
                          <button className=btn btn-sm btn-success rounded-pill px-3 py-1>Approve</button>
                          <button className=btn btn-sm btn-outline-danger rounded-pill px-3 py-1>Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Platform Alerts */}
        <div className=col-12 col-lg-4>
          <div className=card border-0 shadow-sm rounded-4 p-4 bg-white h-100>
            <h5 className=fw-bold mb-3>System Status</h5>
            <div className=d-flex flex-column gap-3>
              <div className=p-3 rounded-3 bg-light border>
                <span className=fw-semibold small d-block mb-1>PostgreSQL Database</span>
                <span className=text-success small fw-medium>● Connected (airbnb_db)</span>
              </div>
              <div className=p-3 rounded-3 bg-light border>
                <span className=fw-semibold small d-block mb-1>Backend API Server</span>
                <span className=text-success small fw-medium>● Active on port 5000</span>
              </div>
              <div className=p-3 rounded-3 bg-light border>
                <span className=fw-semibold small d-block mb-1>Commission Rate</span>
                <span className=text-muted small>Current Airbnb Fee: <strong>20%</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
;
fs.writeFileSync('src/pages/Dashboard.jsx', dashboardContent);
console.log('ALL FILES WRITTEN SUCCESSFULLY');