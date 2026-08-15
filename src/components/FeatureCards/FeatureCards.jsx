import React from 'react';
import { motion } from 'framer-motion';
import styles from './FeatureCards.module.css';

const features = [
  {
    title: 'Talent Night',
    description: 'Open stage of expression live music, sharp tech roasts, storytelling, stand-up, visual art and unexpected performances.',
  },
  {
    title: 'Game Zone',
    description: 'Playful competition, from scribble battles to meme wars and other exciting games.',
  },
  {
    title: 'Giveaways',
    description: 'Timed reward drops, from exclusive physical merch to digital collectibles. Stay engaged, because every moment could unlock something.',
  },
  {
    title: 'Speaker Sessions',
    description: 'Voices across tech, culture, and the creator economy share practical insights on AI, Web3, and building sustainable digital influence & content Monetization across platforms.',
  },
  {
    title: 'Community Spotlight',
    description: 'Selected regional communities take the stage to present their work, impact, and gated opportunities, opening doors for meaningful global collaboration.',
  },
  {
    title: 'Happy Treats',
    description: 'A sponsored reward initiative recognizing 200–300 of the most active participants, curated benefits unlocked through genuine contribution and engagement.',
  },
];

function FeatureCards() {
  return (
    <section className={styles.features} id="experience">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.titleMain}>WHAT IT FEELS LIKE</span>
            <span className={styles.titleSub}>TO BE AT GWY PRE-CONF</span>
          </h2>
        </div>
        
        <div className={styles.grid}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: 'var(--shadow-xl)' }}
            >
              <div className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureCards;
