import React, { useState, useMemo } from 'react';
import { Zap, TrendingUp, MapPin } from 'lucide-react';

// BJP Harmonious Color Palette
const BJP_COLORS = [
  '#FF6600', // BJP Saffron
  '#16A34A', // BJP Green
  '#1E3A8A', // Deep Chakra Blue
  '#D97706', // Golden Amber
  '#7C3AED'  // Royal Purple
];

/**
 * AssemblyPieChart — Visual Donut Pie Chart showing real Assembly Registration distribution with BJP Color Palette
 */
const AssemblyPieChart = ({ voters = [] }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Compute assembly breakdown from active candidate leads
  const chartData = useMemo(() => {
    // Standard Thiruvallur Assemblies
    const assemblyCounts = {
      'Gummidipoondi': 0,
      'Ponneri': 0,
      'Tiruttani': 0,
      'Thiruvallur': 0,
      'Poonamallee': 0
    };

    let totalLeads = voters.length || 0;

    voters.forEach((v) => {
      const assName = String(v.assemblyName || v.unionOrMunicipality || v.union_or_municipality || '').trim();
      if (assName && assemblyCounts[assName] !== undefined) {
        assemblyCounts[assName] += 1;
      } else if (assName) {
        const matched = Object.keys(assemblyCounts).find(k => k.toLowerCase().includes(assName.toLowerCase()) || assName.toLowerCase().includes(k.toLowerCase()));
        if (matched) assemblyCounts[matched] += 1;
        else {
          // Add dynamic assembly if not in default 5
          assemblyCounts[assName] = (assemblyCounts[assName] || 0) + 1;
        }
      }
    });

    const assembliesList = Object.keys(assemblyCounts).map((name) => {
      const count = assemblyCounts[name] || 0;
      return {
        name,
        count,
        speed: count > 0 ? `⚡ ${count} Live Registration${count > 1 ? 's' : ''}` : '💤 No Registrations Yet',
        status: count > 0 ? 'Active Candidate Lead' : 'No Leads'
      };
    });

    const totalVal = assembliesList.reduce((sum, a) => sum + a.count, 0);

    let cumulativeAngle = 0;
    const slices = assembliesList.map((item, idx) => {
      const percentage = totalVal > 0 ? (item.count / totalVal) * 100 : 0;
      const angle = totalVal > 0 ? (item.count / totalVal) * 360 : (360 / assembliesList.length);
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;
      cumulativeAngle = endAngle;

      return {
        ...item,
        percentage: percentage.toFixed(1),
        startAngle,
        endAngle,
        color: BJP_COLORS[idx % BJP_COLORS.length]
      };
    });

    return { slices, total: totalVal };
  }, [voters]);

  // Helper to draw SVG Arc Slices for Donut
  const getArcPath = (cx, cy, rInner, rOuter, startAngleDeg, endAngleDeg) => {
    let diff = endAngleDeg - startAngleDeg;
    if (diff >= 359.99) endAngleDeg = startAngleDeg + 359.9;

    const startRad = ((startAngleDeg - 90) * Math.PI) / 180;
    const endRad = ((endAngleDeg - 90) * Math.PI) / 180;

    const x1Outer = cx + rOuter * Math.cos(startRad);
    const y1Outer = cy + rOuter * Math.sin(startRad);
    const x2Outer = cx + rOuter * Math.cos(endRad);
    const y2Outer = cy + rOuter * Math.sin(endRad);

    const x1Inner = cx + rInner * Math.cos(endRad);
    const y1Inner = cy + rInner * Math.sin(endRad);
    const x2Inner = cx + rInner * Math.cos(startRad);
    const y2Inner = cy + rInner * Math.sin(startRad);

    const largeArcFlag = diff > 180 ? 1 : 0;

    return `M ${x1Outer} ${y1Outer} A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer} L ${x1Inner} ${y1Inner} A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${x2Inner} ${y2Inner} Z`;
  };

  const activeSlice = hoveredIdx !== null ? chartData.slices[hoveredIdx] : null;

  return (
    <div className="campsite-card" style={{ width: '100%', padding: '24px', boxSizing: 'border-box', marginTop: '24px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: '#fff7ed', color: '#FF6600', padding: '6px', borderRadius: '8px', display: 'inline-flex' }}>
              <Zap size={18} />
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Assembly Wise Candidate Registration Distribution
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 32px' }}>
            Real-time candidate registration distribution across Assembly Constituencies
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '6px 12px', borderRadius: '20px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: '700', color: '#16a34a' }}>
          <TrendingUp size={14} /> Real-Time Analytics
        </div>
      </div>

      {/* Body: Donut Pie Chart + Assembly Breakdown List */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '32px' }}>

        {/* Donut Chart SVG */}
        <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <svg width="250" height="250" viewBox="0 0 250 250" style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.06))' }}>
            <g transform="translate(0, 0)">
              {chartData.slices.map((slice, idx) => {
                const isHovered = hoveredIdx === idx;
                const rIn = 65;
                const rOut = isHovered ? 112 : 105;

                return (
                  <path
                    key={slice.name}
                    d={getArcPath(125, 125, rIn, rOut, slice.startAngle, slice.endAngle)}
                    fill={slice.color}
                    opacity={hoveredIdx === null || isHovered ? 1 : 0.45}
                    style={{
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />
                );
              })}
            </g>

            {/* Inner Donut Text */}
            <circle cx="125" cy="125" r="60" fill="#ffffff" />
            <text x="125" y="115" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="700">
              TOTAL LEADS
            </text>
            <text x="125" y="140" textAnchor="middle" fill="#0f172a" fontSize="24" fontWeight="800">
              {activeSlice ? `${activeSlice.percentage}%` : `${chartData.total}`}
            </text>
            <text x="125" y="156" textAnchor="middle" fill="#FF6600" fontSize="10" fontWeight="700">
              {activeSlice ? activeSlice.name : 'Registrations'}
            </text>
          </svg>
        </div>

        {/* Assembly Speed Breakdown Grid */}
        <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {chartData.slices.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={item.name}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: isHovered ? '#fff7ed' : '#f8fafc',
                  border: isHovered ? `1.5px solid ${item.color}` : '1px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: item.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <MapPin size={11} color={item.color} /> {item.speed}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: item.color }}>
                    {item.count} Candidate{item.count !== 1 ? 's' : ''}
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>
                    {item.percentage}% Share
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};

export default AssemblyPieChart;
