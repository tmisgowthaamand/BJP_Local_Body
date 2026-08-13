import React, { useState } from 'react';
import { useApplication } from '../../../context/ApplicationContext';
import StepNav from '../StepNav';
import API from '../../../utils/api';

const Step08_SocialMedia = () => {
  const { state, updateForm } = useApplication();
  const [facebook, setFacebook] = useState(state.facebook_url || '');
  const [instagram, setInstagram] = useState(state.instagram_url || '');
  const [twitter, setTwitter] = useState(state.twitter_url || '');
  const [youtube, setYoutube] = useState(state.youtube_url || '');
  const [pitchUrl, setPitchUrl] = useState(state.video_url || '');
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const handleNext = () => {
    updateForm({
      facebook_url: facebook.trim(),
      instagram_url: instagram.trim(),
      twitter_url: twitter.trim(),
      youtube_url: youtube.trim(),
      video_url: state.video_url || pitchUrl.trim()
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

        {/* Candidate Pitch Media (MP4 Video or Image Upload / Link) */}
        <div style={{
          padding: '22px 24px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: state.video_url ? '1.5px solid #2E7D32' : '1.5px solid #FF6600',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.2s ease'
        }}>
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🎬</span>
              <label style={{ fontSize: '13.5px', fontWeight: 800, color: '#1A1A1A', letterSpacing: '0.3px', margin: 0 }}>
                CANDIDATE PITCH MEDIA (MP4 VIDEO OR IMAGE UPLOAD / LINK)
              </label>
            </div>

            {state.video_url ? (
              <span style={{
                backgroundColor: '#E8F5E9',
                color: '#1B5E20',
                border: '1px solid #A5D6A7',
                fontSize: '11.5px',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <i className="bi bi-check-circle-fill" style={{ color: '#2E7D32', fontSize: '12px' }} />
                Pitch Media Uploaded
              </span>
            ) : (
              <span style={{
                backgroundColor: '#FFF3E0',
                color: '#E65100',
                border: '1px solid #FFE0B2',
                fontSize: '11.5px',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: '20px'
              }}>
                OPTIONAL PITCH
              </span>
            )}
          </div>

          <p style={{ fontSize: '12.5px', color: '#555555', margin: '0 0 16px 0', lineHeight: 1.45 }}>
            Upload a 1-minute video pitch or campaign image introducing yourself to voters, or enter a video link below.
          </p>

          {/* Dual Options Box: Option 1 (Upload File) + Option 2 (Paste Link URL) */}
          <div style={{
            backgroundColor: '#FAFAFA',
            padding: '20px',
            borderRadius: '14px',
            border: state.video_url ? '1.5px solid #2E7D32' : '1.5px dashed #FF9933',
            marginBottom: '16px'
          }}>
            {/* Option 1: File Upload */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#FF6600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                OPTION 1: UPLOAD VIDEO / IMAGE FILE
              </div>

              <input
                id="candidate-video-pitch-input"
                type="file"
                accept="video/mp4,video/quicktime,video/x-m4v,image/jpeg,image/png,image/webp"
                disabled={uploadingVideo}
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  if (file.size > 100 * 1024 * 1024) {
                    alert('⚠️ File size exceeds 100MB. Please select a smaller video or image.');
                    return;
                  }
                  setUploadingVideo(true);
                  const reader = new FileReader();
                  reader.onloadend = async () => {
                    try {
                      const folderName = state.application_id || state.mobile || 'candidates';
                      const isImg = file.type.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png|webp)$/i);
                      const assetType = isImg ? 'image' : 'video';

                      const res = await API.post('/registrations/upload-media', {
                        fileData: reader.result,
                        folderName,
                        assetType
                      });
                      if (res.data.success) {
                        setPitchUrl(res.data.url);
                        updateForm({ video_url: res.data.url });
                      } else {
                        alert('Failed to upload pitch media to Cloudinary.');
                      }
                    } catch (err) {
                      alert('Failed to upload pitch media: ' + (err.response?.data?.message || err.message));
                    } finally {
                      setUploadingVideo(false);
                    }
                  };
                  reader.readAsDataURL(file);
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <label
                  htmlFor="candidate-video-pitch-input"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    background: uploadingVideo ? '#94A3B8' : 'linear-gradient(135deg, #FF6600 0%, #E65100 100%)',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: uploadingVideo ? 'wait' : 'pointer',
                    boxShadow: uploadingVideo ? 'none' : '0 3px 10px rgba(255, 102, 0, 0.25)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <i className={uploadingVideo ? "bi bi-arrow-repeat spin" : (state.video_url ? "bi bi-arrow-repeat" : "bi bi-upload")} style={{ fontSize: '14px' }} />
                  <span>{uploadingVideo ? '⏳ Uploading Pitch Media (Max 100MB)... Please wait' : (state.video_url ? 'Change Video or Image File' : 'Upload MP4 Video or Image File')}</span>
                </label>

                <span style={{ fontSize: '11.5px', color: '#666666', fontWeight: 500 }}>
                  Supported: MP4, MOV, JPG, PNG, WEBP (Max 100MB)
                </span>
              </div>
            </div>

            {/* Divider OR */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E0E0E0' }} />
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#888888', backgroundColor: '#FAFAFA', padding: '0 8px' }}>
                ── OR ──
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E0E0E0' }} />
            </div>

            {/* Option 2: Paste Media URL Link */}
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                OPTION 2: PASTE YOUTUBE / DRIVE / REEL / MEDIA URL LINK
              </div>
              <input
                type="text"
                value={pitchUrl}
                onChange={(e) => {
                  const val = e.target.value;
                  setPitchUrl(val);
                  updateForm({ video_url: val.trim() });
                }}
                placeholder="https://youtube.com/watch?v=... or https://drive.google.com/..."
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '0 16px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13.5px',
                  fontWeight: 500,
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  outline: 'none'
                }}
              />
            </div>

            {state.video_url && (
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #E0E0E0' }}>
                {state.video_url.includes('cloudinary.com') || state.video_url.match(/\.(mp4|mov|m4v|jpg|jpeg|png|webp)($|\?)/i) ? (
                  <>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#1B5E20', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="bi bi-play-circle-fill" style={{ fontSize: '14px' }} />
                      Live Pitch Media Preview:
                    </div>
                    {state.video_url.match(/\.(jpg|jpeg|png|webp)($|\?)/i) || state.video_url.includes('/image/upload/') ? (
                      <img
                        src={state.video_url}
                        alt="Pitch Campaign Preview"
                        style={{ maxHeight: '220px', borderRadius: '8px', objectFit: 'contain', border: '1.5px solid #FF6600' }}
                      />
                    ) : (
                      <video
                        src={state.video_url}
                        controls
                        style={{ width: '100%', maxHeight: '220px', borderRadius: '8px', backgroundColor: '#000000' }}
                      />
                    )}
                  </>
                ) : (
                  <div style={{
                    padding: '10px 14px',
                    backgroundColor: '#E8F5E9',
                    borderRadius: '8px',
                    border: '1px solid #A5D6A7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1B5E20', wordBreak: 'break-all' }}>
                      ✅ Pitch Link Saved: <span style={{ fontWeight: 500, color: '#2E7D32' }}>{state.video_url}</span>
                    </div>
                    <a
                      href={state.video_url.startsWith('http') ? state.video_url : `https://${state.video_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        backgroundColor: '#1B5E20',
                        color: '#FFFFFF',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      🌐 Open Link ↗
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      <StepNav onNext={handleNext} />
    </div>
  );
};

export default Step08_SocialMedia;
