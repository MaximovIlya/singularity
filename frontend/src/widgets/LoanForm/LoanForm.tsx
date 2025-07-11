import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BorrowTab } from '../../pages/BorrowTab/BorrowTab';
import { InvestTab } from '../../pages/InvestTab/InvestTab';
import styles from './LoanForm.module.css';

export const LoanForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const TABS_MAP: Record<string, string> = {
    '/borrow': 'Займ под обеспечение',
    '/invest': 'Вложить',
  };

  const currentTab = location.pathname;

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsHeader}>
        {Object.keys(TABS_MAP).map(path => (
          <button
            key={path}
            className={`${styles.tabButton} ${currentTab === path ? styles.active : ''}`}
            onClick={() => navigate(path)}
          >
            {TABS_MAP[path]}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {currentTab === '/borrow' && <BorrowTab />}
        {currentTab === '/invest' && <InvestTab />}
      </div>
    </div>
  );
};
