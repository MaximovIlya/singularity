import { BrowserRouter } from 'react-router-dom';
import { useWeb3 } from '../shared/providers/Web3Context';
import { ChatAgent } from '../widgets/ChatAgent/ChatAgent';
import { Header } from '../widgets/Header/Header';
import styles from './App.module.css';
import { useState } from 'react';
import { MyInvestmentsTab } from '../pages/MyInvestmentsTab/MyInvestmentsTab';
import { BorrowTab } from '../pages/BorrowTab/BorrowTab';
import { InvestTab } from '../pages/InvestTab/InvestTab';
import { MyLoansTab } from '../pages/MyLoansTab/MyLoansTab';

export type TabType = 'borrow' | 'invest' | 'my-investments' | 'my-loans';

function App() {
  const { connectWallet, account, poolManager, mockToken } = useWeb3();
  const [activeTab, setActiveTab] = useState<TabType>('borrow');

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Header setActiveTab={setActiveTab} />
        <main className={styles.main}>
          <div className='container'>
            {account && poolManager ? (
              <>
                {activeTab === 'borrow' && <BorrowTab />}
                {activeTab === 'invest' && (
                  <InvestTab poolManager={poolManager} mockToken={mockToken} />
                )}
                {activeTab === 'my-investments' && (
                  <MyInvestmentsTab poolManager={poolManager} />
                )}
                {activeTab === 'my-loans' && <MyLoansTab />}
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
