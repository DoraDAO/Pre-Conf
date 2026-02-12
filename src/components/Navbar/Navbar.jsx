import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [ambassadorDropdown, setAmbassadorDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    if (location.pathname === '/') {
      // If already on home page, just scroll to the section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on a different page, navigate to home and then scroll
      navigate('/', { replace: true });
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="GirlsWhoYap" />
        </div>
        
        <div className={styles.navLinks}>
          <button onClick={() => handleNavClick('about')} className={styles.navLink}>About</button>
          <button onClick={() => handleNavClick('experience')} className={styles.navLink}>Experience</button>
          <button onClick={() => handleNavClick('speakers')} className={styles.navLink}>Speakers</button>
          <button onClick={() => handleNavClick('events')} className={styles.navLink}>Events</button>
          
          {/* Ambassador with dropdown */}
          <div 
            className={styles.dropdown}
            onMouseEnter={() => setAmbassadorDropdown(true)}
            onMouseLeave={() => setAmbassadorDropdown(false)}
          >
            <button onClick={() => handleNavClick('ambassador')} className={`${styles.dropdownToggle} ${styles.navLink}`}>
              Ambassador
              <span className={styles.dropdownIcon}>▼</span>
            </button>
            {ambassadorDropdown && (
              <div className={styles.dropdownMenu}>
                <button onClick={() => handleNavClick('leaderboard')} className={styles.navLink}>Leaderboard</button>
              </div>
            )}
          </div>
        </div>
        
        <Link to="/ticket" className={styles.ctaButton}>Get Tickets</Link>
      </div>
    </nav>
  );
}

export default Navbar;
