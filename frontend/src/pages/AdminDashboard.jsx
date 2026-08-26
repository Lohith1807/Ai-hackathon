import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import client from '../api/client';
import VoiceAssistant from '../components/VoiceAssistant';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await client.get('/admin/dashboard');
      setStats(res.data.data);
    } catch (err) {
      console.error("Failed to fetch admin stats", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading Dashboard...</div>;

  return (
    <div className="dashboard-container">
      <VoiceAssistant context="admin" stats={stats} />
      
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of hospital operations</p>
      </header>

      <div className="stats-grid">
        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3>Total Users</h3>
          <div className="stat-value">{stats?.overview?.totalUsers || 0}</div>
        </motion.div>

        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3>Total Doctors</h3>
          <div className="stat-value">{stats?.overview?.totalDoctors || 0}</div>
        </motion.div>

        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3>Total Appointments</h3>
          <div className="stat-value">{stats?.overview?.totalAppointments || 0}</div>
        </motion.div>
      </div>

      <div className="hospitals-section">
        <h2>Hospital Breakdown</h2>
        <div className="hospital-list">
          {stats?.hospitals?.map((hosp, i) => (
            <motion.div 
              key={hosp.id} 
              className="hospital-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
            >
              <div className="hosp-info">
                <h3>{hosp.name}</h3>
                <p>{hosp.location}</p>
              </div>
              <div className="hosp-stats">
                <span className="badge doctors-badge">{hosp._count.doctors} Doctors</span>
                <span className="badge appt-badge">{hosp._count.appointments} Appointments</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .dashboard-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .dashboard-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }
        .dashboard-header h1 {
          font-size: 2rem;
          color: #1e3c72;
          margin: 0;
        }
        .dashboard-header p {
          color: #6b7280;
          margin-top: 0.5rem;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .stat-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          text-align: center;
          border-top: 4px solid #2a5298;
        }
        .stat-card h3 {
          color: #6b7280;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }
        .stat-value {
          font-size: 3rem;
          font-weight: 700;
          color: #111827;
        }
        .hospitals-section h2 {
          color: #374151;
          margin-bottom: 1.5rem;
        }
        .hospital-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .hospital-item {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .hosp-info h3 {
          margin: 0 0 0.25rem 0;
          color: #1f2937;
        }
        .hosp-info p {
          margin: 0;
          color: #6b7280;
          font-size: 0.9rem;
        }
        .hosp-stats {
          display: flex;
          gap: 1rem;
        }
        .badge {
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.85rem;
        }
        .doctors-badge {
          background: #dbeafe;
          color: #1e40af;
        }
        .appt-badge {
          background: #fce7f3;
          color: #be185d;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
