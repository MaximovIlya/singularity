import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../widgets/Header/Header';
import { BorrowTab } from '../pages/BorrowTab/BorrowTab';
import { InvestTab } from '../pages/InvestTab/InvestTab';
import { ChatAgent } from '../widgets/ChatAgent/ChatAgent';
import styles from './App.module.css';

export type TabType = 'borrow' | 'invest';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('borrow');

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Header />
        <main className={styles.mainContent}>
          <div className='container'>
            <div className={styles.tabsContainer}>
              <div className={styles.tabsHeader}>
                <button
                  className={`${styles.tabButton} ${activeTab === 'borrow' ? styles.active : ''}`}
                  onClick={() => setActiveTab('borrow')}
                >
                  Взять в долг
                </button>
                <button
                  className={`${styles.tabButton} ${activeTab === 'invest' ? styles.active : ''}`}
                  onClick={() => setActiveTab('invest')}
                >
                  Вложить
                </button>
              </div>

              <div className={styles.tabContent}>
                {activeTab === 'borrow' && <BorrowTab />}
                {activeTab === 'invest' && <InvestTab />}
              </div>
            </div>
          </div>
        </main>
        <ChatAgent />
      </div>
    </BrowserRouter>
  );
}

export default App;
