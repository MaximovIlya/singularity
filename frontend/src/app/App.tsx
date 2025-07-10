import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useWeb3 } from '../shared/providers/Web3Context';
import { ChatAgent } from '../widgets/ChatAgent/ChatAgent';
import { Header } from '../widgets/Header/Header';
import styles from './App.module.css';
import { MyInvestmentsTab } from '../pages/MyInvestmentsTab/MyInvestmentsTab';
import { MyLoansTab } from '../pages/MyLoansTab/MyLoansTab';
import { HomePage } from '../pages/HomePage/HomePage';

export type TabType = 'borrow' | 'invest' | 'my-investments' | 'my-loans';

function App() {
  const { connectWallet, account, poolManager, mockToken } = useWeb3();

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Header />
        <main className={styles.main}>
          <div className='container'>
            {account && poolManager ? (
              <Routes>
                <Route path="/" element={<Navigate to="/borrow" replace />} />
                <Route path="/borrow" element={<HomePage poolManager={poolManager} mockToken={mockToken} />} />
                <Route path="/invest" element={<HomePage poolManager={poolManager} mockToken={mockToken} />} />
                <Route path="/my-investments" element={<MyInvestmentsTab poolManager={poolManager} />} />
                <Route path="/my-loans" element={<MyLoansTab />} />
              </Routes>
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
