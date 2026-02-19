import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Loader2, Linkedin, Instagram, Twitter, Check } from 'lucide-react';

import { supabase } from '../../supabaseClient'; 
import imageCompression from 'browser-image-compression';
import { Turnstile } from '@marsidev/react-turnstile';
import Cropper from 'react-easy-crop'; 
import './TicketSection.css'; 

const TICKET_CONFIG = {
  avatar: { x: 64.6, y: 50.6, size: 101.1 },
  seat: { x: 93.1, y: 23.1, w: 5.9, h: 17.8, rotation: -90.0, fontSize: 2.2 },
  row: { x: 93.1, y: 48.1, w: 5.9, h: 17.8, rotation: -90.0, fontSize: 2.2 },
  qr: { x: 88.6, y: 74.3, size: 25.3, rotation: 0.0 }
};

const MOBILE_TICKET_CONFIG = {
  avatar: { x: 64.6, y: 50.6, size: 101.1 },
  seat: { x: 92.8, y: 20.2, w: 4.5, h: 12, rotation: -90.0, fontSize: 0.8 },
  row: { x: 93.4, y: 46.2, w: 6, h: 16.1, rotation: -90.0, fontSize: 0.8 },
  qr: { x: 88.6, y: 74.3, size: 25.3, rotation: 0.0 }
};

// Map the hex codes to the exactly named images in the public folder
const TICKET_COLORS = [
  { id: 'pink', hex: '#E0596B', label: 'P' },
  { id: 'dorange', hex: '#F27405', label: 'O' },
  { id: 'lorange', hex: '#F4B112', label: 'Y' },
  { id: 'mellow', hex: '#FFDE9E', label: 'o' }
];

const SHARE_CAPTION = `Just got my ticket for the GWY Pre-Conference and I’m lowkey excited-excited 🥹✨
I thought it would be just another online thing…
but looking at what’s planned, speaker sessions, Talent Night, creator challenges, gaming rooms, live collabs with people across borders (!!)...it actually feels like something I want to show up for.
Also… merch raffles?
Gift vouchers?
DoraDelight ( i must tell you these treats are just wow..literally wow )
Okay GWY, I see you 👀💌
It’s free (which still feels unreal),
See you all there 🫶
And if you haven’t gotten yours yet… use the link ( https://gwyconf.xyz/ )
& drop my name in the referral section so I can also be eligible for the sweet treats 🥹✨
#GWYConf #DoraDora`;

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

// --- CROP UTILITY FUNCTIONS ---
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file) {
        file.name = 'cropped.jpg';
        resolve(file);
      } else {
        reject(new Error('Canvas is empty'));
      }
    }, 'image/jpeg');
  });
};

const TicketSection = () => {
  const [view, setView] = useState('landing'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ticketData, setTicketData] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState('');
  
  // Track selected ticket color, default to pink
  const [selectedColor, setSelectedColor] = useState('pink'); 
  
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // --- CROPPER STATES ---
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [rawImageStr, setRawImageStr] = useState(null); 

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    company: '',
    profession: '',
    referral: '',
    image: null,
    imagePreview: null
  });

  const canvasRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeConfig = isMobile ? MOBILE_TICKET_CONFIG : TICKET_CONFIG;

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
      setRawImageStr(URL.createObjectURL(file));
      setShowCropper(true);
      setError('');
    }
    e.target.value = null;
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropConfirm = async () => {
    try {
      const croppedBlob = await getCroppedImg(rawImageStr, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
      
      setFormData({
        ...formData,
        image: croppedFile,
        imagePreview: URL.createObjectURL(croppedBlob)
      });
      
      setShowCropper(false);
    } catch (e) {
      console.error(e);
      setError("Failed to crop image.");
    }
  };

  const handleShare = (platform) => {
    const copyToClipboard = async (text, successMessage) => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          const textArea = document.createElement("textarea");
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        setCopyFeedback(successMessage);
        setTimeout(() => setCopyFeedback(''), 3000);
      } catch (err) {
        console.error('Unable to copy', err);
        setCopyFeedback('Failed to copy caption.');
      }
    };

    let url = '';
    let msg = '';

    switch (platform) {
      case 'linkedin':
        url = 'https://www.linkedin.com/feed/?shareActive=true';
        msg = 'Caption copied! Paste it in your post...';
        break;
      case 'twitter':
        url = 'https://twitter.com/compose/tweet';
        msg = 'Caption copied! Paste and edit for Twitter...';
        break;
      case 'instagram':
        url = 'https://www.instagram.com/';
        msg = 'Caption copied! Opening Instagram...';
        break;
      default:
        return;
    }
    
    window.open(url, '_blank');
    copyToClipboard(SHARE_CAPTION, msg);
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
      setError(err.message || "Error checking ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!captchaToken) {
      setError("Please complete the security check.");
      setLoading(false);
      return;
    }

    if (!formData.image) {
      setError("Please upload a photo to generate your ticket.");
      setLoading(false);
      return;
    }

    try {
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
            maxSizeMB: 0.2,          
            maxWidthOrHeight: 1200,  
            useWebWorker: true,
            fileType: 'image/jpeg'   
          };
          fileToUpload = await imageCompression(formData.image, options);
        } catch (compressionError) {
          console.error("Compression failed:", compressionError);
        }

        const fileExt = fileToUpload.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('ticket-avatars')
          .upload(fileName, fileToUpload);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('ticket-avatars')
          .getPublicUrl(fileName);
          
        avatarUrl = formData.imagePreview || publicUrlData.publicUrl;
      }

      const row = Math.floor(Math.random() * 50) + 1;
      const seat = Math.floor(Math.random() * 100) + 1;

      // DO NOT include ticket_color here to avoid Edge Function errors
      const newTicketPayload = {
        name: formData.name,
        email: formData.email,
        country: formData.country,
        company: formData.company,
        profession: formData.profession,
        referral: formData.referral,
        avatar_url: avatarUrl,
        row_number: row.toString().padStart(2, '0'),
        seat_number: seat.toString().padStart(2, '0')
      };

      const { data, error: functionError } = await supabase.functions.invoke('swift-action', {
        body: { 
          ticketData: newTicketPayload,
          captchaToken: captchaToken 
        }
      });

      if (functionError) throw new Error(functionError.message || "Failed to create ticket");
      if (data?.error) throw new Error(data.error);

      setTicketData(data.data);
      setView('ticket');

    } catch (err) {
      console.error(err);
      setError("Registration failed. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadTicket = () => {
    const canvas = canvasRef.current;
    if (!canvas || !ticketData) return;

    const ctx = canvas.getContext('2d');
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const w = canvas.width;
      const h = canvas.height;

      ctx.drawImage(img, 0, 0);

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
        
        const imgW = avatarImg.width;
        const imgH = avatarImg.height;
        const minSize = Math.min(imgW, imgH); 
        
        const startX = (imgW - minSize) / 2;
        const startY = (imgH - minSize) / 2;

        ctx.drawImage(
          avatarImg, 
          startX, startY, minSize, minSize, 
          centerX - radius, centerY - radius, radius * 2, radius * 2 
        );
        
        ctx.restore();
        
        drawDetails();
      }

      function drawDetails() {
        const stubBgColor = '#F1ECEB'; 
        const yellowColor = '#fef0c5';

        const drawBox = (config, value) => {
          const cx = w * (config.x / 100);
          const cy = h * (config.y / 100);
          const bw = w * (config.w / 100);
          const bh = h * (config.h / 100);

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(config.rotation * Math.PI / 180);
          ctx.fillStyle = stubBgColor;
          ctx.fillRect(-bw/2, -bh/2, bw, bh);
          ctx.fillStyle = "#000";
          ctx.textAlign = "center";
          const fontSizeNum = bw * 0.8;   
          ctx.font = `normal ${fontSizeNum}px Impact, sans-serif`;
          ctx.fillText(value, 0, bh * 0.35);
          ctx.restore();
        };

        drawBox(TICKET_CONFIG.seat, ticketData.seat_number);
        drawBox(TICKET_CONFIG.row, ticketData.row_number);

        const qrImg = new Image();
        qrImg.crossOrigin = "anonymous";
        qrImg.src = "/qr.png";
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

    img.onerror = () => {
      // Fallback: If .jpg is failing (404), try loading .png instead
      if (img.src.includes('.jpg')) {
        img.src = `/${selectedColor}.png`;
      }
    };
    
    // Start by attempting to load the .jpg version
    img.src = `/${selectedColor}.jpg`; 
  };

  return (
    <section className="ticket-section">
      <div className="ticket-container">
        
        {/* --- CROPPER MODAL --- */}
        {showCropper && (
          <div className="cropper-modal-overlay">
            <div className="cropper-modal">
              <div className="cropper-container">
                <Cropper
                  image={rawImageStr}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className="cropper-controls">
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(e.target.value)}
                  className="zoom-slider"
                />
                <div className="cropper-buttons">
                  <button className="btn-text" onClick={() => setShowCropper(false)}>Cancel</button>
                  <button className="btn-primary" onClick={handleCropConfirm}>Confirm Crop</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* <img src="/logo2.png" alt="Girls Who Yap" className="site-logo" style={{ borderRadius: '50%' , marginTop: view === 'ticket' ? '-120px' : '0'}}/> */}
        
        {/* LANDING VIEW */}
        {view === 'landing' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="ticket-card">
            <h1>Get Your Ticket</h1>
            <p>Join the Girls Who Yap <span className="highlight-text">Pre-Conference</span>!</p>
            <div className="button-group">
              <button className="btn-primary" onClick={() => setView('form')}>
                Get Ticket
              </button>
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
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="ticket-card wide-form">
            <h2><span style={{ fontWeight: 900 }}>Secure Your </span> <span className="highlight-text">Free Pass</span></h2> 
            <h6> (No registration fee. Limited curated seats.) </h6>
            <form onSubmit={handleSubmit}>
              
              <div className="form-split-layout">
                <div className="form-column">
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="input-field" placeholder="Full Name"/>
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="input-field" placeholder="email@example.com"/>
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input type="text" name="country" required value={formData.country} onChange={handleInputChange} className="input-field" placeholder="Your Country"/>
                  </div>
                </div>

                <div className="form-column">
                  <div className="form-group">
                    <label>Company/University Name</label>
                    <input type="text" name="company" required value={formData.company} onChange={handleInputChange} className="input-field" placeholder="Company or University"/>
                  </div>
                  <div className="form-group">
                    <label>Profession</label>
                    <select 
                      name="profession" 
                      required 
                      value={formData.profession} 
                      onChange={handleInputChange} 
                      className="input-field"
                    >
                      <option value="" disabled>Select Profession</option>
                      <option value="Creator">Creator</option>
                      <option value="Developer">Developer</option>
                      <option value="Founder">Founder</option>
                      <option value="Student">Student</option>
                      <option value="Community Builder">Community Builder</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Referred By</label>
                    <input type="text" name="referral" value={formData.referral} onChange={handleInputChange} className="input-field" placeholder="Referred By (Optional)"/>
                  </div>
                </div>
              </div>

              <div className="photo-section">
                <div className="form-group">
                  <label>Photo <span style={{ color: '#e74c3c' }}>*</span></label>
                  <div className="file-upload">
                    <input type="file" id="file" accept="image/*" onChange={handleImageChange} />
                    <label htmlFor="file" className="file-label">
                      {formData.imagePreview ? (
                        <img src={formData.imagePreview} className="preview-img" alt="Preview" />
                      ) : (
                        <>
                          <Upload size={22} />
                          <span>Upload Photo</span><br></br>
                          <span style={{ fontSize: '0.75rem', color: '#888', marginTop: '4px' }}>
                            (JPG/JPEG/PNG/WEBP only)
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="form-group" style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <Turnstile 
                  siteKey={TURNSTILE_SITE_KEY} 
                  onSuccess={setCaptchaToken}
                  onError={() => setError("CAPTCHA failed to load.")}
                />
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
            
            <h1 className="ticket-main-heading">You’re Officially In !</h1>
            <p className="ticket-sub-heading">
              Welcome to the <span className="highlight-text">"GWY Pre-Conference Global Experience"</span>
            </p>
            
            <div className="ticket-visual" style={{
              aspectRatio: '3 / 1', // Prevents layout collapsing if image loads slowly/fails
              '--avatar-x': `${activeConfig.avatar.x}%`,
              '--avatar-y': `${activeConfig.avatar.y}%`,
              '--avatar-size': `${activeConfig.avatar.size}%`,
              
              '--seat-x': `${activeConfig.seat.x}%`,
              '--seat-y': `${activeConfig.seat.y}%`,
              '--seat-w': `${activeConfig.seat.w}%`,
              '--seat-h': `${activeConfig.seat.h}%`,
              '--seat-rot': `${activeConfig.seat.rotation}deg`,
              
              '--row-x': `${activeConfig.row.x}%`,
              '--row-y': `${activeConfig.row.y}%`,
              '--row-w': `${activeConfig.row.w}%`,
              '--row-h': `${activeConfig.row.h}%`,
              '--row-rot': `${activeConfig.row.rotation}deg`,
              
              '--qr-x': `${activeConfig.qr.x}%`,
              '--qr-y': `${activeConfig.qr.y}%`,
              '--qr-rot': `${activeConfig.qr.rotation}deg`,
            }}>
              {/* Fallback pattern attached in case the .jpg file returns 404 */}
              <img 
                src={`/${selectedColor}.jpg`} 
                alt="Ticket" 
                className="ticket-bg-img"
                style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', margin: 0, padding: 0 }}
                onError={(e) => {
                  if (e.target.src.includes('.jpg')) {
                    e.target.src = `/${selectedColor}.png`;
                  }
                }}
              />
              <div className="ticket-avatar-container">
                <img src={ticketData.avatar_url || "./default-avatar.png"} alt="User" />
              </div>
              
              <div className="info-block seat-block" style={{ backgroundColor: '#F1ECEB' }}>
                <span className="stub-value" style={{ fontSize: `${activeConfig.seat.fontSize}rem` }}>
                  {ticketData.seat_number}
                </span>
              </div>
              
              <div className="info-block row-block" style={{ backgroundColor: '#F1ECEB' }}>
                <span className="stub-value" style={{ fontSize: `${activeConfig.row.fontSize}rem` }}>
                  {ticketData.row_number}
                </span>
              </div>
              
              <div className="qr-block">
                <div className="patch-yellow"></div>
                <img src="/qr.png" alt="Ticket QR Code" style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }} />
              </div>
            </div>

            {/* COLOR SELECTION SECTION */}
            <div className="theme-selection-wrapper" style={{ margin: '25px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>Customize Your Ticket Theme</p>
              <div style={{ display: 'flex', gap: '15px' }}>
                {TICKET_COLORS.map((color) => (
                  <div
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      backgroundColor: color.hex,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: selectedColor === color.id ? '4px solid #333' : '2px solid transparent',
                      boxShadow: selectedColor === color.id ? '0 4px 8px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    title={`Select ${color.id} theme`}
                  />
                ))}
              </div>
            </div>

            <button className="btn-primary download-btn" onClick={downloadTicket}>
              <Download size={20} /> Download Ticket
            </button>

            <div className="social-share-section">
              <p>Just tap your favourite social platform below, your <span className="highlight-text">ready-to-post caption</span> is already waiting, so go on…</p> 
              <p>share it, share it</p>
              <div className="social-icons">
                <button onClick={() => handleShare('linkedin')} className="social-icon" aria-label="Share on LinkedIn">
                  <Linkedin size={28} strokeWidth={1.5} />
                </button>
                <button onClick={() => handleShare('instagram')} className="social-icon" aria-label="Share on Instagram">
                  <Instagram size={28} strokeWidth={1.5} />
                </button>
                <button onClick={() => handleShare('twitter')} className="social-icon" aria-label="Share on Twitter">
                  <Twitter size={28} strokeWidth={1.5} />
                </button>
              </div>
              {copyFeedback && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="copy-feedback">
                  <Check size={16} /> {copyFeedback}
                </motion.div>
              )}
            </div>
            <br></br>
            
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' , color:'black'}}>Use the hashtag : <span className='highlight-text' style={{ fontWeight: 'bold', fontSize: '1.2rem'}}>#GWYConf #DoraDora</span> <br></br> <span style={{ fontWeight: 'bold', fontSize: '1.2rem' , color:'black'}}>Don't forget to Tag us: <span className='highlight-text' style={{ fontWeight: 'bold', fontSize: '1.2rem'}}>doradao</span></span></span>

            <div className="ticket-footer-text">
              <h2>See you inside the global room.</h2>
              <h2>The energy builds with <span className="highlight-text">you</span> !!</h2>
            </div>

            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TicketSection;