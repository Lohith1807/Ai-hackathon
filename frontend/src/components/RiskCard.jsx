import React from 'react';
import { FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaHospitalAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const RiskCard = ({ result }) => {
  if (!result) return null;

  const { riskLevel, reasoning, recommendation } = result;

  const getRiskStyles = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return { bg: 'var(--risk-high)', text: 'var(--risk-high-text)', icon: <FaExclamationTriangle size={24} /> };
      case 'medium':
        return { bg: 'var(--risk-medium)', text: 'var(--risk-medium-text)', icon: <FaInfoCircle size={24} /> };
      case 'low':
        return { bg: 'var(--risk-low)', text: 'var(--risk-low-text)', icon: <FaCheckCircle size={24} /> };
      default:
        return { bg: '#e0e6ed', text: '#333', icon: <FaInfoCircle size={24} /> };
    }
  };

  const styles = getRiskStyles(riskLevel);

  // Hardcoded PHC list for Hackathon demo
  const phcs = [
    { name: 'City Central Primary Health Centre', phone: '1800-123-4567', distance: '1.2 km' },
    { name: 'Sunrise Community Clinic', phone: '1800-987-6543', distance: '3.5 km' },
    { name: 'Metro General Hospital', phone: '1800-111-2222', distance: '5.0 km' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card" 
      style={{ marginTop: '2rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', padding: '1rem', backgroundColor: styles.bg, color: styles.text, borderRadius: 'var(--border-radius)' }}>
        {styles.icon}
        <h3 style={{ textTransform: 'capitalize', margin: 0, fontSize: '1.5rem' }}>{riskLevel} Risk</h3>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Assessment</h4>
        <p style={{ color: 'var(--text-muted)' }}>{reasoning}</p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Recommendation</h4>
        <p style={{ fontWeight: 500 }}>{recommendation}</p>
      </div>

      {(riskLevel === 'medium' || riskLevel === 'high') && (
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <FaHospitalAlt /> Nearby Facilities
          </h4>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {phcs.map((phc, idx) => (
              <div key={idx} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', backgroundColor: '#f9fafb' }}>
                <p style={{ fontWeight: 'bold', margin: 0 }}>{phc.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.25rem 0' }}>{phc.distance}</p>
                <a href={`tel:${phc.phone}`} style={{ fontSize: '0.9rem', fontWeight: 500 }}>{phc.phone}</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default React.memo(RiskCard);
