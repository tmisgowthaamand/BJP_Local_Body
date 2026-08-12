import React, { useState } from 'react';
import { useApplication } from '../../../context/ApplicationContext';
import StepNav from '../StepNav';

const Step08_SocialMedia = () => {
  const { state, updateForm } = useApplication();
  const [facebook, setFacebook] = useState(state.facebook_url || '');
  const [instagram, setInstagram] = useState(state.instagram_url || '');
  const [twitter, setTwitter] = useState(state.twitter_url || '');
  const [youtube, setYoutube] = useState(state.youtube_url || '');

  const handleNext = () => {
    updateForm({
      facebook_url: facebook.trim(),
      instagram_url: instagram.trim(),
      twitter_url: twitter.trim(),
      youtube_url: youtube.trim()
    });
    return true;
  };

  return (
    <div className="step-card-container">

      {/* Step Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          fontSize: '13px',
          fontWeight: 800,
          color: '#FF6600',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '6px'
        }}>
          05 PUBLIC REACH & SOCIAL MEDIA
        </div>
      </div>

      {/* Hero Header Icon & Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '28px',
        padding: '20px',
        backgroundColor: '#FFF8F3',
        borderRadius: '14px',
        border: '1px solid #FFE0B2'
      }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1877F2 0%, #0056B3 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(24, 119, 242, 0.25)'
          }}
        >
          🌐
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#1A1A1A' }}>
            Social Media Profiles
          </h2>
          <p style={{ fontSize: '13px', color: '#666666', margin: '3px 0 0 0', fontWeight: 500, lineHeight: 1.4 }}>
            Optional handles and social media links to showcase public reach.
          </p>
        </div>
      </div>

      {/* Social Media Inputs List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
        
        {/* Facebook */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: '#1877F2', marginBottom: '8px' }}>
            <span style={{ fontSize: '16px' }}>📘</span> Facebook URL / Username
          </label>
          <input
            type="text"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
            placeholder="https://facebook.com/yourprofile"
            style={{
              width: '100%',
              height: '50px',
              padding: '0 16px',
              borderRadius: '10px',
              border: '1.5px solid #D6D6D6',
              fontSize: '14.5px',
              fontWeight: 500,
              backgroundColor: '#F9F9F9',
              color: '#1A1A1A',
              outline: 'none',
              transition: 'all 0.15s ease'
            }}
          />
        </div>

        {/* Instagram */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: '#E1306C', marginBottom: '8px' }}>
            <span style={{ fontSize: '16px' }}>📷</span> Instagram URL / Handle
          </label>
          <input
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="https://instagram.com/yourhandle"
            style={{
              width: '100%',
              height: '50px',
              padding: '0 16px',
              borderRadius: '10px',
              border: '1.5px solid #D6D6D6',
              fontSize: '14.5px',
              fontWeight: 500,
              backgroundColor: '#F9F9F9',
              color: '#1A1A1A',
              outline: 'none',
              transition: 'all 0.15s ease'
            }}
          />
        </div>

        {/* X / Twitter */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: '#14171A', marginBottom: '8px' }}>
            <span style={{ fontSize: '16px' }}>𝕏</span> X / Twitter URL / Username
          </label>
          <input
            type="text"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            placeholder="https://x.com/yourusername"
            style={{
              width: '100%',
              height: '50px',
              padding: '0 16px',
              borderRadius: '10px',
              border: '1.5px solid #D6D6D6',
              fontSize: '14.5px',
              fontWeight: 500,
              backgroundColor: '#F9F9F9',
              color: '#1A1A1A',
              outline: 'none',
              transition: 'all 0.15s ease'
            }}
          />
        </div>

        {/* YouTube */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: '#FF0000', marginBottom: '8px' }}>
            <span style={{ fontSize: '16px' }}>▶️</span> YouTube Channel URL
          </label>
          <input
            type="text"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
            placeholder="https://youtube.com/@yourchannel"
            style={{
              width: '100%',
              height: '50px',
              padding: '0 16px',
              borderRadius: '10px',
              border: '1.5px solid #D6D6D6',
              fontSize: '14.5px',
              fontWeight: 500,
              backgroundColor: '#F9F9F9',
              color: '#1A1A1A',
              outline: 'none',
              transition: 'all 0.15s ease'
            }}
          />
        </div>

      </div>

      <StepNav onNext={handleNext} />
    </div>
  );
};

export default Step08_SocialMedia;
