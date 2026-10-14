import React from 'react';
import { FaAirbnb } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function HostHeaderSecond() {
  return (
    <header className="border-bottom bg-white sticky-top" style={{ zIndex: 1000 }}>
      <div className="container py-lg-4 py-3 d-flex justify-content-between align-items-center">
        <Link to="/" className="text-decoration-none d-flex align-items-center">
          <FaAirbnb size={32} color="#FF385C" />
        </Link>
        <button 
          className="btn text-white rounded-pill px-4 fw-bold" 
          style={{ backgroundColor: '#FF385C' }}
        >
          Get started
        </button>
      </div>
    </header>
  );
}

export default HostHeaderSecond;