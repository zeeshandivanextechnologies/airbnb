import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTrash, FaCheck, FaArrowLeft } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import toast from 'react-hot-toast';
import styles from './styles/HostAllPhotos.module.css';

function HostAllPhotos() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndices, setSelectedIndices] = useState([0]); // Default first selected like in user's UI
  const [saving, setSaving] = useState(false);

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        let targetId = id;
        if (!targetId || targetId === 'sample') {
          const allRes = await fetch(`${baseUrl}/listings`);
          const allData = await allRes.json();
          if (allData.success && Array.isArray(allData.data) && allData.data.length > 0) {
            targetId = allData.data[0].id;
          }
        }

        if (targetId) {
          const res = await fetch(`${baseUrl}/listings/${targetId}`);
          const data = await res.json();
          if (data.success && data.data) {
            const item = data.data;
            const parsedPhotos = Array.isArray(item.photos) && item.photos.length > 0
              ? item.photos
              : (item.cover_img ? [item.cover_img] : []);
            setListing({
              ...item,
              photos: parsedPhotos,
              cover_img: item.cover_img || parsedPhotos[0] || ''
            });
            // Do not preselect by default so user sees clean photos
            setSelectedIndices([]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch listing photos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  // Toggle selection for a photo card
  const toggleSelect = (index) => {
    setSelectedIndices(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  // Deselect All
  const handleDeselectAll = () => {
    setSelectedIndices([]);
  };

  // Select All
  const handleSelectAll = () => {
    if (!listing?.photos) return;
    setSelectedIndices(listing.photos.map((_, i) => i));
  };

  // Set as Cover photo (optimistic + instant response)
  const handleSetAsCover = async () => {
    if (!listing?.id || selectedIndices.length !== 1) return;
    const targetCoverIndex = selectedIndices[0];
    const newCover = listing.photos[targetCoverIndex];
    if (!newCover) return;

    // Previous backup state in case fetch fails
    const prevListing = { ...listing };
    const remaining = listing.photos.filter((_, idx) => idx !== targetCoverIndex);
    const reorderedPhotos = [newCover, ...remaining];

    // Optimistically update immediately for super-fast user experience
    setListing(prev => ({
      ...prev,
      cover_img: newCover,
      photos: reorderedPhotos
    }));
    // Deselect after setting as cover so buttons reset
    setSelectedIndices([]);

    try {
      setSaving(true);
      const res = await fetch(`${baseUrl}/listings/${listing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cover_img: newCover,
          photos: reorderedPhotos
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Cover photo updated successfully');
      } else {
        // Rollback if server responded error
        setListing(prevListing);
        toast.error(data.message || 'Failed to update cover photo');
      }
    } catch (err) {
      console.error('Failed to set cover photo:', err);
      setListing(prevListing);
      toast.error('Failed to update cover photo');
    } finally {
      setSaving(false);
    }
  };

  // Delete selected photos from backend
  const handleDeleteSelected = async () => {
    if (!listing?.id || selectedIndices.length === 0) return;
    if (!window.confirm(`Delete ${selectedIndices.length} selected photo(s)?`)) return;

    try {
      setSaving(true);
      const remainingPhotos = listing.photos.filter((_, idx) => !selectedIndices.includes(idx));
      const updatedPhotos = remainingPhotos;
      const updatedCover = remainingPhotos.includes(listing.cover_img) ? listing.cover_img : (remainingPhotos[0] || '');

      const res = await fetch(`${baseUrl}/listings/${listing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photos: updatedPhotos,
          cover_img: updatedCover
        })
      });
      const data = await res.json();
      if (data.success) {
        setListing(prev => ({
          ...prev,
          photos: updatedPhotos,
          cover_img: updatedCover
        }));
        setSelectedIndices(updatedPhotos.length > 0 ? [0] : []);
        toast.success('Selected photos deleted');
      }
    } catch (err) {
      console.error('Failed to delete photos:', err);
      toast.error('Failed to delete photos');
    } finally {
      setSaving(false);
    }
  };

  const photosList = listing?.photos || [];

  return (
    <div className={styles.container}>
      {/* Top Navbar */}
      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <button 
            type="button" 
            className={styles.backBtn}
            onClick={() => navigate(id ? `/hosting/listing-editor/${id}` : '/hosting/listing-editor')}
            title="Back to listing editor"
          >
            <FaArrowLeft size={14} />
          </button>
          {selectedIndices.length > 0 ? (
            <button 
              type="button" 
              className={styles.deselectPillBtn}
              onClick={handleDeselectAll}
            >
              Deselect
            </button>
          ) : (
            <button 
              type="button" 
              className={styles.deselectPillBtn}
              onClick={handleSelectAll}
            >
              Select all
            </button>
          )}
        </div>

        {/* Center Title Counter */}
        <div className={styles.headerCenter}>
          <h2 className={styles.selectedCountText}>
            {selectedIndices.length} selected
          </h2>
        </div>

        {/* Right Action Buttons */}
        <div className={styles.headerRight}>
          {selectedIndices.length === 1 && (
            <button 
              type="button" 
              className={styles.actionPillBtn}
              onClick={handleSetAsCover}
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Set as cover'}
            </button>
          )}
          <button 
            type="button" 
            className={styles.iconActionBtn}
            onClick={handleDeleteSelected}
            disabled={selectedIndices.length === 0 || saving}
            title="Delete selected"
          >
            <FaTrash size={14} />
          </button>
        </div>
      </header>

      {/* Main Grid View */}
      <main className={styles.mainContent}>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading photos...</span>
            </div>
          </div>
        ) : photosList.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <h3>No photos available</h3>
          </div>
        ) : (
          <div className={styles.photoGrid}>
            {photosList.map((photoUrl, index) => {
              const isSelected = selectedIndices.includes(index);
              const isCover = listing?.cover_img ? listing.cover_img === photoUrl : index === 0;

              return (
                <div 
                  key={index} 
                  className={`${styles.cardWrapper} ${isSelected ? styles.cardSelected : ''}`}
                  onClick={() => toggleSelect(index)}
                >
                  <div className={styles.imageInner}>
                    <img 
                      src={photoUrl} 
                      alt={`Photo ${index + 1}`} 
                      className={styles.photoImg}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />

                    {/* Top Left Status Badge */}
                    <div className={styles.badgeNotApproved}>
                      <span className={styles.redDot}></span>
                      {isCover ? 'Cover photo' : 'Not approved'}
                    </div>

                    {/* Checkmark circle on top right when selected */}
                    {isSelected && (
                      <div className={styles.checkmarkCircle}>
                        <FaCheck size={11} color="#222222" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default HostAllPhotos;
