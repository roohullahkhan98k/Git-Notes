import React, { useState } from 'react';
import styles from './Toggle.module.css';
import { CiOutlined, AppstoreOutlined } from '@ant-design/icons';

interface ToggleProps {
  onToggle: (view: 'list' | 'card') => void;
}

const Toggle: React.FC<ToggleProps> = ({ onToggle }) => {
  const [activeView, setActiveView] = useState<'list' | 'card'>('list');

  const handleToggle = (view: 'list' | 'card') => {
    setActiveView(view);
    onToggle(view);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Public</h2>
      <div className={styles.toggleContainer}>
        <button
          className={`${styles.button} ${activeView === 'list' ? styles.active : ''}`}
          onClick={() => handleToggle('list')}
        >
          <CiOutlined style={{ color: activeView === 'list' ? '#fff' : '#333' }} />
          <span style={{ color: activeView === 'list' ? '#fff' : '#333' }}>List</span>
        </button>
        <button
          className={`${styles.button} ${activeView === 'card' ? styles.active : ''}`}
          onClick={() => handleToggle('card')}
        >
          <AppstoreOutlined style={{ color: activeView === 'card' ? '#fff' : '#333' }} />
          <span style={{ color: activeView === 'card' ? '#fff' : '#333' }}>Card</span>
        </button>
      </div>
    </div>
  );
};

export default Toggle;