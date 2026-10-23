import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronLeft, FaChevronRight, FaTimes, FaPlus, FaCheck } from 'react-icons/fa';
import { BsLayoutSidebarInsetReverse } from 'react-icons/bs';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from '../../components/styles/HostCalendar.module.css';
import VerifyBanner from '../../components/VerifyBanner';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const HostCalendar = () => {
  const { user } = useSelector((state) => state.auth || {});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isNoteInputOpen, setIsNoteInputOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [isPriceEditOpen, setIsPriceEditOpen] = useState(false);
  const [priceValue, setPriceValue] = useState("1952");
  const [isSaving, setIsSaving] = useState(false);

  // Dynamic calendar dates from backend (indexed by date string 'YYYY-MM-DD')
  const [calendarData, setCalendarData] = useState({});
  const [bookedDates, setBookedDates] = useState([]);

  const originalPrice = 2145;

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get the day of the week the month starts on (0 for Sun, 1 for Mon, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Get total days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Helper to get formatted YYYY-MM-DD for a day
  const getDateKey = (day) => {
    const m = String(currentMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${currentYear}-${m}-${d}`;
  };

  // Fetch backend calendar dates when month, year, or user changes
  useEffect(() => {
    let isMounted = true;
    const fetchCalendarData = async () => {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const hostId = user?.id || 4;
      try {
        const res = await fetch(`${baseUrl}/listings/calendar-dates?host_id=${hostId}&month=${currentMonth + 1}&year=${currentYear}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && isMounted) {
            const map = {};
            (json.dates || []).forEach(item => {
              map[item.date_str] = item;
            });
            setCalendarData(map);
            setBookedDates(json.bookedDates || []);
          }
        }
      } catch (err) {
        console.error('Error fetching calendar dates:', err);
      }
    };

    fetchCalendarData();
    return () => {
      isMounted = false;
    };
  }, [currentMonth, currentYear, user]);

  // Check if a day is today
  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  const isPastDay = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(currentYear, currentMonth, day);
    return dateToCheck < today;
  };

  // Check if day is booked by a guest reservation
  const isBooked = (day) => {
    const dateToCheck = new Date(currentYear, currentMonth, day);
    return bookedDates.some(b => {
      const start = new Date(b.check_in);
      const end = new Date(b.check_out);
      return dateToCheck >= start && dateToCheck <= end;
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDay(null);
  };

  // Get price for day (dynamic from backend or fallback)
  const getPrice = (day) => {
    const key = getDateKey(day);
    if (calendarData[key] && calendarData[key].price) {
      const p = Number(calendarData[key].price);
      return p >= 1000 ? `₹${(p / 1000).toFixed(1)}K` : `₹${p}`;
    }
    if (day % 7 === 0 || day % 7 === 6) return '₹2.1K';
    if (day % 5 === 0) return '₹2K';
    return '₹1.8K';
  };

  // Select day handler
  const handleSelectDay = (day, past) => {
    if (past) return;
    setSelectedDay(day);
    const key = getDateKey(day);
    const dateRecord = calendarData[key];

    if (dateRecord) {
      setIsAvailable(dateRecord.is_available !== false);
      setNoteText(dateRecord.note || "");
      setPriceValue(dateRecord.price ? String(dateRecord.price) : "1952");
    } else {
      setIsAvailable(!isBooked(day));
      setNoteText("");
      setPriceValue("1952");
    }
    setIsNoteInputOpen(false);
    setIsPriceEditOpen(false);
  };

  // Save changes to backend
  const saveCalendarDate = async (newAvailability = isAvailable, newPrice = priceValue, newNote = noteText) => {
    if (!selectedDay) return;
    const dateKey = getDateKey(selectedDay);
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const hostId = user?.id || 4;

    setIsSaving(true);
    try {
      const res = await fetch(`${baseUrl}/listings/calendar-dates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host_id: hostId,
          date: dateKey,
          is_available: newAvailability,
          price: Number(newPrice) || null,
          note: newNote
        })
      });
      const data = await res.json();
      if (data.success && data.date) {
        setCalendarData(prev => ({
          ...prev,
          [dateKey]: data.date
        }));
        toast.success('Calendar updated');
      }
    } catch (err) {
      console.error('Error saving calendar date:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column'}}>
      <VerifyBanner />
      <div className={styles.pageContainer} style={{ height: 'auto', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      {/* Left Calendar Section */}
      <div className={styles.calendarSection}>
        {/* Header */}
        <div className={styles.calendarHeader}>
          <div className={styles.datePickerWrapper}>
            <div 
              className={styles.headerLeft} 
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            >
              <h1 className={styles.monthTitle}>{monthNames[currentMonth]} {currentYear}</h1>
              <FaChevronDown className={styles.chevronIcon} />
            </div>
            
            {isDatePickerOpen && (
              <div className={styles.datePickerDropdown} onClick={e => e.stopPropagation()}>
                <DayPicker 
                  mode="single"
                  selected={currentDate}
                  onSelect={(date) => {
                    if (date) {
                      setCurrentDate(date);
                      setIsDatePickerOpen(false);
                      setSelectedDay(null);
                    }
                  }}
                  onMonthChange={(month) => {
                    setCurrentDate(new Date(month.getFullYear(), month.getMonth(), 1));
                    setSelectedDay(null);
                  }}
                />
              </div>
            )}
          </div>
          <div className={styles.headerRight}>
            <div style={{display: 'flex', gap: '8px', marginRight: '16px'}}>
              <button type="button" onClick={handlePrevMonth} className={styles.settingsBtn}>
                <FaChevronLeft className={styles.cogIcon} />
              </button>
              <button type="button" onClick={handleNextMonth} className={styles.settingsBtn}>
                <FaChevronRight className={styles.cogIcon} />
              </button>
            </div>
            <button type="button" className={styles.monthBtn}>
              Month <FaChevronDown className={styles.smallChevron} />
            </button>
            <button type="button" className={styles.settingsBtn}>
              <BsLayoutSidebarInsetReverse className={styles.cogIcon} />
            </button>
          </div>
        </div>

        {/* Days of week */}
        <div className={styles.daysOfWeek}>
          {daysOfWeek.map(day => (
            <div key={day} className={styles.dayName}>{day}</div>
          ))}
        </div>

        {/* Grid */}
        <div className={styles.calendarGrid}>
          {emptyDays.map((_, i) => (
            <div key={`empty-${i}`} className={styles.emptyCell}></div>
          ))}
          {days.map(day => {
            const past = isPastDay(day);
            const dateKey = getDateKey(day);
            const dateRecord = calendarData[dateKey];
            const isDateBlocked = dateRecord ? dateRecord.is_available === false : false;
            const isDateBooked = isBooked(day);

            return (
              <div 
                key={day} 
                className={`${styles.dayCell} ${selectedDay === day ? styles.dayCellSelected : ''} ${past || isDateBlocked || isDateBooked ? styles.disabledDay : ''}`}
                onClick={() => handleSelectDay(day, past)}
              >
                <div className={`${styles.dayNumber} ${isToday(day) ? styles.activeDay : ''}`}>
                  {day}
                </div>
                <div className={styles.dayPrice}>
                  {isDateBlocked ? 'Blocked' : isDateBooked ? 'Booked' : getPrice(day)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Button */}
        <div className={styles.floatingBtn}>
          INR
        </div>
      </div>

      {/* Right Sidebar Section */}
      <div className={styles.sidebarSection}>
        {selectedDay ? (
          <div className={styles.selectedSidebar}>
            <div className={styles.selectedHeader}>
              <div className={styles.dateBadge}>{selectedDay} {monthNames[currentMonth].substring(0,3)}</div>
              <button type="button" className={styles.closeIconBtn} onClick={() => setSelectedDay(null)}>
                <FaTimes />
              </button>
            </div>
            
            <div className={styles.darkCardColumn}>
              <div className={styles.statusRow}>
                <div className={styles.statusLeft}>
                  {isAvailable ? 'Available' : 'Blocked by you'} 
                  <span className={isAvailable ? styles.greenDot : styles.redDot}></span>
                </div>
                <div 
                  className={`${styles.toggleWrap} ${!isAvailable ? styles.toggleWrapOff : ''}`}
                  onClick={() => {
                    const nextAvail = !isAvailable;
                    setIsAvailable(nextAvail);
                    setIsNoteInputOpen(false);
                    saveCalendarDate(nextAvail, priceValue, noteText);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                   {isAvailable ? (
                     <>
                       <span className={styles.toggleTimes}><FaTimes size={10} /></span>
                       <div className={styles.toggleCircle}><FaCheck size={10} color="black"/></div>
                     </>
                   ) : (
                     <>
                       <div className={styles.toggleCircle}><FaTimes size={10} color="black"/></div>
                       <span className={styles.toggleCheck}><FaCheck size={10} /></span>
                     </>
                   )}
                </div>
              </div>
              
              {!isAvailable && (
                <div className={styles.noteSection}>
                  {!isNoteInputOpen ? (
                    <button type="button" className={styles.addNoteBtn} onClick={() => setIsNoteInputOpen(true)}>
                      {noteText ? 'Edit note' : 'Add a note'}
                    </button>
                  ) : (
                    <div className={styles.noteInputContainer}>
                      <textarea 
                        className={styles.noteInput}
                        maxLength={100}
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add a private note"
                      />
                      <div className={styles.charCount}>
                        {100 - noteText.length} characters available
                      </div>
                      <div className={styles.noteActions}>
                        <button type="button" className={styles.noteCancelBtn} onClick={() => setIsNoteInputOpen(false)}>Cancel</button>
                        <button 
                          type="button" 
                          className={styles.noteSaveBtn} 
                          onClick={() => {
                            setIsNoteInputOpen(false);
                            saveCalendarDate(isAvailable, priceValue, noteText);
                          }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={styles.darkCardLarge}>
              {!isPriceEditOpen ? (
                <div onClick={() => setIsPriceEditOpen(true)} style={{ cursor: 'pointer' }}>
                  <div className={styles.priceLabel}>Last-minute price</div>
                  <div className={styles.priceRow}>
                    <span className={styles.newPrice}>₹{priceValue}</span>
                    <span className={styles.oldPriceStrikethrough}>₹{originalPrice}</span>
                  </div>
                </div>
              ) : (
                <div className={styles.priceEditContainer}>
                  <div className={styles.priceLabel}>Last-minute price</div>
                  <div className={styles.priceInputWrapper}>
                    <span className={styles.currencySymbol}>₹</span>
                    <input 
                      type="number"
                      className={styles.priceInput}
                      value={priceValue}
                      onChange={(e) => setPriceValue(e.target.value)}
                    />
                  </div>
                  <div className={styles.discountText}>
                    ₹{priceValue || 0} after {Math.round(((originalPrice - parseInt(priceValue || 0)) / originalPrice) * 100)}% last-minute discount
                  </div>
                  <div className={styles.noteActions}>
                    <button type="button" className={styles.noteCancelBtn} onClick={() => setIsPriceEditOpen(false)}>Cancel</button>
                    <button 
                      type="button" 
                      className={styles.noteSaveBtn} 
                      onClick={() => {
                        setIsPriceEditOpen(false);
                        saveCalendarDate(isAvailable, priceValue, noteText);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.darkCard}>
              <span>Custom settings</span>
              <FaPlus size={12}/>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.sidebarItem}>
              <div className={styles.itemContent}>
                <div className={styles.itemTitle}>Pricing</div>
                <div className={styles.itemSub}>₹2,024 - ₹2,145 per night</div>
              </div>
              <button type="button" className={styles.nextBtn}><FaChevronRight className={styles.nextIcon}/></button>
            </div>
            
            <div className={styles.sidebarItem}>
              <div className={styles.itemContent}>
                <div className={styles.itemTitle}>Discounts</div>
                <div className={styles.itemSub}>10% weekly discount<br/>20% monthly discount</div>
              </div>
              <button type="button" className={styles.nextBtn}><FaChevronRight className={styles.nextIcon}/></button>
            </div>

            <div className={styles.sidebarItem}>
              <div className={styles.itemContent}>
                <div className={styles.itemTitle}>Availability</div>
                <div className={styles.itemSub}>1-365 night stays<br/>Same-day advance notice</div>
              </div>
              <button type="button" className={styles.nextBtn}><FaChevronRight className={styles.nextIcon}/></button>
            </div>

            <div className={styles.sidebarItem}>
              <div className={styles.itemContent}>
                <div className={styles.itemTitle}>Cancellations</div>
                <div className={styles.itemSub}>Flexible for short-term stays<br/>Firm Long-Term for long-term stays</div>
              </div>
              <button type="button" className={styles.nextBtn}><FaChevronRight className={styles.nextIcon}/></button>
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  );
};

export default HostCalendar;
