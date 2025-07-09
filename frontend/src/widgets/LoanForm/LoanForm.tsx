import { useState } from 'react';
import { BorrowTab } from '../../pages/BorrowTab/BorrowTab';
import { InvestTab } from '../../pages/InvestTab/InvestTab';
import styles from './LoanForm.module.css';

enum Tabs {
  Borrow,
  Invest,
}

export const LoanForm = () => {
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.Borrow);

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsHeader}>
        <button
          className={`${styles.tabButton} ${activeTab === Tabs.Borrow ? styles.active : ''}`}
          onClick={() => setActiveTab(Tabs.Borrow)}
        >
          Взять в долг
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === Tabs.Invest ? styles.active : ''}`}
          onClick={() => setActiveTab(Tabs.Invest)}
        >
          Вложить
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === Tabs.Borrow && <BorrowTab />}
        {activeTab === Tabs.Invest && <InvestTab />}
      </div>
    </div>
  );
};
