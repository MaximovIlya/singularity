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
  const { connectWallet, account, poolManager } = useWeb3();

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Header />
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Navigate to="/borrow" replace />} />
            <Route path="/borrow" element={<HomePage />} />
            <Route path="/invest" element={<HomePage />} />
            <Route path="/my-investments" element={
              account && poolManager ? (
                <div className='container'>
                  <MyInvestmentsTab poolManager={poolManager} />
                </div>
              ) : (
                <div className='container'>
                  <div className={styles.connectWalletContainer}>
                    <button
                      className={styles.connectWalletButton}
                      onClick={connectWallet}
                    >
                      Подключить кошелек для просмотра инвестиций
                    </button>
                  </div>
                </div>
              )
            } />
            <Route path="/my-loans" element={
              account && poolManager ? (
                <div className='container'>
                  <MyLoansTab />
                </div>
              ) : (
                <div className='container'>
                  <div className={styles.connectWalletContainer}>
                    <button
                      className={styles.connectWalletButton}
                      onClick={connectWallet}
                    >
                      Подключить кошелек для просмотра займов
                    </button>
                  </div>
                </div>
              )
            } />
          </Routes>
        </main>
        <ChatAgent />
      </div>
    </BrowserRouter>
  );
}

export default App;
