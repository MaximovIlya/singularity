import { BrowserRouter } from 'react-router-dom';
import { useWeb3 } from '../shared/providers/Web3Context';
import { ChatAgent } from '../widgets/ChatAgent/ChatAgent';
import { Header } from '../widgets/Header/Header';
import { LoanForm } from '../widgets/LoanForm/LoanForm';
import styles from './App.module.css';
import { useState } from 'react';
import { MyInvestmentsTab } from '../pages/MyInvestmentsTab/MyInvestmentsTab';

export type TabType = 'borrow' | 'invest' | 'my-investments';

function App() {
  const { connectWallet, account, poolManager, mockToken } = useWeb3();
  const [activeTab, setActiveTab] = useState<TabType>('borrow');

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Header setActiveTab={setActiveTab} />
        <main className={styles.mainContent}>
          <div className='container'>
            {account && poolManager ? (
              <>
                {activeTab === 'my-investments' ? (
                  <MyInvestmentsTab poolManager={poolManager} />
                ) : (
                  <LoanForm
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    poolManager={poolManager}
                    mockToken={mockToken}
                  />
                )}
              </>
            ) : (
              <div className={styles.connectWalletContainer}>
                <button
                  className={styles.connectWalletButton}
                  onClick={connectWallet}
                >
                  Подключить кошелек
                </button>
              </div>
            )}
          </div>
        </main>
        <ChatAgent />
      </div>
    </BrowserRouter>
  );
}

export default App;
