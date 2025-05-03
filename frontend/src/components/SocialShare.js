import React, { useState, useEffect } from "react";
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

  // 创建社交分享链接
  useEffect(() => {
    // 预先加载分享链接
    setShareLink(getShareUrl());

    // 添加社交分享脚本
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // 清理
      document.body.removeChild(script);
    };
  }, [imageUrl]);

  // Generate sharing URL with proper branding
  const getShareUrl = () => {
    return `https://picapicabooth.app/`;
  };

  // 通用分享函数 - 使用新标签页打开
  const shareToSocial = (url) => {
    try {
      // 创建一个隐藏的a标签
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';
      document.body.appendChild(link);

      // 模拟点击
      link.click();

      // 清理DOM
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);

      return true;
    } catch (error) {
      console.error('分享失败:', error);
      return false;
    }
  };

  // Share to WeChat
  const shareToWeChat = () => {
    setShowQRCode(true);
    setShareLink(getShareUrl());
  };

  // Share to Weibo
  const shareToWeibo = () => {
    const text = '我在Picapica Photo Booth拍了一张很棒的照片！';
    const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(getShareUrl())}&title=${encodeURIComponent(text)}&pic=${encodeURIComponent(imageUrl)}`;

    if (!shareToSocial(weiboUrl)) {
      alert('无法打开微博分享。请复制链接手动分享。');
    }
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
        console.error('无法复制链接: ', err);
        // 备用方案
        const textarea = document.createElement('textarea');
        textarea.value = link;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  // Share to Facebook
  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`;

    if (!shareToSocial(facebookUrl)) {
      alert('无法打开Facebook分享。请复制链接手动分享。');
    }
  };

  // Share to Twitter/X
  const shareToTwitter = () => {
    const text = 'Check out my photo created with Picapica Booth! The free online photo booth app 📸';
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(getShareUrl())}`;

    if (!shareToSocial(twitterUrl)) {
      // 备用方案
      const twitterLink = document.createElement('a');
      twitterLink.setAttribute('href', twitterUrl);
      twitterLink.setAttribute('target', '_blank');
      twitterLink.setAttribute('rel', 'noopener noreferrer');
      twitterLink.click();
    }
  };

  // Share to Instagram (open instructions since direct sharing isn't possible)
  const shareToInstagram = () => {
    alert('要分享到Instagram：请先下载照片，然后从您的设备上传到Instagram。');
  };

  // Invite friend
  const inviteFriend = (e) => {
    e.preventDefault();
    // 实现实际的邀请功能，如发送电子邮件
    console.log(`邀请邮件已发送至: ${inviteEmail}`);
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
          <button className="close-button" onClick={onClose} aria-label="Close share dialog"><i className="fas fa-times"></i></button>
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
                <button className="share-button copy" onClick={copyLink}>
                  <i className="fas fa-link"></i> {copied ? 'Link Copied!' : 'Copy Website Link'}
                </button>
              </div>
              {showQRCode && (
                <div className="qr-code-container">
                  <h3><i className="fas fa-qrcode"></i> Scan QR Code to Share</h3>
                  <QRCodeCanvas value={shareLink} size={180} bgColor="#ffffff" fgColor="#FF6B9D" />
                  <p className="qr-code-hint">Scan this QR code to share the Picapica Booth website</p>
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
