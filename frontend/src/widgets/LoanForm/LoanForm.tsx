import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BorrowTab } from '../../pages/BorrowTab/BorrowTab';
import { InvestTab } from '../../pages/InvestTab/InvestTab';
import styles from './LoanForm.module.css';
import { PoolManagerContract } from '../../contracts/PoolManager';
import { MockTokenContract } from '../../contracts/MockToken';

interface LoanFormProps {
  poolManager: PoolManagerContract;
  mockToken: MockTokenContract | null;
}

export const LoanForm: React.FC<LoanFormProps> = ({
  poolManager,
  mockToken,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const TABS_MAP: Record<string, string> = {
    '/borrow': 'Взять в долг',
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
        {currentTab === '/invest' && (
          <InvestTab poolManager={poolManager} mockToken={mockToken} />
        )}
      </div>
    </div>
  );
};
