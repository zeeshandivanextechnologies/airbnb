import React from 'react';
import './Loader.css';

/**
 * Universal Airbnb Loader Component
 * 
 * Props:
 * - fullScreen: boolean (renders overlay across full viewport)
 * - size: 'small' | 'medium' | 'large' (default 'medium')
 * - text: string (optional loading status message)
 * - variant: 'airbnb' (icon + pulse) | 'spinner' (clean ring) | 'dots' (bouncing wave)
 * - blur: boolean (adds backdrop glassmorphic blur when fullScreen)
 */
const Loader = ({
  fullScreen = false,
  size = 'medium',
  text = '',
  variant = 'airbnb',
  blur = true,
  className = ''
}) => {
  const content = (
    <div className={`airbnb-loader-container ${size} ${className}`}>
      {variant === 'airbnb' && (
        <div className="airbnb-loader-icon-wrapper">
          {/* Animated Glowing Ring */}
          <div className="airbnb-loader-pulse-ring" />
          <div className="airbnb-loader-pulse-ring delay" />
          
          {/* Signature Airbnb Bélo Logo Shape */}
          <svg
            className="airbnb-loader-logo"
            viewBox="0 0 32 32"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.479.96 3.326.136 2.274-.864 4.544-2.673 6.07-1.743 1.47-4.041 2.121-6.471 1.833-2.022-.24-3.691-1.282-4.345-2.731-.655 1.449-2.324 2.491-4.346 2.731-2.43.288-4.728-.363-6.471-1.833-1.809-1.526-2.809-3.796-2.673-6.07.05-.847.293-1.735.96-3.326l.145-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.424 0-2.528.694-3.568 2.551l-.547 1.052C9.97 10.395 5.86 19.006 4.908 21.226c-.57 1.36-.763 2.05-.802 2.704-.102 1.706.648 3.408 2.006 4.553 1.308 1.103 3.033 1.592 4.858 1.376 1.776-.21 3.27-1.246 3.731-2.753l.3-.984.3.984c.461 1.507 1.955 2.543 3.731 2.753 1.825.216 3.55-.273 4.858-1.376 1.358-1.145 2.108-2.847 2.006-4.553-.039-.654-.232-1.344-.802-2.704-.952-2.22-5.062-10.831-6.977-14.623l-.547-1.052C18.528 3.694 17.424 3 16 3zm0 15c1.657 0 3 1.343 3 3 0 1.306-.835 2.417-2 2.83V26h-2v-2.17c-1.165-.413-2-1.524-2-2.83 0-1.657 1.343-3 3-3zm0 2c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1z" />
          </svg>
        </div>
      )}

      {variant === 'spinner' && (
        <div className="airbnb-loader-spinner">
          <div className="spinner-track" />
          <div className="spinner-head" />
        </div>
      )}

      {variant === 'dots' && (
        <div className="airbnb-loader-dots">
          <span />
          <span />
          <span />
        </div>
      )}

      {text && <p className="airbnb-loader-text">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`airbnb-loader-backdrop ${blur ? 'with-blur' : ''}`}>
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
