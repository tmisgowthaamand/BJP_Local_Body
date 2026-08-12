import React, { useState, useEffect } from 'react';
import API from '../../../utils/api';
import { useApplication } from '../../../context/ApplicationContext';
import StepNav from '../StepNav';
import { ALL_DISTRICTS } from '../../../data/tnLocalBodies';

const RURAL_POSITIONS = [
  'Village Panchayat Ward Member',
  'Village Panchayat President',
  'Panchayat Union Ward Member',
  'District Panchayat Ward Member'
];

const URBAN_POSITIONS = [
  'Town Panchayat',
  'Municipality',
  'Corporation'
];

const selectStyle = {
  width: '100%',
  height: '50px',
  padding: '0 16px',
  borderRadius: '10px',
  border: '1.5px solid #D6D6D6',
  fontSize: '15px',
  fontWeight: 600,
  backgroundColor: '#F9F9F9',
  outline: 'none',
  cursor: 'pointer',
  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
};

const labelStyle = {
  display: 'block',
  fontSize: '14px',
  fontWeight: 700,
  color: '#1A1A1A',
  marginBottom: '8px'
};

const Step06_LocalBodyDetails = () => {
  const { state, updateForm } = useApplication();

  const [bodyType, setBodyType]           = useState(state.body_type || 'rural');
  const [positionCard, setPositionCard]   = useState(state.position || '');
  const [selectedDistrict, setSelectedDistrict] = useState(state.district || '');
  const [selectedAssembly, setSelectedAssembly] = useState(state.assembly_name || '');
  const [selectedAssemblyNo, setSelectedAssemblyNo] = useState(state.assembly_no || '');
  const [selectedBooth, setSelectedBooth] = useState(state.ward_number || '');

  // DB-fetched lists
  const [assemblies, setAssemblies]   = useState([]);
  const [boothList, setBoothList]     = useState([]);
  const [loadingAss, setLoadingAss]   = useState(false);
  const [loadingBooth, setLoadingBooth] = useState(false);
  const [error, setError]             = useState('');

  // ── Fetch assemblies from voter DB when district changes ──────────────────
  useEffect(() => {
    if (!selectedDistrict) {
      setAssemblies([]);
      setBoothList([]);
      return;
    }
    setLoadingAss(true);
    setAssemblies([]);
    setBoothList([]);
    setSelectedAssembly('');
    setSelectedAssemblyNo('');
    setSelectedBooth('');

    API.get(`/registrations/assemblies?district=${encodeURIComponent(selectedDistrict)}`)
      .then(res => {
        if (res.data?.success) setAssemblies(res.data.assemblies || []);
        else setAssemblies([]);
      })
      .catch(() => setAssemblies([]))
      .finally(() => setLoadingAss(false));
  }, [selectedDistrict]);

  // ── Fetch booths from voter DB when assembly changes ─────────────────────
  useEffect(() => {
    if (!selectedAssemblyNo) {
      setBoothList([]);
      setSelectedBooth('');
      return;
    }
    setLoadingBooth(true);
    setBoothList([]);
    setSelectedBooth('');

    API.get(`/registrations/booths?assembly_no=${encodeURIComponent(selectedAssemblyNo)}`)
      .then(res => {
        if (res.data?.success) setBoothList(res.data.booths || []);
        else setBoothList([]);
      })
      .catch(() => setBoothList([]))
      .finally(() => setLoadingBooth(false));
  }, [selectedAssemblyNo]);

  const handleToggle = (type) => {
    setBodyType(type);
    setPositionCard('');
    setSelectedBooth('');
    setError('');
    updateForm({ body_type: type, position: '', ward_number: '' });
  };

  const handleDistrictChange = (dist) => {
    setSelectedDistrict(dist);
    setSelectedAssembly('');
    setSelectedAssemblyNo('');
    setSelectedBooth('');
    setError('');
  };

  const handleAssemblyChange = (assName, assNo) => {
    setSelectedAssembly(assName);
    setSelectedAssemblyNo(assNo);
    setSelectedBooth('');
    setError('');
  };

  const handleSelectBooth = (boothId) => {
    setSelectedBooth(boothId);
    setError('');
  };

  const handleNext = () => {
    if (!positionCard) { setError('Please select the position you are contesting'); return false; }
    if (!selectedDistrict) { setError('Please select your District'); return false; }
    if (!selectedAssembly) { setError('Please select your Assembly Constituency'); return false; }
    if (bodyType === 'urban' && !selectedBooth) { setError('Please select your Booth Number'); return false; }

    updateForm({
      district: selectedDistrict,
      assembly_name: selectedAssembly,
      assembly_no: selectedAssemblyNo,
      body_type: bodyType,
      position: positionCard,
      union_or_municipality: selectedAssembly,
      panchayat_or_corporation: selectedAssembly,
      ward_number: bodyType === 'urban' ? String(selectedBooth) : 'N/A'
    });
    return true;
  };

  const currentPositions = bodyType === 'rural' ? RURAL_POSITIONS : URBAN_POSITIONS;

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: '36px 32px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
      border: '1px solid #E0E0E0',
      borderTop: '4px solid #FF6600'
    }}>

      {/* Step label */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#FF6600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
          03 YOUR CONSTITUENCY
        </div>
      </div>

      {/* 1. Rural / Urban toggle */}
      <div style={{ marginBottom: '28px' }}>
        <label style={labelStyle}>Local body type</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[['rural', 'Rural Local Body', 'Panchayats, Unions, District Panchayat'],
            ['urban', 'Urban Local Body', 'Town Panchayats, Municipalities, Corporations']
          ].map(([val, title, sub]) => (
            <div
              key={val}
              onClick={() => handleToggle(val)}
              style={{
                backgroundColor: bodyType === val ? '#FFF8F3' : '#FFFFFF',
                border: bodyType === val ? '2px solid #FF6600' : '1.5px solid #E0E0E0',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: bodyType === val ? '0 4px 14px rgba(255,102,0,0.12)' : 'none'
              }}
            >
              <div style={{ fontSize: '16px', fontWeight: 800, color: bodyType === val ? '#FF6600' : '#1A1A1A', marginBottom: '6px' }}>{title}</div>
              <div style={{ fontSize: '13px', color: '#666', lineHeight: 1.4, fontWeight: 500 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Position */}
      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Position you're contesting</label>
        <select
          value={positionCard}
          onChange={e => { setPositionCard(e.target.value); setSelectedBooth(''); setError(''); }}
          style={{ ...selectStyle, color: positionCard ? '#1A1A1A' : '#757575' }}
        >
          <option value="">Select position</option>
          {currentPositions.map((pos, i) => <option key={i} value={pos}>{pos}</option>)}
        </select>
      </div>

      {/* 3. District */}
      {positionCard && (
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>District</label>
          <select
            value={selectedDistrict}
            onChange={e => handleDistrictChange(e.target.value)}
            style={{ ...selectStyle, color: selectedDistrict ? '#1A1A1A' : '#757575' }}
          >
            <option value="">Select District</option>
            {ALL_DISTRICTS.map((d, i) => <option key={i} value={d}>{d}</option>)}
          </select>
        </div>
      )}

      {/* 4. Assembly — loaded from voter DB */}
      {positionCard && selectedDistrict && (
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Assembly Constituency</label>
          {loadingAss ? (
            <div style={{ padding: '12px 16px', background: '#FFF8F3', borderRadius: 10, fontSize: 14, color: '#FF6600', fontWeight: 600 }}>
              ⏳ Loading assemblies from voter DB…
            </div>
          ) : assemblies.length === 0 ? (
            <div style={{ padding: '12px 16px', background: '#FFF3E0', borderRadius: 10, fontSize: 14, color: '#999', fontWeight: 500 }}>
              No assemblies found for {selectedDistrict}
            </div>
          ) : (
            <select
              value={selectedAssembly}
              onChange={e => {
                const opt = e.target.selectedOptions[0];
                handleAssemblyChange(opt.value, opt.dataset.no || '');
              }}
              style={{ ...selectStyle, color: selectedAssembly ? '#1A1A1A' : '#757575' }}
            >
              <option value="">Select Assembly Constituency</option>
              {assemblies.map(ac => (
                <option key={ac.assembly_no} value={ac.assembly_name} data-no={ac.assembly_no}>
                  No. {ac.assembly_no} — {ac.assembly_name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* 5. Booth — loaded from voter DB ONLY FOR URBAN */}
      {bodyType === 'urban' && positionCard && selectedDistrict && selectedAssembly && (
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ ...labelStyle, margin: 0 }}>Booth Number</label>
            <span style={{ fontSize: '13px', fontWeight: 700, color: selectedBooth ? '#FF6600' : '#757575' }}>
              {selectedBooth ? `Booth ${selectedBooth}` : 'None selected'}
            </span>
          </div>

          {loadingBooth ? (
            <div style={{ padding: '12px 16px', background: '#FFF8F3', borderRadius: 10, fontSize: 14, color: '#FF6600', fontWeight: 600 }}>
              ⏳ Loading booth numbers from voter DB…
            </div>
          ) : boothList.length === 0 ? (
            <div style={{ padding: '12px 16px', background: '#FFF3E0', borderRadius: 10, fontSize: 14, color: '#999' }}>
              No booths found for {selectedAssembly}
            </div>
          ) : (
            <div style={{
              border: '1.5px solid #E0E0E0',
              borderRadius: '12px',
              padding: '16px',
              backgroundColor: '#FAFAFA',
              maxHeight: '260px',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                {boothList.map(booth => {
                  const isSel = selectedBooth === booth.id;
                  return (
                    <button
                      key={booth.id}
                      type="button"
                      onClick={() => handleSelectBooth(booth.id)}
                      style={{
                        height: '42px',
                        borderRadius: '8px',
                        border: isSel ? '2px solid #FF6600' : '1.5px solid #D6D6D6',
                        backgroundColor: isSel ? '#FFF3E0' : '#FFFFFF',
                        color: isSel ? '#FF6600' : '#1A1A1A',
                        fontWeight: isSel ? 800 : 600,
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        outline: 'none',
                        boxShadow: isSel ? '0 2px 8px rgba(255,102,0,0.15)' : 'none'
                      }}
                    >
                      {booth.label}
                    </button>
                  );
                })}
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: '#999', textAlign: 'right' }}>
                {boothList.length} booths from voter DB · {selectedAssembly}
              </div>
            </div>
          )}
        </div>
      )}

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

export default Step06_LocalBodyDetails;
