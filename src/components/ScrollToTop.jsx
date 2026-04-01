import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollTop}
      aria-label="Scroll to top"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        border: "none",
        background: "#111",
        color: "#fff",
        fontSize: "18px",
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.25s ease",
        pointerEvents: visible ? "auto" : "none",
        zIndex: 1000,
      }}
    >
      ↑
    </button>
  );
}
