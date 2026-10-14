import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaAirbnb, FaSnowflake, FaThermometerHalf, FaHotTub, FaTv, FaWifi,
  FaSwimmer, FaCar, FaFireExtinguisher, FaFirstAid, FaUmbrellaBeach, FaFire, FaTree, FaVideo, FaMapMarkedAlt, FaCamera, FaPlus, FaImages, FaTrash,
  FaSpa, FaStar, FaUsers, FaPaintBrush, FaExpandArrowsAlt
} from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import { MdOutlineCleaningServices, MdKitchen, MdLocalLaundryService, MdOutlineWash } from 'react-icons/md';
import { TbFridge } from 'react-icons/tb';
import styles from '../../components/styles/HostStep1.module.css';

const basicAmenities = [
  { id: 'ac', label: 'Air conditioning', icon: <FaSnowflake /> },
  { id: 'essentials', label: 'Essentials', sublabel: 'Towels, bed sheets, soap and toilet paper', icon: <MdOutlineCleaningServices /> },
  { id: 'fridge', label: 'Fridge', icon: <TbFridge /> },
  { id: 'heating', label: 'Heating', icon: <FaThermometerHalf /> },
  { id: 'hot_water', label: 'Hot water', icon: <FaHotTub /> },
  { id: 'kitchen', label: 'Kitchen', icon: <MdKitchen /> },
  { id: 'tv', label: 'TV', icon: <FaTv /> },
  { id: 'dryer', label: 'Tumble dryer', icon: <MdLocalLaundryService /> },
  { id: 'washing_machine', label: 'Washing machine', icon: <MdOutlineWash /> },
  { id: 'wifi', label: 'Wifi', icon: <FaWifi /> },
];

const standoutAmenities = [
  { id: 'pool', label: 'Pool', icon: <FaSwimmer /> },
  { id: 'hottub', label: 'Hot tub', icon: <FaHotTub /> },
  { id: 'patio', label: 'Patio', icon: <FaTree /> },
  { id: 'bbq', label: 'BBQ grill', icon: <FaFire /> },
  { id: 'outdoor_dining', label: 'Outdoor dining area', icon: <FaUmbrellaBeach /> },
  { id: 'firepit', label: 'Fire pit', icon: <FaFire /> },
  { id: 'parking', label: 'Free parking on premises', icon: <FaCar /> },
];

const locationAmenities = [
  { id: 'beachfront', label: 'Beachfront', icon: <FaUmbrellaBeach /> },
  { id: 'waterfront', label: 'Waterfront', icon: <FaMapMarkedAlt /> },
  { id: 'ski_in', label: 'Ski-in/ski-out', icon: <FaSnowflake /> },
];

const safetyAmenities = [
  { id: 'smoke_alarm', label: 'Smoke alarm', icon: <FaFireExtinguisher /> },
  { id: 'first_aid', label: 'First aid kit', icon: <FaFirstAid /> },
  { id: 'fire_extinguisher', label: 'Fire extinguisher', icon: <FaFireExtinguisher /> },
  { id: 'carbon_monoxide', label: 'Carbon monoxide alarm', icon: <FaFireExtinguisher /> },
];

const highlightsData = [
  { id: 'peaceful', label: 'Peaceful', icon: <FaSpa /> },
  { id: 'unique', label: 'Unique', icon: <FaStar /> },
  { id: 'family-friendly', label: 'Family-friendly', icon: <FaUsers /> },
  { id: 'stylish', label: 'Stylish', icon: <FaPaintBrush /> },
  { id: 'central', label: 'Central', icon: <FaMapMarkedAlt /> },
  { id: 'spacious', label: 'Spacious', icon: <FaExpandArrowsAlt /> }
];

export default function HostStep2() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  
  // Step 3 state
  const [photos, setPhotos] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [pendingPhotos, setPendingPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [photoToEdit, setPhotoToEdit] = useState(null);
  const [title, setTitle] = useState('');
  const [selectedHighlights, setSelectedHighlights] = useState([]);
  const [description, setDescription] = useState('Have fun with the whole family at this stylish place.');
  const fileInputRef = useRef(null);

  const toggleHighlight = (id) => {
    setSelectedHighlights(prev => {
      if (prev.includes(id)) {
        return prev.filter(h => h !== id);
      } else {
        if (prev.length < 2) return [...prev, id];
        return prev;
      }
    });
  };

  const toggleAmenity = (id) => {
    setSelectedAmenities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newPhotos = newFiles.map(file => URL.createObjectURL(file));
      setPendingPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const handleAddPhotosClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const removePendingPhoto = (index) => {
    setPendingPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = () => {
    setIsUploading(true);
    setTimeout(() => {
      setPhotos(prev => [...prev, ...pendingPhotos]);
      setPendingPhotos([]);
      setIsUploading(false);
      setIsUploadModalOpen(false);
    }, 2000);
  };

  const closeUploadModal = () => {
    if (!isUploading) {
      setIsUploadModalOpen(false);
      setPendingPhotos([]);
    }
  };

  const confirmDeletePhoto = () => {
    if (photoToDelete !== null) {
      setPhotos(prev => prev.filter((_, i) => i !== photoToDelete));
      setActiveMenuIndex(null);
      setPhotoToDelete(null);
    }
  };

  const movePhotoBackwards = (index) => {
    if (index > 0) {
      setPhotos(prev => {
        const newPhotos = [...prev];
        const temp = newPhotos[index - 1];
        newPhotos[index - 1] = newPhotos[index];
        newPhotos[index] = temp;
        return newPhotos;
      });
      setActiveMenuIndex(null);
    }
  };

  const movePhotoForwards = (index) => {
    if (index < photos.length - 1) {
      setPhotos(prev => {
        const newPhotos = [...prev];
        const temp = newPhotos[index + 1];
        newPhotos[index + 1] = newPhotos[index];
        newPhotos[index] = temp;
        return newPhotos;
      });
      setActiveMenuIndex(null);
    }
  };

  const makeCoverPhoto = (index) => {
    if (index > 0) {
      setPhotos(prev => {
        const newPhotos = [...prev];
        const [photo] = newPhotos.splice(index, 1);
        newPhotos.unshift(photo);
        return newPhotos;
      });
      setActiveMenuIndex(null);
    }
  };

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) setStep(4);
    else if (step === 4) setStep(5);
    else if (step === 5) setStep(6);
    else navigate('/step3');
  };

  const handleBack = () => {
    if (step === 6) setStep(5);
    else if (step === 5) setStep(4);
    else if (step === 4) setStep(3);
    else if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
    else navigate('/step1');
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <NavLink to="/" className={styles.logoLink}>
          <FaAirbnb size={32} color="#222222" />
        </NavLink>
        <div className={styles.headerRight}>
          <button className={styles.questionsBtn}>Questions?</button>
          <button className={styles.saveExitBtn}>Save & exit</button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className={styles.mainContent}>
        {step === 1 ? (
          <div className="container" style={{ height: 'calc(100vh - 180px)' }}>
            <div className="row h-100 align-items-center">
              
              {/* Left Column - Text */}
              <div className="col-12 col-md-6 d-flex flex-column justify-content-center pe-md-5 mb-5 mb-md-0">
                <span className={styles.stepText}>Step 2</span>
                <h1 className={styles.title}>
                  Make your place stand out
                </h1>
                <p className={styles.description}>
                  In this step, you'll add some of the amenities your place offers, plus 5 or more photos. Then you'll create a title and description.
                </p>
              </div>
              
              {/* Right Column - Image */}
              <div className="col-12 col-md-6 d-flex justify-content-center">
                <div className={styles.imageContainer}>
                  {/* using the video for the 3D apartment */}
                  <video 
                    src="/host-intro.mp4" 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    className={styles.illustration}
                  />
                </div>
              </div>
              
            </div>
          </div>
        ) : step === 2 ? (
          <div className={styles.step2Container}>
            <h1 className={styles.step2Title} style={{ marginBottom: '8px' }}>Tell guests which amenities they'll find at your place</h1>
            <p className={styles.mapSubtitle}>You can add more amenities after you publish your listing.</p>
            
            <div className={styles.sectionTitle}>Basics</div>
            <div className={styles.gridContainer}>
              {basicAmenities.map((amenity) => (
                <div 
                  key={amenity.id}
                  className={`${styles.typeCard} ${selectedAmenities.includes(amenity.id) ? styles.typeCardSelected : ''}`}
                  onClick={() => toggleAmenity(amenity.id)}
                  style={{ height: 'auto', minHeight: '100px' }}
                >
                  <div className={styles.typeIcon}>{amenity.icon}</div>
                  <div className={styles.typeLabel}>{amenity.label}</div>
                  {amenity.sublabel && <div className={styles.typeSublabel}>{amenity.sublabel}</div>}
                </div>
              ))}
            </div>

            <div className={styles.sectionTitle}>Standout amenities (Features/Popular)</div>
            <div className={styles.gridContainer}>
              {standoutAmenities.map((amenity) => (
                <div 
                  key={amenity.id}
                  className={`${styles.typeCard} ${selectedAmenities.includes(amenity.id) ? styles.typeCardSelected : ''}`}
                  onClick={() => toggleAmenity(amenity.id)}
                  style={{ height: 'auto', minHeight: '100px' }}
                >
                  <div className={styles.typeIcon}>{amenity.icon}</div>
                  <div className={styles.typeLabel}>{amenity.label}</div>
                  {amenity.sublabel && <div className={styles.typeSublabel}>{amenity.sublabel}</div>}
                </div>
              ))}
            </div>

            <div className={styles.sectionTitle}>Location</div>
            <div className={styles.gridContainer}>
              {locationAmenities.map((amenity) => (
                <div 
                  key={amenity.id}
                  className={`${styles.typeCard} ${selectedAmenities.includes(amenity.id) ? styles.typeCardSelected : ''}`}
                  onClick={() => toggleAmenity(amenity.id)}
                  style={{ height: 'auto', minHeight: '100px' }}
                >
                  <div className={styles.typeIcon}>{amenity.icon}</div>
                  <div className={styles.typeLabel}>{amenity.label}</div>
                  {amenity.sublabel && <div className={styles.typeSublabel}>{amenity.sublabel}</div>}
                </div>
              ))}
            </div>

            <div className={styles.sectionTitle}>Safety</div>
            <div className={styles.gridContainer}>
              {safetyAmenities.map((amenity) => (
                <div 
                  key={amenity.id}
                  className={`${styles.typeCard} ${selectedAmenities.includes(amenity.id) ? styles.typeCardSelected : ''}`}
                  onClick={() => toggleAmenity(amenity.id)}
                  style={{ height: 'auto', minHeight: '100px' }}
                >
                  <div className={styles.typeIcon}>{amenity.icon}</div>
                  <div className={styles.typeLabel}>{amenity.label}</div>
                  {amenity.sublabel && <div className={styles.typeSublabel}>{amenity.sublabel}</div>}
                </div>
              ))}
            </div>
          </div>
        ) : step === 3 ? (
          <>
            {photos.length === 0 ? (
              <div className={styles.step6Container}>
                <h1 className={styles.step2Title} style={{ marginBottom: '8px' }}>Add some photos of your house</h1>
                <p className={styles.mapSubtitle}>You'll need 5 photos to get started. You can add more or make changes later.</p>

                <div className={styles.photoUploadBox} onClick={handleAddPhotosClick} style={{ cursor: 'pointer' }}>
                  <FaCamera className={styles.photoUploadIcon} />
                  <button className={styles.addPhotosBtn}>Add photos</button>
                </div>
              </div>
            ) : (
              <div className={styles.tadaContainer}>
                <div className={styles.tadaHeader}>
                  <div>
                    <h1 className={styles.step2Title} style={{ marginBottom: '8px' }}>Ta-da! How does this look?</h1>
                    <p className={styles.mapSubtitle} style={{ marginBottom: 0 }}>Drag to reorder</p>
                  </div>
                  <button className={styles.tadaPlusBtn} onClick={handleAddPhotosClick}>
                    <FaPlus size={16} color="#222" />
                  </button>
                </div>

                <div className={styles.photosGrid}>
                  {/* Cover Photo */}
                  {photos.length > 0 && (
                    <div className={styles.coverPhoto}>
                      <img src={photos[0]} alt="Cover" className={styles.coverPhotoImg} />
                      <div className={styles.coverPill}>Cover Photo</div>
                      <button className={styles.photoMenuBtn} onClick={() => setActiveMenuIndex(activeMenuIndex === 0 ? null : 0)}>
                        <BsThreeDots />
                      </button>
                      
                      {activeMenuIndex === 0 && (
                        <div className={styles.photoDropdown}>
                          <div className={styles.photoDropdownItem} onClick={() => { setPhotoToEdit(0); setActiveMenuIndex(null); }}>Edit</div>
                          {photos.length > 1 && (
                            <div className={styles.photoDropdownItem} onClick={() => movePhotoForwards(0)}>Move forwards</div>
                          )}
                          <div className={styles.photoDropdownItem} onClick={() => { setPhotoToDelete(0); setActiveMenuIndex(null); }}>Delete</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Smaller Photos */}
                  {photos.length > 1 && (
                    <div className={styles.smallPhotosGrid}>
                      {photos.slice(1).map((photo, idx) => {
                        const index = idx + 1;
                        return (
                          <div key={index} className={styles.smallPhoto}>
                            <img src={photo} alt={`Photo ${index}`} className={styles.smallPhotoImg} />
                            <button className={styles.photoMenuBtn} onClick={() => setActiveMenuIndex(activeMenuIndex === index ? null : index)}>
                              <BsThreeDots />
                            </button>
                            
                            {activeMenuIndex === index && (
                              <div className={styles.photoDropdown}>
                                <div className={styles.photoDropdownItem} onClick={() => { setPhotoToEdit(index); setActiveMenuIndex(null); }}>Edit</div>
                                <div className={styles.photoDropdownItem} onClick={() => movePhotoBackwards(index)}>Move backwards</div>
                                {index < photos.length - 1 && (
                                  <div className={styles.photoDropdownItem} onClick={() => movePhotoForwards(index)}>Move forwards</div>
                                )}
                                <div className={styles.photoDropdownItem} onClick={() => makeCoverPhoto(index)}>Make cover photo</div>
                                <div className={styles.photoDropdownItem} onClick={() => { setPhotoToDelete(index); setActiveMenuIndex(null); }}>Delete</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      
                      <div className={styles.addMoreBox} onClick={handleAddPhotosClick}>
                        <FaPlus className={styles.addMoreIcon} />
                        <div style={{ fontSize: '16px', fontWeight: 600, color: '#222' }}>Add more</div>
                      </div>
                    </div>
                  )}
                  
                  {photos.length === 1 && (
                    <div className={styles.smallPhotosGrid}>
                      <div className={styles.addMoreBox} onClick={handleAddPhotosClick}>
                        <FaPlus className={styles.addMoreIcon} />
                        <div style={{ fontSize: '16px', fontWeight: 600, color: '#222' }}>Add more</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Hidden File Input */}
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange} 
            />

            {/* Upload Modal */}
            {isUploadModalOpen && (
              <div className={styles.uploadOverlay}>
                <div className={styles.uploadModal}>
                  <div className={styles.uploadModalHeader}>
                    <button className={styles.closeBtn} style={{ position: 'static', padding: '4px' }} onClick={closeUploadModal} disabled={isUploading}>
                      <IoMdClose size={20} />
                    </button>
                    <div className={styles.uploadModalTitle}>
                      Upload photos
                      <span className={styles.uploadModalSubtitle}>
                        {isUploading ? `0 of ${pendingPhotos.length} items uploaded` : pendingPhotos.length === 0 ? 'No items selected' : `${pendingPhotos.length} items selected`}
                      </span>
                    </div>
                    <button className={styles.closeBtn} style={{ position: 'static', padding: '4px', visibility: 'hidden' }}>
                      <IoMdClose size={20} />
                    </button>
                  </div>
                  
                  {pendingPhotos.length === 0 ? (
                    <div className={styles.uploadModalBody}>
                      <div className={styles.uploadDragBox}>
                        <FaImages className={styles.uploadDragIcon} />
                        <div className={styles.uploadDragTitle}>Drag and drop</div>
                        <div className={styles.uploadDragSub}>or browse for photos</div>
                        <button className={styles.uploadBrowseBtn} onClick={handleBrowseClick}>Browse</button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.uploadModalBodyGrid}>
                      {pendingPhotos.map((photo, i) => (
                        <div key={i} className={styles.uploadPreviewWrap}>
                          <img src={photo} alt="Preview" className={styles.uploadPreviewImg} />
                          {!isUploading && (
                            <button className={styles.uploadDeleteBtn} onClick={() => removePendingPhoto(i)}>
                              <FaTrash size={12} />
                            </button>
                          )}
                          {isUploading && (
                            <div className={styles.uploadOverlayDark}>
                              <div className={styles.uploadSpinner}></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className={styles.uploadModalFooter}>
                    {pendingPhotos.length === 0 ? (
                      <>
                        <span style={{ fontSize: '16px', fontWeight: 600 }}>Done</span>
                        <button className={styles.uploadDoneBtn} disabled>Upload</button>
                      </>
                    ) : (
                      <>
                        <button className={styles.uploadCancelBtn} onClick={closeUploadModal} disabled={isUploading}>Cancel</button>
                        <button 
                          className={isUploading ? styles.uploadDoneBtnActive : styles.uploadDoneBtnActive} 
                          onClick={handleUploadSubmit}
                          disabled={isUploading}
                        >
                          {isUploading ? '...' : 'Upload'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Delete Photo Modal */}
            {photoToDelete !== null && (
              <div className={styles.deleteModalOverlay}>
                <div className={styles.deleteModal}>
                  <div className={styles.deleteModalHeader}>
                    <div style={{ width: '32px' }}></div> {/* Spacer */}
                    <h2 className={styles.deleteModalTitle}>Delete this photo?</h2>
                    <button className={styles.closeBtn} style={{ position: 'static' }} onClick={() => setPhotoToDelete(null)}>
                      <IoMdClose />
                    </button>
                  </div>
                  <div className={styles.deleteModalBody}>
                    Once you delete it, you can't get it back.
                  </div>
                  <div className={styles.deleteModalFooter}>
                    <button className={styles.deleteCancelBtn} onClick={() => setPhotoToDelete(null)}>Cancel</button>
                    <button className={styles.deleteConfirmBtn} onClick={confirmDeletePhoto}>Delete it</button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Photo Modal */}
            {photoToEdit !== null && (
              <div className={styles.editModalOverlay}>
                <div className={styles.editModal}>
                  <div className={styles.editModalHeader}>
                    <div style={{ width: '32px' }}></div> {/* Spacer */}
                    <h2 className={styles.editModalTitle}>Edit photo</h2>
                    <button className={styles.closeBtn} style={{ position: 'static', padding: '4px' }} onClick={() => setPhotoToEdit(null)}>
                      <IoMdClose size={20} />
                    </button>
                  </div>
                  
                  <div className={styles.editModalBody}>
                    <div className={styles.editModalImgWrap}>
                      <img src={photos[photoToEdit]} alt="Edit Preview" className={styles.editModalImg} />
                    </div>
                    <div className={styles.editModalRight}>
                      <div className={styles.editModalLabel}>Caption</div>
                      <div className={styles.editModalDesc}>
                        Mention what's special about this space like comfortable furniture or favourite details.
                      </div>
                      <textarea className={styles.editModalTextarea}></textarea>
                    </div>
                  </div>

                  <div className={styles.editModalFooter}>
                    <button 
                      className={styles.editModalDeleteBtn} 
                      onClick={() => {
                        setPhotoToDelete(photoToEdit);
                        setPhotoToEdit(null);
                      }}
                    >
                      Delete photo
                    </button>
                    <button className={styles.editModalSaveBtn} onClick={() => setPhotoToEdit(null)}>Save</button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : step === 4 ? (
          <div className={styles.step6Container}>
            <h1 className={styles.step2Title} style={{ marginBottom: '8px', textAlign: 'left' }}>Now, let's give your house a title</h1>
            <p className={styles.mapSubtitle}>Short titles work best. Have fun with it — you can always change it later.</p>
            
            <textarea 
              className={styles.titleTextarea}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={50}
            ></textarea>
            <div className={styles.charCount}>
              {title.length}/50
            </div>
          </div>
        ) : step === 5 ? (
          <div className={styles.highlightsContainer}>
            <h1 className={styles.step2Title} style={{ marginBottom: '8px' }}>Next, let's describe your house</h1>
            <p className={styles.mapSubtitle} style={{ textAlign: 'center' }}>Choose up to 2 highlights. We'll use these to get your description started.</p>
            
            <div className={styles.highlightsGrid}>
              {highlightsData.map((h) => (
                <div 
                  key={h.id}
                  className={`${styles.highlightPill} ${selectedHighlights.includes(h.id) ? styles.highlightPillSelected : ''}`}
                  onClick={() => toggleHighlight(h.id)}
                >
                  <span className={styles.highlightIcon}>{h.icon}</span>
                  <span>{h.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : step === 6 ? (
          <div className={styles.titleContainer}>
            <h1 className={styles.step2Title} style={{ marginBottom: '8px', textAlign: 'left' }}>Create your description</h1>
            <p className={styles.mapSubtitle}>Share what makes your place special.</p>
            
            <textarea 
              className={styles.titleTextarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              style={{ height: '250px', fontSize: '18px', fontWeight: 400 }}
            ></textarea>
            <div className={styles.charCount}>
              {description.length}/500
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.progressBar}>
          <div className={styles.progressSegment}>
            <div className={styles.progressFill} style={{ width: '100%' }}></div>
          </div>
          <div className={styles.progressSegment}>
            <div className={styles.progressFill} style={{ width: step === 1 ? '10%' : step === 2 ? '30%' : step === 3 ? '50%' : step === 4 ? '70%' : step === 5 ? '85%' : '100%' }}></div>
          </div>
          <div className={styles.progressSegment}>
            <div className={styles.progressFill} style={{ width: '0%' }}></div>
          </div>
        </div>
        <div className={styles.footerContent}>
          <button className={styles.backBtn} onClick={handleBack}>Back</button>
          <button 
            className={`${styles.nextBtn} ${(step === 2 && selectedAmenities.length === 0) || (step === 3 && photos.length < 5) || (step === 4 && title.trim().length === 0) || (step === 5 && selectedHighlights.length === 0) || (step === 6 && description.trim().length === 0) ? styles.disabledBtn : ''}`} 
            onClick={handleNext}
            disabled={(step === 2 && selectedAmenities.length === 0) || (step === 3 && photos.length < 5) || (step === 4 && title.trim().length === 0) || (step === 5 && selectedHighlights.length === 0) || (step === 6 && description.trim().length === 0)}
          >
            Next
          </button>
        </div>
      </footer>
    </div>
  );
}
