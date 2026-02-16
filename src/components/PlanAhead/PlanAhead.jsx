import React from 'react';
import { motion } from 'framer-motion';
import styles from './PlanAhead.module.css';

function PlanAhead() {
  return (
    <section className={styles.planAhead}>
      <div className={styles.container}>
        <motion.div 
          className={styles.illustration}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className={styles.illustrationCard}>
            <img 
              src="/Screenshot 2026-02-10 192021.png" 
              alt="Planning illustration"
              className={styles.planImage}
            />
            <div className={styles.notification}>
              <strong><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" fill="#4285F4"/></svg> My Schedule</strong><br />
              My topic for next week...
            </div>
            <div className={styles.reminder}>
              <strong>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '4px'}}>
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="black"/>
                </svg>
                Reminder
              </strong><br />
              You have 2 events coming up...
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.title}>Don’t just attend. <span className={styles.highlight} style={{ color: '#D9671B' }}>Come participate</span> with us.</h2>
          
          <p className={styles.description}>
            This isn’t the kind of space where you sit in a chair, clap politely, and leave with a tote bag.
            This is the kind where you belong. Where you lean in. Where you try, try again.
          </p>

          <p className={styles.description}>
            You could light up <span className={styles.highlight} style={{ color: '#D9671B', fontWeight: 'bold' }}>Talent Night</span> , sing, roast, stand up, dance, art showcase, perform, surprise us.
          </p>

          <p className={styles.description}>
            Become an <span className={styles.highlight} style={{ color: '#D9671B', fontWeight: 'bold' }}>Ambassador</span> and carry GWY Pre-Conf into your city, your campus, your little corner of the world.
          </p>

          <p className={styles.description}>
            Come <span className={styles.highlight} style={{ color: '#D9671B', fontWeight: 'bold' }}>Volunteer</span> with us. Help us weave this global story across 150+ cities, alongside partners from 25+ countries.
          </p>

          <button className={styles.ctaBtn} onClick={() => window.open('https://luma.com/he730d4l', '_blank', 'noopener,noreferrer') }>
            Participate
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default PlanAhead;
