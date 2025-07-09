import { BorrowTab } from '../../pages/BorrowTab/BorrowTab';
import { InvestTab } from '../../pages/InvestTab/InvestTab';
import { Contract } from '../../utils/contract';
import styles from './LoanForm.module.css';
import { TabType } from '../../app/App';

interface LoanFormProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  writePoolManagerContract: Contract | null;
}

export const LoanForm: React.FC<LoanFormProps> = ({
  activeTab,
  setActiveTab,
  writePoolManagerContract,
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
          <InvestTab writeContract={writePoolManagerContract} />
        )}
      </div>
    </div>
  );
};
