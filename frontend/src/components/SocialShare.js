import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import '../App.css';

// Social Share Component
const SocialShare = ({ imageUrl, onClose }) => {
  const [showQRCode, setShowQRCode] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);
  const [activeTab, setActiveTab] = useState('social'); // 'social' or 'email'
  
  // Generate sharing URL with proper branding
  const getShareUrl = () => {
    return `https://picapicabooth.app/share?from=picapica_booth&img=${encodeURIComponent(imageUrl)}`;
  };
  
  // Share to WeChat
  const shareToWeChat = () => {
    setShowQRCode(true);
    // Generate a real sharing link with proper branding
    setShareLink(getShareUrl());
  };
  
  // Share to Weibo
  const shareToWeibo = () => {
    const text = 'I took an awesome photo at Picapica Photo Booth!';
    const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(text)}&pic=${encodeURIComponent(imageUrl)}`;
    window.open(weiboUrl, '_blank');
  };
  
  // Copy link
  const copyLink = () => {
    const link = getShareUrl();
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Unable to copy link: ', err);
      });
  };
  
  // Share to Facebook
  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };
  
  // Share to Twitter/X
  const shareToTwitter = () => {
    const text = 'Check out my photo created with Picapica Booth! The free online photo booth app 📸';
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(getShareUrl())}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };
  
  // Share to Instagram (open instructions since direct sharing isn't possible)
  const shareToInstagram = () => {
    alert('To share to Instagram: Download your photo first, then upload it to Instagram from your device.');
  };
  
  // Invite friend
  const inviteFriend = (e) => {
    e.preventDefault();
    // Implement actual invitation functionality, like sending an email
    console.log(`Invitation email sent to: ${inviteEmail}`);
    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
      setInviteEmail('');
    }, 3000);
  };
  
  return (
    <div className="social-share-overlay">
      <div className="social-share-container">
        <div className="social-share-header">
          <h2><i className="fas fa-share-alt"></i> Share Your Picapica Booth Creation</h2>
          <button className="close-button" onClick={onClose}><i className="fas fa-times"></i></button>
        </div>
        
        <div className="social-share-content">
          <div className="share-image-preview">
            <img src={imageUrl} alt="Picapica Booth Photo Preview" />
            <div className="picapica-watermark">Created with PicapicaBooth.app</div>
          </div>
          
          <div className="share-tabs">
            <button 
              className={`tab-button ${activeTab === 'social' ? 'active' : ''}`}
              onClick={() => setActiveTab('social')}
            >
              <i className="fas fa-share-alt"></i> Social Media
            </button>
            <button 
              className={`tab-button ${activeTab === 'email' ? 'active' : ''}`}
              onClick={() => setActiveTab('email')}
            >
              <i className="fas fa-envelope"></i> Email Invite
            </button>
          </div>
          
          {activeTab === 'social' && (
            <div className="share-buttons-container">
              <div className="share-buttons">
                <button className="share-button facebook" onClick={shareToFacebook}>
                  <i className="fab fa-facebook"></i> Facebook
                </button>
                <button className="share-button twitter" onClick={shareToTwitter}>
                  <i className="fab fa-twitter"></i> Twitter/X
                </button>
                <button className="share-button instagram" onClick={shareToInstagram}>
                  <i className="fab fa-instagram"></i> Instagram
                </button>
                <button className="share-button wechat" onClick={shareToWeChat}>
                  <i className="fab fa-weixin"></i> WeChat
                </button>
                <button className="share-button weibo" onClick={shareToWeibo}>
                  <i className="fab fa-weibo"></i> Weibo
                </button>
                <button className="share-button copy" onClick={copyLink}>
                  <i className="fas fa-link"></i> {copied ? 'Link Copied!' : 'Copy Link'}
                </button>
              </div>
              
              {showQRCode && (
                <div className="qr-code-container">
                  <h3><i className="fas fa-qrcode"></i> Scan QR Code to Share</h3>
                  <QRCodeCanvas value={shareLink} size={180} bgColor="#ffffff" fgColor="#FF6B9D" />
                  <p className="qr-code-hint">Scan this QR code to share your Picapica Booth photo</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'email' && (
            <div className="invite-friend-section">
              <h3><i className="fas fa-envelope"></i> Invite Friends to Try Picapica Booth</h3>
              <p>Share the fun! Invite your friends to create their own photo strips with our free online photo booth.</p>
              <form onSubmit={inviteFriend}>
                <input 
                  type="email" 
                  placeholder="Enter friend's email" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
                <button type="submit" className="invite-button">
                  {inviteSent ? <><i className="fas fa-check"></i> Invitation Sent!</> : <><i className="fas fa-paper-plane"></i> Send Invitation</>}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialShare;
