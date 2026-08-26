import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = () => {
  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div style={{ height: '60px', backgroundColor: '#e2e8f0', borderRadius: 'var(--border-radius)', marginBottom: '1.5rem' }}></div>
        <div style={{ height: '24px', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '0.5rem', width: '30%' }}></div>
        <div style={{ height: '16px', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '0.5rem', width: '90%' }}></div>
        <div style={{ height: '16px', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '1.5rem', width: '80%' }}></div>
        
        <div style={{ height: '24px', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '0.5rem', width: '30%' }}></div>
        <div style={{ height: '16px', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '0.5rem', width: '60%' }}></div>
      </motion.div>
    </div>
  );
};

export default SkeletonLoader;
