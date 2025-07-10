import { BorrowTab } from '../../pages/BorrowTab/BorrowTab';
import { InvestTab } from '../../pages/InvestTab/InvestTab';
import styles from './LoanForm.module.css';
import { TabType } from '../../app/App';
import { PoolManagerContract } from '../../contracts/PoolManager';
import { MockTokenContract } from '../../contracts/MockToken';

interface LoanFormProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  poolManager: PoolManagerContract;
  mockToken: MockTokenContract | null;
}

export const LoanForm: React.FC<LoanFormProps> = ({
  activeTab,
  setActiveTab,
  poolManager,
  mockToken,
}) => {
  const TABS_MAP: Record<string, string> = {
    borrow: 'Взять в долг',
    invest: 'Вложить',
  };

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsHeader}>
        {Object.keys(TABS_MAP).map(tab => (
          <button
            key={tab}
            className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab as TabType)}
          >
            {TABS_MAP[tab]}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'borrow' && <BorrowTab />}
        {activeTab === 'invest' && (
          <InvestTab poolManager={poolManager} mockToken={mockToken} />
        )}
      </div>
    </div>
  );
};
