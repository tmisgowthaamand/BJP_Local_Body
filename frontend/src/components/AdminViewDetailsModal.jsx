import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import { X, User, Phone, MapPin, Award, Calendar, FileText, CheckCircle2, PhoneCall } from 'lucide-react';

const AdminViewDetailsModal = ({ application, onClose, onUpdateStatus, onOpenCallModal }) => {
  if (!application) return null;

  const [currentStatus, setCurrentStatus] = useState(application.status || 'Pending');
  const [adminNote, setAdminNote] = useState(application.adminNotes || '');
  const [savingNote, setSavingNote] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const statusOptions = ['Pending', 'Submitted', 'Processing', 'Completed', 'Called', 'Verified', 'Rejected'];

  const handleStatusChange = async (newStatus) => {
    setCurrentStatus(newStatus);
    if (onUpdateStatus) {
      await onUpdateStatus(application._id, { status: newStatus, notes: adminNote });
      setSuccessMsg(`Status updated to ${newStatus}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleSaveNote = async () => {
    setSavingNote(true);
    if (onUpdateStatus) {
      await onUpdateStatus(application._id, { status: currentStatus, notes: adminNote });
      setSuccessMsg('Member notes saved successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
    setSavingNote(false);
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="campsite-card" style={{
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        background: 'var(--color-paper-white)',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        boxSizing: 'border-box'
      }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-linen)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="tag-pill tag-sunlit" style={{ fontSize: '11px' }}>APPLICATION DETAILS</span>
              <StatusBadge status={currentStatus} />
            </div>
            <h2 className="text-heading" style={{ fontSize: '20px', margin: '4px 0 0' }}>
              Member Scheme Request Profile
            </h2>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '6px', borderRadius: '9999px' }}>
            <X size={18} />
          </button>
        </div>

        {successMsg && (
          <div className="tag-pill tag-success" style={{ width: '100%', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px' }}>
            <CheckCircle2 size={14} /> {successMsg}
          </div>
        )}

        {/* Member & Voter Information */}
        <div style={{ background: 'var(--color-fog-gray)', borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-slate)', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={14} color="var(--color-campfire-orange)" /> Member Demographic Profile
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', fontSize: '13px' }}>
            <div>
              <div style={{ color: 'var(--color-slate)', fontSize: '11px' }}>Voter Full Name</div>
              <div style={{ fontWeight: '700', color: 'var(--color-midnight-ink)', fontSize: '15px' }}>{application.full_name || application.voterName || 'Candidate'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--color-slate)', fontSize: '11px' }}>EPIC ID Number</div>
              <div style={{ fontWeight: '700', color: 'var(--color-midnight-ink)', fontFamily: 'var(--font-ui-monospace)' }}>{application.voter_epic || application.epicNo || '—'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--color-slate)', fontSize: '11px' }}>Mobile Contact</div>
              <div style={{ fontWeight: '600', color: 'var(--color-midnight-ink)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Phone size={12} color="var(--color-campfire-orange)" /> {application.mobile}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--color-slate)', fontSize: '11px' }}>Jurisdiction Location</div>
              <div style={{ fontWeight: '600', color: 'var(--color-midnight-ink)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} color="var(--color-campfire-orange)" /> {application.district} • {application.union_or_municipality || application.assemblyName}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--color-slate)', fontSize: '11px' }}>Polling Booth / Part No</div>
              <div style={{ fontWeight: '700', color: 'var(--color-midnight-ink)' }}>Booth #{application.booth_no || application.boothNo || '1'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--color-slate)', fontSize: '11px' }}>BJP Membership ID</div>
              <div style={{ fontWeight: '700', color: '#1B5E20' }}>{application.bjp_membership_id || 'Not Provided (Click Join)'}</div>
            </div>
          </div>
        </div>

        {/* ☁️ Cloudinary Media & Document Attachments Panel */}
        <div style={{ border: '1.5px solid #FF9933', backgroundColor: '#FFFBF7', borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#E65100', textTransform: 'uppercase', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ☁️ CLOUDINARY MEDIA & DOCUMENT ATTACHMENTS (ORGANISER INSPECTION)
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            
            {/* Candidate Photo Preview */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '10px', border: '1px solid #FFE0B2' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#E65100', marginBottom: '8px' }}>
                🖼️ CANDIDATE PROFILE PHOTO (MAX 10MB)
              </div>
              {application.photo_url ? (
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={application.photo_url}
                    alt="Candidate"
                    style={{ width: '100px', height: '100px', borderRadius: '10px', objectFit: 'cover', border: '2px solid #FF6600', marginBottom: '8px' }}
                  />
                  <div>
                    <a href={application.photo_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#1B5E20', fontWeight: 700 }}>
                      🔍 View High-Res Image
                    </a>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#888888', fontSize: '12.5px' }}>
                  No photo uploaded
                </div>
              )}
            </div>

            {/* Candidate Pitch Video Player */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '10px', border: '1px solid #FFE0B2' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#E65100', marginBottom: '8px' }}>
                🎥 CANDIDATE PITCH VIDEO
              </div>
              {application.video_url ? (
                <div>
                  <video
                    controls
                    src={application.video_url}
                    style={{ width: '100%', maxHeight: '120px', borderRadius: '8px', backgroundColor: '#000000', marginBottom: '6px' }}
                  />
                  <div style={{ fontSize: '12px' }}>
                    <a href={application.video_url} target="_blank" rel="noopener noreferrer" style={{ color: '#1877F2', fontWeight: 700 }}>
                      ▶️ Play / Open Video ↗
                    </a>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#888888', fontSize: '12.5px' }}>
                  No pitch video uploaded
                </div>
              )}
            </div>

            {/* Candidate Election Profile Document */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '10px', border: '1px solid #FFE0B2', gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#E65100', marginBottom: '8px' }}>
                📄 CANDIDATE ELECTION PROFILE DOCUMENT (PDF / WORD)
              </div>
              {application.profile_document_url ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#E8F5E9', padding: '12px 16px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>📄</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#1B5E20' }}>
                        Candidate Profile Bio-Data
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#2E7D32' }}>
                        Cloudinary Document Stream Ready
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                      href={application.profile_document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ backgroundColor: '#1B5E20', color: '#FFFFFF', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}
                    >
                      👁️ Open PDF / Word
                    </a>
                  </div>
                </div>
              ) : (
                <div style={{ color: '#888888', fontSize: '12.5px' }}>
                  No profile document uploaded by candidate.
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Candidate Strategy & Experience View */}
        <div style={{ background: 'var(--color-fog-gray)', borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-slate)', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={14} color="var(--color-campfire-orange)" /> Ward Strategy & Work Experience
          </div>

          <div style={{ fontSize: '13px', color: 'var(--color-midnight-ink)', marginBottom: '10px' }}>
            <strong>🎯 Ward Winning Strategy:</strong> {application.win_strategy || 'Not provided'}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-midnight-ink)', marginBottom: '10px' }}>
            <strong>📝 Work Experience:</strong> {application.work_experience || application.local_understanding || 'Not provided'}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-midnight-ink)' }}>
            <strong>🏛️ Gov Profile:</strong> {application.gov_profile || 'None'}
          </div>
        </div>

        {/* Status Update & Remarks Action Panel */}
        <div style={{ border: '1px solid var(--color-linen)', borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-slate)', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={14} color="var(--color-campfire-orange)" /> Update Application Status & Notes
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-midnight-ink)', display: 'block', marginBottom: '6px' }}>
                Update Request Status
              </label>
              <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="form-control"
                style={{ fontWeight: '600', color: 'var(--color-midnight-ink)', background: 'var(--color-paper-white)' }}
              >
                {statusOptions.map((st) => (
                  <option key={st} value={st}>
                    {st === 'Processing' ? 'Processing (In Progress)' : st === 'Completed' ? 'Completed (Approved)' : st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-midnight-ink)', display: 'block', marginBottom: '6px' }}>
                Quick Phone Tele-calling
              </label>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenCallModal) onOpenCallModal(application);
                }}
                className="btn btn-filled"
                style={{ width: '100%', padding: '9px', fontSize: '13px' }}
              >
                <PhoneCall size={14} /> Call Voter & Log Result
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-midnight-ink)', display: 'block', marginBottom: '6px' }}>
              Admin Member Remarks / Verification Notes
            </label>
            <textarea
              rows={3}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Enter internal verification remarks, document checks, or tele-calling responses..."
              className="form-control"
              style={{ fontSize: '13px' }}
            />
            <button
              type="button"
              onClick={handleSaveNote}
              disabled={savingNote}
              className="btn btn-ghost"
              style={{ marginTop: '10px', fontSize: '12px', padding: '6px 14px' }}
            >
              {savingNote ? 'Saving...' : 'Save Remarks & Notes'}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={async () => {
              if (window.confirm('⚠️ Are you sure you want to remove/delete this candidate registration?')) {
                try {
                  await API.delete(`/registrations/${application._id}`);
                  alert('Candidate registration removed successfully.');
                  onClose();
                  window.location.reload();
                } catch (err) {
                  alert('Failed to remove registration.');
                }
              }
            }}
            style={{ backgroundColor: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2', padding: '8px 16px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
          >
            🗑️ Remove Candidate Application
          </button>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '8px 20px' }}>
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminViewDetailsModal;


