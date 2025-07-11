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
          {account && poolManager ? (
            <Routes>
              <Route path="/" element={<Navigate to="/borrow" replace />} />
              <Route path="/borrow" element={<HomePage poolManager={poolManager} mockToken={mockToken} />} />
              <Route path="/invest" element={<HomePage poolManager={poolManager} mockToken={mockToken} />} />
              <Route path="/my-investments" element={
                <div className='container'>
                  <MyInvestmentsTab poolManager={poolManager} />
                </div>
              } />
              <Route path="/my-loans" element={
                <div className='container'>
                  <MyLoansTab />
                </div>
              } />
            </Routes>
          ) : (
            <div className='container'>
              <div className={styles.connectWalletContainer}>
                <button
                  className={styles.connectWalletButton}
                  onClick={connectWallet}
                >
                  Подключить кошелек
                </button>
              </div>
            </div>
          )}
        </main>
        <ChatAgent />
      </div>
    </BrowserRouter>
  );
}

export default App;
