import React from 'react';
import styles from '../../components/styles/Trips.module.css';
import illustration from '../../assets/trip_illustration.jpg';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function Trips() {
  return (
    <div className="container-fluid">
      <div className={`row ${styles.mainRow}`}>
        {/* Left Side */}
        <div className="col-md-5 col-lg-4 mb-lg-0 mb-3">
          <div className={styles.leftSidebar}>
            <div className={styles.contentWrapper}>
            <h1>Trips</h1>
              <img src={illustration} alt="Map illustration" className={styles.illustration} />
              <h2 className={styles.title}>Map out your next trip</h2>
              <p className={styles.subtitle}>
                After you book a trip, experience or service, come back here to see details, explore the map and save places to visit.
              </p>
              <button className={styles.getStartedBtn}>Get started</button>
            </div>
          </div>
        </div>
        
        {/* Right Side - Map */}
        <div className="col-md-7 col-lg-8 d-none d-md-block">
          <div className={styles.mapContainer}>
            <MapContainer 
              center={[15.0, 100.0]} 
              zoom={4} 
              scrollWheelZoom={true}
              zoomControl={false}
              attributionControl={false}
              className={styles.mapFrame}
            >
              <TileLayer
                url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trips;