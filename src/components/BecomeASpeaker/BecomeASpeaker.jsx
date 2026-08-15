import React from 'react';
import { motion } from 'framer-motion';
import styles from './BecomeASpeaker.module.css';

function BecomeASpeaker() {
  return (
    <section className={styles.becomeASpeaker} id="speakers">
      <div className={styles.container}>
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.title}>
            BECOME AN<br />
            EVENT <span className={styles.highlight}>SPEAKER</span>
          </h2>
          
          <p className={styles.description}>
            Share your expertise, connect with an engaged community, 
            and contribute to meaningful conversations that matter.
          </p>

          <p className={styles.speakerCopy}>
            We’re looking for the kind of people who light up when they talk about the creator economy; the builders,
            the dreamers, the slightly-obsessed-in-the-best-way humans who wake up thinking, “How can we make this
            easier, smarter, better?” If your work helps creators build smarter, move faster, earn better, and feel a
            little more powerful while doing it, come share your heart with us.
          </p>

          <a
            href="https://luma.com/pf5o58e3"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.applyBtn}
          >
            Apply to Speak
          </a>
        </motion.div>
        
        <motion.div 
          className={styles.illustration}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className={styles.illustrationCard}>
            <img 
              src="/Screenshot 2026-02-10 192838.png" 
              alt="Speaker illustration"
              className={styles.speakerImage}
            />
            <div className={styles.speechBubble}>
              <strong>Oliver:</strong><br />
              Great topic and speakers! the fact that this event is free is mind-blowing 
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default BecomeASpeaker;
