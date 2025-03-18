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
  
  // Share to WeChat
  const shareToWeChat = () => {
    setShowQRCode(true);
    // Generate a real sharing link, using a placeholder for now
    setShareLink(`https://picapica.example.com/share?img=${encodeURIComponent(imageUrl)}`);
  };
  
  // Share to Weibo
  const shareToWeibo = () => {
    const text = 'I took an awesome photo at Picapica Photo Booth!';
    const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(text)}&pic=${encodeURIComponent(imageUrl)}`;
    window.open(weiboUrl, '_blank');
  };
  
  // Copy link
  const copyLink = () => {
    const link = `https://picapica.example.com/share?img=${encodeURIComponent(imageUrl)}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Unable to copy link: ', err);
      });
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
          <h2>Share Your Photo</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="social-share-content">
          <div className="share-image-preview">
            <img src={imageUrl} alt="Share Preview" />
          </div>
          
          <div className="share-buttons">
            <button className="share-button wechat" onClick={shareToWeChat}>
              <i className="icon-wechat"></i> WeChat Share
            </button>
            <button className="share-button weibo" onClick={shareToWeibo}>
              <i className="icon-weibo"></i> Weibo Share
            </button>
            <button className="share-button copy" onClick={copyLink}>
              <i className="icon-link"></i> {copied ? 'Link Copied' : 'Copy Link'}
            </button>
          </div>
          
          {showQRCode && (
            <div className="qr-code-container">
              <h3>Scan QR Code to Share</h3>
              <QRCodeCanvas value={shareLink} size={150} />
              <p className="qr-code-hint">Use WeChat to scan the QR code above to share with friends</p>
            </div>
          )}
          
          <div className="invite-friend-section">
            <h3>Invite Friends to Take Photos</h3>
            <form onSubmit={inviteFriend}>
              <input 
                type="email" 
                placeholder="Enter friend's email" 
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
              <button type="submit" className="invite-button">
                {inviteSent ? 'Invitation Sent' : 'Send Invitation'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialShare;
