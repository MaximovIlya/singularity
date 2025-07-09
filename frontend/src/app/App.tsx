import { BrowserRouter } from 'react-router-dom';
import { useWeb3 } from '../shared/providers/Web3Context';
import { ChatAgent } from '../widgets/ChatAgent/ChatAgent';
import { Header } from '../widgets/Header/Header';
import { LoanForm } from '../widgets/LoanForm/LoanForm';
import styles from './App.module.css';

export type TabType = 'borrow' | 'invest';

function App() {
  const { connectWallet, account } = useWeb3();

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Header />
        <main className={styles.mainContent}>
          <div className='container'>
            {account ? (
              <LoanForm />
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
