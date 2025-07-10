import React from 'react';
import { LoanForm } from '../../widgets/LoanForm/LoanForm';
import { PoolManagerContract } from '../../contracts/PoolManager';
import { MockTokenContract } from '../../contracts/MockToken';
import styles from './HomePage.module.css';

interface HomePageProps {
  poolManager: PoolManagerContract;
  mockToken: MockTokenContract | null;
}

export const HomePage: React.FC<HomePageProps> = ({
  poolManager,
  mockToken,
}) => {
  return (
    <div className={styles.homePage}>
      <LoanForm poolManager={poolManager} mockToken={mockToken} />
    </div>
  );
}; 