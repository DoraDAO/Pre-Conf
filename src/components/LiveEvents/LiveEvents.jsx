import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './LiveEvents.module.css';

function LiveEvents() {
  const navigate = useNavigate();
  return (
    <section className={styles.liveEvents}>
      <div className={styles.container}>
        <div className={styles.videoSection}>
          <div className={styles.videoMockup}>
            <div className={styles.liveTag}>
              <span className={styles.liveDot}></span>
              LIVE
            </div>
            <video 
              src="/Pre Conf .mp4" 
              autoPlay
              loop
              muted
              className={styles.videoImage}
            >
              Your browser does not support the video tag.
            </video>
            <div className={styles.videoControls}>
              <button className={styles.controlBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" fill="currentColor"/>
                </svg>
              </button>
              <button className={styles.controlBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5v14l11-7z" fill="currentColor"/>
                </svg>
              </button>
              <button className={styles.controlBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" fill="currentColor"/>
                </svg>
              </button>
              <button className={styles.controlBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6h12v12H6z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div className={styles.chatPreview}>
            <div className={styles.chatHeader}>
              <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" fill="#4285F4"/></svg> Live Chat</span>
              <span className={styles.attendees}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99l-2.54 3.38c-.74.99-.74 2.31 0 3.3l1.04 1.38V18c0 .55.45 1 1 1s1-.45 1-1v-1.5c0-.28-.11-.53-.29-.71L14 15.5l1.26-1.68c.11-.15.29-.24.49-.24.4 0 .75.32.75.75V22h2.5z" fill="#666"/></svg> Attendees (128)</span>
            </div>
            <div className={styles.chatMessages}>
              <div className={styles.chatMessage}>
                <strong>Steven:</strong> Great topic and speakers! <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" fill="#FF5722"/></svg>
              </div>
              <div className={styles.chatMessage}>
                <strong>Mark:</strong> Today's topic and speakers are <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" fill="#FF5722"/></svg><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" fill="#FF5722"/></svg><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" fill="#FF5722"/></svg>
              </div>
              <div className={styles.chatMessage}>
                <strong>Wayne:</strong> This new event site is amazing! <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#9C27B0"/></svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.features}>
          <motion.div 
            className={styles.feature}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className={styles.icon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="black"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>WATCH EXCLUSIVE</h3>
            <p className={styles.featureText}>
              Free and <span className={styles.highlight}>exclusive event</span> conferences with special guest and speakers.
            </p>
          </motion.div>
          
          <motion.div 
            className={styles.feature}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img src="/Open%20Peeps%20-%20Bust.png" alt="Top speakers" className={styles.iconImage} />
            <h3 className={styles.featureTitle}>TOP SPEAKERS</h3>
            <p className={styles.featureText}>
              Anyone can <span className={styles.highlight}>become a host</span> and customize the number of participants.
            </p>
          </motion.div>
        </div>
        
        <div className={styles.ctas}>
          <button className={styles.primaryBtn} onClick={() => navigate('/ticket')}>Grab your ticket</button>
          <button className={styles.secondaryBtn} onClick={() => window.open('https://luma.com/40umdp7f', '_blank', 'noopener,noreferrer') }>
            Become Partner
          </button>
        </div>
      </div>
    </section>
  );
}

export default LiveEvents;