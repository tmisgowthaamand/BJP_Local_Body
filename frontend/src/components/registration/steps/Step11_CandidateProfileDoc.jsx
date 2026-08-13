import React, { useState } from 'react';
import { useApplication } from '../../../context/ApplicationContext';
import StepNav from '../StepNav';
import API from '../../../utils/api';

const Step11_CandidateProfileDoc = () => {
  const { state, updateForm } = useApplication();
  const [docUrl, setDocUrl] = useState(state.profile_document_url || '');
  const [fileName, setFileName] = useState(state.profile_document_name || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const viewableUrl = docUrl;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit: Max 15MB
    if (file.size > 15 * 1024 * 1024) {
      setError('⚠️ Profile document size exceeds 15MB. Please select a PDF or Word file under 15MB.');
      return;
    }

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      setError('⚠️ Invalid file format. Please upload a PDF (.pdf) or Word document (.doc, .docx).');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result;
        try {
          const folderName = state.application_id || state.mobile || 'candidates';
          const res = await API.post('/registrations/upload-media', {
            fileData: base64Data,
            folderName,
            assetType: 'raw'
          });

          if (res.data.success) {
            setDocUrl(res.data.url);
            setFileName(file.name);
            updateForm({
              profile_document_url: res.data.url,
              profile_document_name: file.name
            });
          } else {
            setError(res.data.message || 'Failed to upload document to Cloudinary');
          }
        } catch (apiErr) {
          setError('Failed to upload file. Please try again.');
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('File processing error.');
      setUploading(false);
    }
  };

  const handleNext = () => {
    updateForm({
      profile_document_url: docUrl,
      profile_document_name: fileName
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
          STEP 11 — ELECTION CANDIDATE PROFILE DOCUMENT
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
            background: 'linear-gradient(135deg, #FF6600 0%, #FF8C00 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(255, 102, 0, 0.25)'
          }}
        >
          📄
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#1A1A1A' }}>
            Upload Candidate Profile Document <span style={{ fontSize: '13px', color: '#2E7D32' }}>(Optional)</span>
          </h2>
          <p style={{ fontSize: '13px', color: '#666666', margin: '3px 0 0 0', fontWeight: 500, lineHeight: 1.4 }}>
            Upload your election profile bio-data or candidate statement in PDF or Word format.
          </p>
        </div>
      </div>

      {/* File Dropzone */}
      <div style={{ marginBottom: '28px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#1A1A1A', marginBottom: '10px' }}>
          CANDIDATE ELECTION PROFILE FILE (PDF or Word, Max 15MB)
        </label>

        <div style={{
          border: '2px dashed #FF9933',
          backgroundColor: '#FFFBF7',
          borderRadius: '14px',
          padding: '30px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          position: 'relative'
        }}>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            disabled={uploading}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer'
            }}
          />
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>📁</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#FF6600', marginBottom: '6px' }}>
            {uploading ? '⏳ Uploading Document to Cloudinary...' : 'Click or Drag & Drop PDF / Word Document'}
          </div>
          <div style={{ fontSize: '12.5px', color: '#666666', fontWeight: 500 }}>
            Accepted Formats: <strong>.pdf</strong>, <strong>.doc</strong>, <strong>.docx</strong> (Maximum File Size: 15MB)
          </div>
        </div>

        {/* Uploaded File Badge & Embedded Preview */}
        {docUrl && (
          <div style={{ marginTop: '16px' }}>
            <div style={{
              padding: '14px 18px',
              backgroundColor: '#E8F5E9',
              borderRadius: '12px',
              border: '1px solid #A5D6A7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>✅</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#1B5E20' }}>
                    Document Uploaded to Cloudinary
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#2E7D32', wordBreak: 'break-all' }}>
                    {fileName || 'Candidate_Profile_Document.pdf'}
                  </div>
                </div>
              </div>
              <a
                href={viewableUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#1B5E20',
                  color: '#FFFFFF',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(27,94,32,0.3)'
                }}
              >
                👁️ View File
              </a>
            </div>

            {/* Embedded Live PDF Document Preview */}
            {docUrl && (
              <div style={{ marginTop: '14px', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid #2E7D32', backgroundColor: '#F8FAFC' }}>
                <div style={{ padding: '8px 14px', backgroundColor: '#1B5E20', color: '#FFFFFF', fontSize: '12px', fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>📖 LIVE DOCUMENT PREVIEW</span>
                  <a href={viewableUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#FFFFFF', fontSize: '11px', fontWeight: 700, textDecoration: 'underline' }}>
                    Open Fullscreen ↗
                  </a>
                </div>
                <iframe
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(viewableUrl)}&embedded=true`}
                  title="Document Preview"
                  width="100%"
                  height="340px"
                  style={{ border: 'none' }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div style={{
          padding: '12px 16px', backgroundColor: '#FFEBEE', color: '#C62828',
          borderRadius: '10px', fontSize: '13.5px', marginBottom: '20px',
          borderLeft: '4px solid #D32F2F', fontWeight: 600
        }}>
          ⚠️ {error}
        </div>
      )}

      <StepNav onNext={handleNext} />
    </div>
  );
};

export default Step11_CandidateProfileDoc;
