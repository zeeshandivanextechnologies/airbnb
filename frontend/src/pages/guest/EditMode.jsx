import React, { useState, useEffect, useRef } from "react";
import styles from "../../components/styles/EditMode.module.css";
import {
  FaCamera,
  FaGraduationCap,
  FaBriefcase,
  FaMusic,
  FaClock,
  FaHeart,
  FaGlobeAmericas,
  FaPlane,
  FaSuitcase,
  FaRedo,
} from "react-icons/fa";
import { BiBookOpen, BiBulb } from "react-icons/bi";
import { MdPets, MdLanguage } from "react-icons/md";
import { FiGlobe, FiSun } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTree, FaUtensils, FaCoffee, FaFilm, FaHamburger, FaLandmark, FaWalking, FaShoppingBag, FaPaw, FaBook, FaMountain, FaWineGlass, FaDumbbell, FaSwimmer } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser, updateAvatar } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../utils/cropImage';

function EditMode() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: authUser, token } = useSelector((state) => state.auth);

  const [isSticky, setIsSticky] = useState(true);
  const [modalData, setModalData] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [answers, setAnswers] = useState({});
  const [aboutMe, setAboutMe] = useState("");
  const [isStampsEnabled, setIsStampsEnabled] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [tempInterests, setTempInterests] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isCropMode, setIsCropMode] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const sentinelRef = useRef(null);

  const interestsList = [
    { id: 'outdoors', label: 'Outdoors', icon: <FaTree /> },
    { id: 'food', label: 'Food scene', icon: <FaUtensils /> },
    { id: 'music', label: 'Live music', icon: <FaMusic /> },
    { id: 'photography', label: 'Photography', icon: <FaCamera /> },
    { id: 'coffee', label: 'Coffee', icon: <FaCoffee /> },
    { id: 'films', label: 'Films', icon: <FaFilm /> },
    { id: 'cooking', label: 'Cooking', icon: <FaHamburger /> },
    { id: 'culture', label: 'Local culture', icon: <FaLandmark /> },
    { id: 'walking', label: 'Walking', icon: <FaWalking /> },
    { id: 'shopping', label: 'Shopping', icon: <FaShoppingBag /> },
    { id: 'animals', label: 'Animals', icon: <FaPaw /> },
    { id: 'reading', label: 'Reading', icon: <FaBook /> },
    { id: 'hiking', label: 'Hiking', icon: <FaMountain /> },
    { id: 'wine', label: 'Wine', icon: <FaWineGlass /> },
    { id: 'fitness', label: 'Fitness', icon: <FaDumbbell /> },
    { id: 'swimming', label: 'Swimming', icon: <FaSwimmer /> },
  ];

  const profileCards = [
    {
      id: "school",
      title: "Where I went to school",
      icon: <FaGraduationCap />,
      modalTitle: "Where did you go to school?",
      modalDesc:
        "Whether it's home school, secondary school or trade school, name the school that made you who you are.",
      placeholder: "Where I went to school:",
    },
    {
      id: "destination",
      title: "Where I've always wanted to go",
      icon: <FaGlobeAmericas />,
      modalTitle: "Where have you always wanted to go?",
      modalDesc:
        "Share the destinations that are at the top of your bucket list.",
      placeholder: "Where I've always wanted to go:",
    },
    {
      id: "work",
      title: "My work",
      icon: <FaBriefcase />,
      modalTitle: "What is your profession?",
      modalDesc: "Tell us what you do for a living.",
      placeholder: "My work:",
    },
    {
      id: "pets",
      title: "Pets",
      icon: <MdPets />,
      modalTitle: "Do you have any pets?",
      modalDesc: "Share the pets you have in your home.",
      placeholder: "Pets:",
    },
    {
      id: "decade",
      title: "Decade I was born",
      icon: <BiBulb />,
      modalTitle: "Which decade were you born in?",
      modalDesc: "Share the decade you were born in.",
      placeholder: "Decade I was born:",
    },
    {
      id: "uselessSkill",
      title: "My most useless skill",
      icon: <FaGraduationCap />,
      modalTitle: "What is your most useless skill?",
      modalDesc: "Share a fun, useless skill you have.",
      placeholder: "My most useless skill:",
    },
    {
      id: "song",
      title: "My favourite song in secondary school",
      icon: <FaMusic />,
      modalTitle: "What was your favourite song in secondary school?",
      modalDesc: "Share the song that defined your secondary school years.",
      placeholder: "My favourite song in secondary school:",
    },
    {
      id: "funFact",
      title: "My fun fact",
      icon: <BiBulb />,
      modalTitle: "What is a fun fact about you?",
      modalDesc: "Share an interesting fact about yourself.",
      placeholder: "My fun fact:",
    },
    {
      id: "time",
      title: "I spend too much time",
      icon: <FaClock />,
      modalTitle: "What do you spend too much time doing?",
      modalDesc: "Share an activity you spend a lot of time on.",
      placeholder: "I spend too much time:",
    },
    {
      id: "languages",
      title: "Languages I speak",
      icon: <MdLanguage />,
      modalTitle: "What languages do you speak?",
      modalDesc: "Share the languages you are fluent or conversational in.",
      placeholder: "Languages I speak:",
    },
    {
      id: "obsessed",
      title: "I'm obsessed with",
      icon: <FaHeart />,
      modalTitle: "What are you obsessed with?",
      modalDesc: "Share something you absolutely love.",
      placeholder: "I'm obsessed with:",
    },
    {
      id: "biography",
      title: "My biography title would be",
      icon: <BiBookOpen />,
      modalTitle: "What would your biography title be?",
      modalDesc:
        "If someone wrote a book about your life, what would it be called?",
      placeholder: "My biography title would be:",
    },
    {
      id: "live",
      title: "Where I live",
      icon: <FaGlobeAmericas />,
      modalTitle: "Where do you live?",
      modalDesc: "Share the city or area you currently live in.",
      placeholder: "Where I live:",
    },
  ];

  // Get active user from Redux or localStorage
  const activeUser = authUser || (() => {
    try {
      const saved = localStorage.getItem('airbnb_user_auth');
      return saved ? JSON.parse(saved)?.user : null;
    } catch (e) {
      return null;
    }
  })();

  const activeToken = token || (() => {
    try {
      const saved = localStorage.getItem('airbnb_user_auth');
      return saved ? JSON.parse(saved)?.token : null;
    } catch (e) {
      return null;
    }
  })();

  // Fetch initial profile data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const headers = {};
        if (activeToken) headers['Authorization'] = `Bearer ${activeToken}`;

        const targetId = activeUser?.id;
        const targetEmail = activeUser?.email;
        const url = targetId
          ? `http://localhost:5000/api/auth/profile?id=${targetId}`
          : targetEmail
          ? `http://localhost:5000/api/auth/profile?email=${encodeURIComponent(targetEmail)}`
          : 'http://localhost:5000/api/auth/profile';

        const res = await fetch(url, { headers });
        const data = await res.json();

        if (data.success && data.user) {
          const u = data.user;
          if (u.profileAnswers) setAnswers(u.profileAnswers);
          if (u.aboutMe) setAboutMe(u.aboutMe);
          if (u.interests && Array.isArray(u.interests)) setSelectedInterests(u.interests);
          if (u.stampsEnabled !== undefined) setIsStampsEnabled(!!u.stampsEnabled);
          if (u.avatar) setProfileImage(u.avatar);
        }
      } catch (err) {
        console.warn('Error fetching profile for EditMode:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [activeUser?.id, activeUser?.email, activeToken]);

  // Helper to persist updates to Backend
  const saveToBackend = async (payload, successMsg = 'Profile updated successfully') => {
    try {
      setIsSaving(true);
      const headers = { 'Content-Type': 'application/json' };
      if (activeToken) headers['Authorization'] = `Bearer ${activeToken}`;

      const bodyData = {
        id: activeUser?.id,
        email: activeUser?.email,
        ...payload
      };

      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers,
        body: JSON.stringify(bodyData)
      });

      const data = await res.json();
      if (data.success) {
        if (payload.avatar) dispatch(updateAvatar(payload.avatar));
        dispatch(updateUser(payload));
        if (successMsg) toast.success(successMsg);
        return true;
      } else {
        toast.error(data.message || 'Failed to save changes');
        return false;
      }
    } catch (err) {
      console.error('Error saving profile changes:', err);
      toast.error('Network error saving changes');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const openModal = (card) => {
    setModalData(card);
    if (card.isInterests) {
      setTempInterests([...selectedInterests]);
    } else if (card.id === 'aboutMe') {
      setInputValue(aboutMe || "");
    } else {
      setInputValue(answers[card.id] || "");
    }
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalData(null);
    setInputValue("");
    document.body.style.overflow = "unset";
  };

  const handleSave = async () => {
    if (!modalData) return;

    if (modalData.isInterests) {
      setSelectedInterests(tempInterests);
      await saveToBackend({ interests: tempInterests }, 'Interests updated!');
    } else if (modalData.id === 'aboutMe') {
      setAboutMe(inputValue);
      await saveToBackend({ aboutMe: inputValue }, 'About me updated!');
    } else {
      const updatedAnswers = { ...answers, [modalData.id]: inputValue };
      setAnswers(updatedAnswers);
      await saveToBackend({ profileAnswers: updatedAnswers }, `${modalData.title} updated!`);
    }
    closeModal();
  };

  const handleToggleStamps = async (e) => {
    const val = e.target.checked;
    setIsStampsEnabled(val);
    await saveToBackend({ stampsEnabled: val }, val ? 'Travel stamps enabled' : 'Travel stamps hidden');
  };

  const fileInputRef = useRef(null);
  const [showTipsModal, setShowTipsModal] = useState(false);

  // Lock page scrolling when Photo Preview Modal is open
  useEffect(() => {
    if (previewImage) {
      document.body.style.overflow = "hidden";
    } else if (!modalData) {
      document.body.style.overflow = "unset";
    }
    return () => {
      if (!modalData) {
        document.body.style.overflow = "unset";
      }
    };
  }, [previewImage, modalData]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setIsCropMode(false);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
      };
      reader.readAsDataURL(file);
    }
    // reset input value so re-selecting same file works
    e.target.value = null;
  };

  const closePreviewModal = () => {
    setPreviewImage(null);
    setShowTipsModal(false);
    setIsCropMode(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleApplyCrop = async () => {
    try {
      if (!previewImage || !croppedAreaPixels) return;
      const croppedImage = await getCroppedImg(previewImage, croppedAreaPixels, rotation);
      setPreviewImage(croppedImage);
      setIsCropMode(false);
      toast.success('Photo adjusted successfully!');
    } catch (err) {
      console.error('Error cropping image:', err);
      toast.error('Could not crop image');
    }
  };

  const handleImageSubmit = async () => {
    if (previewImage) {
      let finalImage = previewImage;
      if (isCropMode && croppedAreaPixels) {
        try {
          finalImage = await getCroppedImg(previewImage, croppedAreaPixels, rotation);
        } catch (e) {}
      }
      setProfileImage(finalImage);
      await saveToBackend({ avatar: finalImage }, 'Profile picture updated!');
      closePreviewModal();
    }
  };

  const triggerChangePhoto = () => {
    setIsCropMode(true);
  };

  const userInitial = authUser?.firstName ? authUser.firstName[0].toUpperCase() : 'M';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current);
    };
  }, []);

  return (
    <div className={styles.emWrapper}>
      <div className="container">
        <div className="row">
          {/* Sticky Left Sidebar */}
          <div className="col-md-4">
            <div className={styles.stickyAvatar}>
              <div className={styles.avatarCircle}>
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className={styles.uploadedAvatar} />
                ) : (
                  userInitial
                )}
                <label className={styles.addPhotoBtn}>
                  <FaCamera /> {profileImage ? 'Edit' : 'Add'}
                  <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Scrollable Right Content */}
          <div className=" col-md-8">
            {/* My Profile */}
            <div className={styles.sectionBlock}>
              <h2 className={styles.sectionTitle}>My profile</h2>
              <p className={styles.sectionDesc}>
                Hosts and guests can see your profile and it may appear across
                Airbnb to help us build trust in our community.{" "}
                <a href="#">Learn more</a>
              </p>

              <div className="row">
                {profileCards.map((card) => (
                  <div className="col-md-6" key={card.id}>
                    <div
                      className={styles.infoItem}
                      onClick={() => openModal(card)}
                    >
                      <div className={styles.infoItemIcon}>{card.icon}</div>
                      <div>
                        {answers[card.id] ? (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.85rem",
                                color: "#717171",
                                lineHeight: 1,
                                fontWeight: 400,
                              }}
                            >
                              {card.title}
                            </span>
                            <span
                              style={{
                                color: "#222222",
                                fontSize: "1rem",
                                fontWeight: 500,
                                lineHeight: 1.2,
                              }}
                            >
                              {answers[card.id]}
                            </span>
                          </div>
                        ) : (
                          card.title
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About me */}
            <div className={styles.sectionBlock}>
              <h2 className={styles.sectionTitle}>About me</h2>
              <div
                className={styles.dashedBox}
                onClick={() =>
                  openModal({
                    id: "aboutMe",
                    title: "About me",
                    modalTitle: "About me",
                    modalDesc: "Write something fun and punchy.",
                    placeholder: "About me",
                    isTextArea: true,
                  })
                }
                style={{ cursor: "pointer" }}
              >
                {aboutMe ? (
                  <p
                    style={{
                      color: "#222",
                      whiteSpace: "pre-wrap",
                      marginBottom: 0,
                    }}
                  >
                    {aboutMe}
                  </p>
                ) : (
                  <>
                    <p>Write something fun and punchy.</p>
                    <span
                      style={{
                        textDecoration: "underline",
                        fontWeight: 600,
                        color: "#222",
                      }}
                    >
                      Add intro
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Where I've been */}
            <div className={styles.sectionBlock}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h2 className={styles.sectionTitle}>Where I've been</h2>
                  <p className={`${styles.sectionDesc} mb-0`}>
                    Pick the stamps you want other people to see on your
                    profile.
                  </p>
                </div>
                <label className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={isStampsEnabled}
                    onChange={handleToggleStamps}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>

              <div className={styles.stampsContainer}>
                <div>
                  <div
                    className={`${styles.stampBox} ${isStampsEnabled ? styles.stampBoxActive : ""}`}
                  >
                    <FiGlobe />
                  </div>
                  <div
                    className={`${styles.stampText} ${isStampsEnabled ? styles.stampTextActive : ""}`}
                  >
                    Next destination
                  </div>
                </div>
                <div>
                  <div
                    className={`${styles.stampBox} ${isStampsEnabled ? styles.stampBoxActive : ""}`}
                  >
                    <FiSun />
                  </div>
                  <div
                    className={`${styles.stampText} ${isStampsEnabled ? styles.stampTextActive : ""}`}
                  >
                    Next destination
                  </div>
                </div>
                <div>
                  <div
                    className={`${styles.stampBox} ${isStampsEnabled ? styles.stampBoxActive : ""}`}
                  >
                    <FaPlane />
                  </div>
                  <div
                    className={`${styles.stampText} ${isStampsEnabled ? styles.stampTextActive : ""}`}
                  >
                    Next destination
                  </div>
                </div>
                <div>
                  <div
                    className={`${styles.stampBox} ${isStampsEnabled ? styles.stampBoxActive : ""}`}
                  >
                    <FaSuitcase />
                  </div>
                  <div
                    className={`${styles.stampText} ${isStampsEnabled ? styles.stampTextActive : ""}`}
                  >
                    Next destination
                  </div>
                </div>
              </div>

              <button className={styles.editBtn}>Edit travel stamps</button>
            </div>

            {/* My interests */}
            <div
              className={styles.sectionBlock}
              style={{ borderBottom: "none" }}
            >
              <h2 className={styles.sectionTitle}>My interests</h2>
              <p className={styles.sectionDesc}>
                Find common ground with other guests and hosts by adding
                interests to your profile.
              </p>

              <div 
                className={styles.interestsContainer}
                onClick={() => openModal({
                  isInterests: true,
                  title: 'What are you into?',
                  modalDesc: 'Pick some interests that you enjoy and that you want to show on your profile.'
                })}
                style={{ cursor: 'pointer' }}
              >
                {selectedInterests.length > 0 ? (
                  <div className={styles.interestsGrid} style={{ marginTop: 0, marginBottom: 0 }}>
                    {selectedInterests.map(id => {
                      const interest = interestsList.find(i => i.id === id);
                      if (!interest) return null;
                      return (
                        <div key={interest.id} className={`${styles.interestPill} ${styles.interestPillActive}`} style={{ cursor: 'pointer' }}>
                          {interest.icon}
                          {interest.label}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <>
                    <div className={styles.interestCircle}>+</div>
                    <div className={styles.interestCircle}>+</div>
                    <div className={styles.interestCircle}>+</div>
                  </>
                )}
              </div>
              <button 
                className={styles.editBtn}
                onClick={() => openModal({
                  isInterests: true,
                  title: 'What are you into?',
                  modalDesc: 'Pick some interests that you enjoy and that you want to show on your profile.'
                })}
              >
                Add interests
              </button>
            </div>
          </div>
        </div>
      </div>

      <div ref={sentinelRef} style={{ height: "1px", width: "100%" }}></div>
      {/* Sticky Bottom Footer */}
      <div
        className={`${styles.bottomFooter} ${isSticky ? styles.fullBorder : ""}`}
      >
        <div className="container h-100">
          <div className="row h-100">
            <div className="col-md-4"></div>
            <div
              className={`col-md-8 d-flex justify-content-end align-items-center ${!isSticky ? styles.innerBorder : ""}`}
              style={{ height: "100%" }}
            >
              <NavLink to="/profile" className={styles.doneBtn}>
                Done
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalData && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.modalCloseBtn} onClick={closeModal}>
              ✕
            </button>
            <h2 className={styles.modalTitle}>{modalData.modalTitle || modalData.title}</h2>
            <p className={styles.modalDesc}>{modalData.modalDesc || modalData.desc}</p>

            {modalData.isInterests ? (
              <>
                <div className={styles.interestsGrid}>
                  {interestsList.map(interest => {
                    const isSelected = tempInterests.includes(interest.id);
                    return (
                      <button 
                        key={interest.id}
                        className={`${styles.interestPill} ${isSelected ? styles.interestPillActive : ''}`}
                        onClick={() => {
                          if (isSelected) {
                            setTempInterests(tempInterests.filter(i => i !== interest.id));
                          } else if (tempInterests.length < 20) {
                            setTempInterests([...tempInterests, interest.id]);
                          }
                        }}
                      >
                        {interest.icon}
                        {interest.label}
                      </button>
                    );
                  })}
                </div>
                <div className={styles.modalFooterInterests}>
                  <div className={styles.modalFooterInterestsCount}>{tempInterests.length}/20 selected</div>
                  <button className={styles.modalSaveBtn} onClick={handleSave}>Save</button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.modalInputContainer}>
                  {modalData.isTextArea ? (
                    <textarea
                      className={styles.modalTextarea}
                      placeholder={modalData.placeholder}
                      maxLength={450}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      rows={5}
                    />
                  ) : (
                    <input
                      type="text"
                      className={styles.modalInput}
                      placeholder={modalData.placeholder}
                      maxLength={40}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                  )}
                </div>
                <div className={styles.modalCharCount}>
                  {(modalData.isTextArea ? 450 : 40) - inputValue.length} characters available
                </div>
                <div className={styles.modalFooter}>
                  <button className={styles.modalSaveBtn} onClick={handleSave}>Save</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {/* Photo Preview Modal */}
      {previewImage && (
        <div className={styles.previewModalOverlay} onClick={closePreviewModal}>
          <div className={styles.previewModalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.previewModalHeader}>
              <button className={styles.previewCloseBtn} onClick={closePreviewModal}>✕</button>
              <h3 className={styles.previewTitle}>{isCropMode ? "Crop & Adjust" : "Preview"}</h3>
              <button
                className={styles.previewTipsBtn}
                onClick={() => setShowTipsModal(!showTipsModal)}
              >
                Tips
              </button>
            </div>

            <div className={styles.previewBody}>
              {isCropMode ? (
                <>
                  <div className={styles.cropperWrapper}>
                    <Cropper
                      image={previewImage}
                      crop={crop}
                      zoom={zoom}
                      rotation={rotation}
                      aspect={1}
                      cropShape="round"
                      showGrid={false}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onRotationChange={setRotation}
                      onCropComplete={onCropComplete}
                    />
                  </div>

                  <div className={styles.cropControlsContainer}>
                    <div className={styles.cropSliderRow}>
                      <span className={styles.cropSliderLabel}>Zoom</span>
                      <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.05}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className={styles.cropSlider}
                      />
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <button
                        type="button"
                        className={styles.cropRotateBtn}
                        onClick={() => setRotation((prev) => (prev + 90) % 360)}
                      >
                        <FaRedo size={12} /> Rotate 90°
                      </button>

                      <button
                        type="button"
                        className={styles.previewEditBtn}
                        onClick={() => {
                          if (fileInputRef.current) fileInputRef.current.click();
                        }}
                      >
                        Choose another photo
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.previewImageCircle}>
                    <img src={previewImage} alt="Preview" />
                  </div>
                  
                  <div className={styles.previewTooltip}>
                    <strong className="text-white">Photo preview</strong>
                    <p>
                      {showTipsModal
                        ? "Choose a clear, front-facing photo that shows your face. A friendly expression helps build trust with hosts and guests."
                        : "We zoomed in on your photo to make it easier to see your face."}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className={styles.previewFooter}>
              {isCropMode ? (
                <>
                  <button
                    type="button"
                    className={styles.previewEditBtn}
                    onClick={() => setIsCropMode(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={styles.previewSubmitBtn}
                    onClick={handleApplyCrop}
                  >
                    Done
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className={styles.previewEditBtn}
                    onClick={triggerChangePhoto}
                  >
                    Edit photo
                  </button>
                  <button
                    type="button"
                    className={styles.previewSubmitBtn}
                    disabled={isSaving}
                    onClick={handleImageSubmit}
                  >
                    {isSaving ? "Saving..." : "Submit"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditMode;
