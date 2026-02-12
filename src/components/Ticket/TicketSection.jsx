import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Loader2 } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import imageCompression from 'browser-image-compression';
import './TicketSection.css';

const TICKET_CONFIG = {
  avatar: { 
    x: 64.6, 
    y: 50.6, 
    size: 101.1 
  },
  seat: { 
    x: 93.1, 
    y: 23.1, 
    w: 5.9, 
    h: 17.8, 
    rotation: -90.0 
  },
  row: { 
    x: 93.1, 
    y: 48.1, 
    w: 5.9, 
    h: 17.8, 
    rotation: -90.0 
  },
  qr: { 
    x: 88.6, 
    y: 74.3, 
    size: 25.3, 
    rotation: 0.0 
  }
};

const TicketSection = () => {
  const [view, setView] = useState('landing'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ticketData, setTicketData] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    image: null,
    imagePreview: null
  });

  const canvasRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { 
        setError("Image size should be less than 5MB");
        return;
      }
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
      setError('');
    }
  };

  const checkExistingTicket = async (email) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setTicketData(data);
        setView('ticket');
      } else {
        setError("No ticket found. Please register first.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Check for existing ticket
      const { data: existing } = await supabase
        .from('tickets')
        .select('id')
        .eq('email', formData.email)
        .single();

      if (existing) {
        setError("Ticket already exists for this email.");
        setLoading(false);
        return;
      }

      let avatarUrl = '';
      if (formData.image) {
        let fileToUpload = formData.image;
        try {
          const options = {
            maxSizeMB: 0.1,          
            maxWidthOrHeight: 400,  
            useWebWorker: true,
            fileType: 'image/webp'   
          };
          
          console.log(`Original size: ${(formData.image.size / 1024 / 1024).toFixed(2)} MB`);
          
          // Compress the image
          fileToUpload = await imageCompression(formData.image, options);
          
          console.log(`Compressed size: ${(fileToUpload.size / 1024 / 1024).toFixed(2)} MB`);
        } catch (compressionError) {
          console.error("Compression failed, using original image:", compressionError);
        }

        const fileExt = fileToUpload.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('ticket-avatars')
          .upload(fileName, fileToUpload); // Upload the compressed file

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('ticket-avatars')
          .getPublicUrl(fileName);
          
        avatarUrl = publicUrlData.publicUrl;
      }

      // Create Ticket Data
      const row = Math.floor(Math.random() * 50) + 1;
      const seat = Math.floor(Math.random() * 100) + 1;

      const newTicket = {
        name: formData.name,
        email: formData.email,
        avatar_url: avatarUrl,
        row_number: row.toString().padStart(2, '0'),
        seat_number: seat.toString().padStart(2, '0')
      };

      // Insert Ticket to DB
      const { data, error: insertError } = await supabase
        .from('tickets')
        .insert([newTicket])
        .select()
        .single();

      if (insertError) throw insertError;

      setTicketData(data);
      setView('ticket');

    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- CANVAS GENERATION (DOWNLOAD) ---
  const downloadTicket = () => {
    const canvas = canvasRef.current;
    if (!canvas || !ticketData) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/ticket-bg.png"; 

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Draw Background
      ctx.drawImage(img, 0, 0);

      // 2. Draw Avatar
      if (ticketData.avatar_url) {
        const avatarImg = new Image();
        avatarImg.crossOrigin = "anonymous";
        avatarImg.src = ticketData.avatar_url;
        avatarImg.onload = () => drawAvatar(avatarImg);
        avatarImg.onerror = () => drawDetails();
      } else {
        drawDetails();
      }

      function drawAvatar(avatarImg) {
        const { x, y, size } = TICKET_CONFIG.avatar;
        const centerX = w * (x / 100);
        const centerY = h * (y / 100);
        const radius = h * (size / 100) / 2;

        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = "#000000";
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(avatarImg, centerX - radius - 1, centerY - radius - 1, radius * 2 + 2, radius * 2 + 2);
        ctx.restore();
        
        drawDetails();
      }

      function drawDetails() {
        const pinkColor = '#ffb6c1'; 
        const yellowColor = '#fef0c5';

        // Helper to draw a ROTATED box and text
        const drawBox = (config, label, value) => {
          const cx = w * (config.x / 100);
          const cy = h * (config.y / 100);
          const bw = w * (config.w / 100);
          const bh = h * (config.h / 100);

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(config.rotation * Math.PI / 180);

          ctx.fillStyle = pinkColor;
          ctx.fillRect(-bw/2, -bh/2, bw, bh);

          ctx.fillStyle = "#000";
          ctx.textAlign = "center";
          
          const fontSizeNum = bw * 0.8;   
          
          ctx.font = `normal ${fontSizeNum}px Impact, sans-serif`;
          ctx.fillText(value, 0, bh * 0.35);

          ctx.restore();
        };

        // 3. Draw Seat Box
        drawBox(TICKET_CONFIG.seat, "SEAT", ticketData.seat_number);

        // 4. Draw Row Box
        drawBox(TICKET_CONFIG.row, "ROW", ticketData.row_number);

        // 5. Draw QR Code
        const qrImg = new Image();
        qrImg.crossOrigin = "anonymous";
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=GWY-${ticketData.email}`;
        
        qrImg.onload = () => {
          const { x: qrX_pct, y: qrY_pct, size: qrSize_pct, rotation } = TICKET_CONFIG.qr;
          const qrSize = h * (qrSize_pct / 100);
          const qrX = w * (qrX_pct / 100);
          const qrY = h * (qrY_pct / 100);

          ctx.save();
          ctx.translate(qrX, qrY);
          ctx.rotate(rotation * Math.PI / 180);
          
          ctx.fillStyle = yellowColor;
          ctx.fillRect(-qrSize/2 - 5, -qrSize/2 - 5, qrSize + 10, qrSize + 10);
          
          ctx.drawImage(qrImg, -qrSize/2, -qrSize/2, qrSize, qrSize);
          ctx.restore();
          
          saveImage();
        };
        qrImg.onerror = () => saveImage();
      }

      function saveImage() {
        const link = document.createElement('a');
        link.download = `GWY_Ticket_${ticketData.name}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    };
  };

  return (
    <section className="ticket-section">
      <div className="ticket-container">
        
        {/* LANDING VIEW */}
        {view === 'landing' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="ticket-card">
            <h1>Get Your Ticket</h1>
            <p>Join the Girls Who Yap Pre-Conference!</p>
            <div className="button-group">
              <button className="btn-primary" onClick={() => setView('form')}>
                Get Ticket
              </button>
              {/* Changed to btn-text for lighter tone */}
              <button className="btn-text" onClick={() => setView('login')}>
                Already have one?
              </button>
            </div>
          </motion.div>
        )}

        {/* LOGIN VIEW */}
        {view === 'login' && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="ticket-card">
            <h2>Retrieve Ticket</h2>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                className="input-field"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            {error && <p className="error-msg">{error}</p>}
            <div className="button-group">
              <button className="btn-primary" onClick={() => checkExistingTicket(formData.email)} disabled={loading}>
                {loading ? <Loader2 className="spin" /> : "Find Ticket"}
              </button>
              <button className="btn-text" onClick={() => setView('landing')}>Back</button>
            </div>
          </motion.div>
        )}

        {/* FORM VIEW */}
        {view === 'form' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="ticket-card">
            <h2>Ticket Ticket !!</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="input-field"/>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="input-field"/>
              </div>
              <div className="form-group">
                <label>Photo</label>
                <div className="file-upload">
                  <input type="file" id="file" accept="image/*" onChange={handleImageChange} />
                  <label htmlFor="file" className="file-label">
                    {formData.imagePreview ? (
                      <img src={formData.imagePreview} className="preview-img" alt="Preview" />
                    ) : (
                      <>
                        <Upload size={24} />
                        <span>Upload Photo</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
              {error && <p className="error-msg">{error}</p>}
              <div className="button-group">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? <Loader2 className="spin" /> : "Generate Ticket"}
                </button>
                <button type="button" className="btn-text" onClick={() => setView('landing')}>Cancel</button>
              </div>
            </form>
          </motion.div>
        )}

        {/* TICKET VIEW */}
        {view === 'ticket' && ticketData && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="ticket-display-wrapper">
            <h2>Your Ticket is Ready!</h2>
            
            {/* DOM PREVIEW */}
            <div className="ticket-visual" style={{
              '--avatar-x': `${TICKET_CONFIG.avatar.x}%`,
              '--avatar-y': `${TICKET_CONFIG.avatar.y}%`,
              '--avatar-size': `${TICKET_CONFIG.avatar.size}%`,
              
              '--seat-x': `${TICKET_CONFIG.seat.x}%`,
              '--seat-y': `${TICKET_CONFIG.seat.y}%`,
              '--seat-w': `${TICKET_CONFIG.seat.w}%`,
              '--seat-h': `${TICKET_CONFIG.seat.h}%`,
              '--seat-rot': `${TICKET_CONFIG.seat.rotation}deg`,

              '--row-x': `${TICKET_CONFIG.row.x}%`,
              '--row-y': `${TICKET_CONFIG.row.y}%`,
              '--row-w': `${TICKET_CONFIG.row.w}%`,
              '--row-h': `${TICKET_CONFIG.row.h}%`,
              '--row-rot': `${TICKET_CONFIG.row.rotation}deg`,

              '--qr-x': `${TICKET_CONFIG.qr.x}%`,
              '--qr-y': `${TICKET_CONFIG.qr.y}%`,
              '--qr-rot': `${TICKET_CONFIG.qr.rotation}deg`,
            }}>
              <img src="/ticket-bg.png" alt="Ticket" className="ticket-bg-img" />
              
              {/* Avatar */}
              <div className="ticket-avatar-container">
                <img src={ticketData.avatar_url || "./default-avatar.png"} alt="User" />
              </div>

              {/* Seat Box */}
              <div className="info-block seat-block">
                <div className="patch-pink"></div>
                {/* <span className="stub-label">SEAT</span> */}
                <span className="stub-value">{ticketData.seat_number}</span>
              </div>

              {/* Row Box */}
              <div className="info-block row-block">
                <div className="patch-pink"></div>
                {/* <span className="stub-label">ROW</span> */}
                <span className="stub-value">{ticketData.row_number}</span>
              </div>

              {/* QR Code */}
              <div className="qr-block">
                <div className="patch-yellow"></div>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GWY-${ticketData.email}`} alt="QR" />
              </div>
            </div>

            <button className="btn-primary download-btn" onClick={downloadTicket}>
              <Download size={20} /> Download Ticket
            </button>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TicketSection;