import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './HeroSection.module.css';

const useCounter = (end, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isAnimating) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      const current = Math.floor(start + (end - start) * easeOutQuart);
      
      setCount(current);

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, start, isAnimating]);

  return [count, setIsAnimating];
};

function HeroSection() {
  const navigate = useNavigate(); // Hook for client-side navigation

  return (
    <section className={styles.hero} id="about">

      <div className={styles.container}>
        {/* Title Section */}
        <div className={styles.titleSection}>
          <motion.div 
            className={styles.logoContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img src="/logo.png" alt="Girls Who Yap" className={styles.mainLogo} />
            <span className={styles.preConferenceTitle}>pre conference</span>
          </motion.div>
          
          <motion.div 
            className={styles.descriptionBox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className={styles.smallDescription}>
              Open to all genders and professionals worldwide,
              a global kickoff to the Girls Who Yap Conference.
            </p>
          </motion.div>
        </div>

        {/* Crowd Banner with Overlay Card */}
        <div className={styles.bannerSection}>
          {/* Crowd Background */}
          <div className={styles.crowdBackground}>
            <img 
              src="\2.png" 
              alt="Diverse crowd of women" 
              className={styles.crowdImage}
            />
          </div>

          {/* Event Card Overlay */}
          <motion.div 
            className={styles.eventCard}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className={styles.eventTitle}>
              Where women don't just attend conferences,<br />
              they shape conversations.
            </h2>
            <p className={styles.eventDate}>SPRING 2026</p>
            
            <div className={styles.eventDetails}>
              <div className={styles.speakerInfo}>
                {/* Updated: Replaced blue div with Image Logo */}
                <img src="/logo.png" alt="GWY Logo" className={styles.avatar} />
                <div>
                  <div className={styles.speakerName}>GirlsWhoYap Conference</div>
                  <div className={styles.speakerRole}>Dev-creator Gathering</div>
                </div>
              </div>
              <button 
                className={styles.arrowBtn} 
                onClick={() => navigate('/ticket')}
              >
                →
              </button>
            </div>
          </motion.div>

          {/* Bottom Info with Logo Update */}
          <div className={styles.bottomInfo}>
            <span className={styles.reminderBtn}>28th Feb, 2026</span>
            
            {/* Updated container to include logo before text */}
            <div className={styles.poweredByContainer}>
              <img src="/logo.png" alt="DoraDao" className={styles.partnerLogo} style={{ borderRadius: '50%' }} /> 
              <span>Powered by DoraDao</span>
            </div>
          </div>
        </div>

        {/* Animated Counter CTA Section */}
        <AnimatedCTASection />
      </div>
    </section>
  );
}

// Countdown Timer Section Component
const AnimatedCTASection = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2026-02-28T00:00:00').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      ref={ref}
      className={styles.ctaSection}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <p className={styles.description}>
        GWY Pre-Conference is a global virtual gathering designed to kick off the community experience.
        It's open to everyone, builders, creators, students, professionals, and curious minds, everywhere.
      </p>

      <div className={styles.countdownGrid}>
        <div className={styles.countdownItem}>
          <div className={styles.countdownNumber}>{String(timeLeft.days).padStart(2, '0')}</div>
          <div className={styles.countdownLabel}>Days</div>
        </div>
        <div className={styles.countdownItem}>
          <div className={styles.countdownNumber}>{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className={styles.countdownLabel}>Hours</div>
        </div>
        <div className={styles.countdownItem}>
          <div className={styles.countdownNumber}>{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className={styles.countdownLabel}>Minutes</div>
        </div>
        <div className={styles.countdownItem}>
          <div className={styles.countdownNumber}>{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className={styles.countdownLabel}>Seconds</div>
        </div>
      </div>

      <button className={styles.getTicketsBtn} onClick={() => navigate('/ticket')}>Get Tickets</button>
    </motion.div>
  );
};

export default HeroSection;