import { useRef, useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Partners.module.css';

gsap.registerPlugin(ScrollTrigger);

const Partners = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [typingComplete, setTypingComplete] = useState(false);
  
  const fullText = "Trusted by organizations worldwide";

  useEffect(() => {
    if (isInView && currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 80);

      return () => clearTimeout(timeout);
    } else if (currentIndex === fullText.length && !typingComplete) {
      setTimeout(() => {
        setShowCursor(false);
        setTypingComplete(true);
      }, 500);
    }
  }, [isInView, currentIndex, fullText, typingComplete]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    gsap.fromTo(header,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }, []);

  const partners = [
    { name: "GitHub", logo: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" },
    { name: "MongoDB", logo: "https://webassets.mongodb.com/_com_assets/cms/mongodb_logo1-76twgcu2dm.png" },
    { name: "Polygon", logo: "https://cryptologos.cc/logos/polygon-matic-logo.png" },
    { logo: "https://replit.com/public/images/logo-small.png" },
    { name: "Soonami.io", logo: "/soonami.png" },
    { name: "Mentro", logo: "/mentro.png" },
    { name: "Socrates", logo: "/socrates.png" },
    { name: "Filecoin", logo: "https://cryptologos.cc/logos/filecoin-fil-logo.png" },
    { name: "Devfolio", logo: "/devfolio-logo.png" },
    { name: "CoreDAO.org", logo: "https://cryptologos.cc/logos/core-dao-core-logo.png" },
    { logo: "/reskill.png" },
    { name: "Unhosted AI", logo: "/unhosted.png" }
  ];

  const loopedPartners = [...partners, ...partners];

  return (
    <section ref={sectionRef} className={styles.partnersSection}>
      <div className={styles.container}>
        <div ref={headerRef} className={styles.partnersHeader}>
          <h2 className={styles.partnersHeadline}>
            {displayedText}
            {showCursor && <span className={styles.typewriterCursor}>|</span>}
          </h2>
          <AnimatePresence>
            {typingComplete && (
              <motion.p
                className={styles.partnersSubtext}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              >
                Organizations that believe in community led growth, open conversations, and inclusive ecosystems
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className={styles.partnersMarquee}>
          <motion.div
            className={styles.partnersMarqueeTrack}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          >
            {loopedPartners.map((partner, index) => (
              <div key={index} className={styles.partnerLogo}>
                {partner.logo ? (
                  <img src={partner.logo} alt={partner.name} className={styles.partnerLogoImage} />
                ) : (
                  <span className={styles.partnerIcon}>{partner.icon}</span>
                )}
                {partner.name !== "MongoDB" && (
                  <span className={styles.partnerName}>{partner.name}</span>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
