import { BrowserRouter } from 'react-router-dom';
import { useWeb3 } from '../shared/providers/Web3Context';
import { ChatAgent } from '../widgets/ChatAgent/ChatAgent';
import { Header } from '../widgets/Header/Header';
import { LoanForm } from '../widgets/LoanForm/LoanForm';
import styles from './App.module.css';
import { useEffect, useState } from 'react';
import { Contract, contractAddress } from '../utils/contract';
import { poolManagerContract } from '../utils/contracts/poolManagerContract';
import { MyInvestmentsTab } from '../pages/MyInvestmentsTab/MyInvestmentsTab';

export type TabType = 'borrow' | 'invest' | 'my-investments';

function App() {
  const { connectWallet, account, provider, signer } = useWeb3();
  const [activeTab, setActiveTab] = useState<TabType>('borrow');
  const [readPoolManagerContract, setReadPoolManagerContract] =
    useState<Contract | null>(null);
  const [writePoolManagerContract, setWritePoolManagerContract] =
    useState<Contract | null>(null);

  useEffect(() => {
    if (!contractAddress) return;

    if (provider) {
      const readOnlyPoolManagerContract =
        poolManagerContract.getReadOnlyContract(provider);
      setReadPoolManagerContract(readOnlyPoolManagerContract);
    }

    if (signer) {
      const signingContract = poolManagerContract.getSigningContract(signer);
      setWritePoolManagerContract(signingContract);
    }
  }, [provider, signer]);

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Header setActiveTab={setActiveTab} />
        <main className={styles.mainContent}>
          <div className='container'>
            {account ? (
              <>
                {activeTab === 'my-investments' ? (
                  <MyInvestmentsTab
                    readContract={readPoolManagerContract}
                    writePoolManagerContract={writePoolManagerContract}
                  />
                ) : (
                  <LoanForm
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    writePoolManagerContract={writePoolManagerContract}
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
