import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import * as XLSX from 'xlsx';
import './LeaderboardSection.css';

const LeaderboardPage = () => {
  const pageRef = useRef(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchExcelData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/ambassador leaderboard.xlsx');

        if (!response.ok) {
          throw new Error('Failed to load Excel file');
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const transformedData = jsonData
          .map((row, index) => ({
            position: row.Position || index + 1,
            name: row.Name || row.Ambassador || `Ambassador ${index + 1}`,
            points: row.Points || row.Score || 0
          }));

        setLeaderboardData(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error loading Excel data:', err);
        setError('Failed to load leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchExcelData();
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    if (!page || loading || leaderboardData.length === 0) return;

    gsap.fromTo(page,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }
    );

    const rows = page.querySelectorAll('.leaderboard-row');
    gsap.fromTo(rows,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.3
      }
    );
  }, [loading, leaderboardData]);

  const getRankIcon = (position) => {
    switch(position) {
      case 1: return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#FFD700" stroke="#FFA500" strokeWidth="2"/>
          <text x="12" y="16" textAnchor="middle" fill="#000" fontSize="12" fontWeight="bold">1</text>
        </svg>
      );
      case 2: return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#C0C0C0" stroke="#A0A0A0" strokeWidth="2"/>
          <text x="12" y="16" textAnchor="middle" fill="#000" fontSize="12" fontWeight="bold">2</text>
        </svg>
      );
      case 3: return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#CD7F32" stroke="#B8860B" strokeWidth="2"/>
          <text x="12" y="16" textAnchor="middle" fill="#000" fontSize="12" fontWeight="bold">3</text>
        </svg>
      );
      default: return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#666" stroke="#888" strokeWidth="2"/>
          <text x="12" y="16" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">{position}</text>
        </svg>
      );
    }
  };

  const getRankClass = (position) => {
    switch(position) {
      case 1: return 'rank-gold';
      case 2: return 'rank-silver';
      case 3: return 'rank-bronze';
      default: return 'rank-default';
    }
  };

  if (loading) {
    return (
      <div className="leaderboard-section">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text)' }}>
            <h2>Loading leaderboard...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-section">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text)' }}>
            <h2>Error: {error}</h2>
            <p>Please make sure the Excel file exists in the /Excel folder.</p>
          </div>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = leaderboardData.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div ref={pageRef} className="leaderboard-section">
      <div className="container">
        <div className="leaderboard-header">
          <motion.div 
            className="leaderboard-title-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="leaderboard-title">AMBASSADOR LEADERBOARD</h1>
          </motion.div>
          
          <div className="leaderboard-stats">
            <div className="stat-item">
              <div className="live-indicator">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="6" cy="6" r="6" fill="#FF0000" className="live-dot"/>
                </svg>
                <span className="stat-label">LIVE</span>
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          className="leaderboard-table"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="table-header">
            <div className="header-cell pos-header">RANK</div>
            <div className="header-cell ambassador-header">AMBASSADOR</div>
            <div className="header-cell points-header">POINTS</div>
          </div>

          <div className="table-body">
            {currentData.map((ambassador, index) => (
              <motion.div
                key={ambassador.position + '-' + index}
                className={`leaderboard-row ${getRankClass(ambassador.position)}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="rank-cell">
                  <span className="rank-icon">{getRankIcon(ambassador.position)}</span>
                </div>
                
                <div className="ambassador-cell">
                  <div className="ambassador-avatar">
                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="25" cy="25" r="25" fill="#ff6b35"/>
                      <circle cx="25" cy="20" r="8" fill="#fff"/>
                      <path d="M10 40c0-8.284 6.716-15 15-15s15 6.716 15 15" fill="#fff"/>
                    </svg>
                  </div>
                  <span className="ambassador-name">{ambassador.name}</span>
                </div>
                
                <div className="points-cell">
                  <span className="points-value">{Number(ambassador.points).toLocaleString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="pagination-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.5rem',
            marginTop: '2rem',
            padding: '1rem'
          }}
        >
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: currentPage === 1 ? '#666' : '#fff',
              background: currentPage === 1 ? '#333' : '#000',
              border: 'none',
              borderRadius: '8px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: currentPage === 1 ? 0.5 : 1
            }}
          >
            ← Previous
          </button>
          
          <span style={{
            fontSize: '1rem',
            fontWeight: '500',
            color: 'var(--color-text)'
          }}>
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: currentPage === totalPages ? '#666' : '#fff',
              background: currentPage === totalPages ? '#333' : '#000',
              border: 'none',
              borderRadius: '8px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: currentPage === totalPages ? 0.5 : 1
            }}
          >
            Next →
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
