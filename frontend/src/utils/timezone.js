// Timezone Mapping & Utility for Website-wide formatting
export const TIMEZONES = [
  { label: 'India Standard Time', iana: 'Asia/Kolkata', offset: 'UTC+05:30' },
  { label: 'Pacific Standard Time (PST)', iana: 'America/Los_Angeles', offset: 'UTC-08:00' },
  { label: 'Eastern Standard Time (EST)', iana: 'America/New_York', offset: 'UTC-05:00' },
  { label: 'Greenwich Mean Time (GMT)', iana: 'Europe/London', offset: 'UTC+00:00' },
  { label: 'Central European Time (CET)', iana: 'Europe/Paris', offset: 'UTC+01:00' },
  { label: 'Australian Eastern Time (AET)', iana: 'Australia/Sydney', offset: 'UTC+10:00' },
  { label: 'Japan Standard Time (JST)', iana: 'Asia/Tokyo', offset: 'UTC+09:00' },
  { label: 'China Standard Time (CST)', iana: 'Asia/Shanghai', offset: 'UTC+08:00' },
  { label: 'Gulf Standard Time (GST)', iana: 'Asia/Dubai', offset: 'UTC+04:00' },
  { label: 'Singapore Standard Time (SGT)', iana: 'Asia/Singapore', offset: 'UTC+08:00' }
];

export const getIanaTimezone = (tzLabel) => {
  const match = TIMEZONES.find(t => t.label === tzLabel);
  return match ? match.iana : 'Asia/Kolkata';
};

export const getSavedTimezone = () => {
  return localStorage.getItem('airbnb_selected_timezone') || 'India Standard Time';
};

export const setSavedTimezone = (tzLabel) => {
  localStorage.setItem('airbnb_selected_timezone', tzLabel);
  window.dispatchEvent(new CustomEvent('airbnb_timezone_changed', { detail: tzLabel }));
};

/**
 * Format a Date object according to the selected user timezone
 */
export const formatWithTimezone = (date, options = {}, tzLabel = null) => {
  const targetLabel = tzLabel || getSavedTimezone();
  const timeZone = getIanaTimezone(targetLabel);
  const d = date instanceof Date ? date : new Date(date || Date.now());

  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    ...options
  }).format(d);
};
