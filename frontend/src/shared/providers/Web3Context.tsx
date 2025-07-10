import { ethers } from 'ethers';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { connectWallet as connectWalletUtil } from '../../utils/wallet';
import { getStoredAccount, setStoredAccount } from '../../utils/localStorage';
import { PoolManagerContract } from '../../contracts/PoolManager';
import { InterestRateContract } from '../../contracts/InterestRate';
import { OracleContract } from '../../contracts/Oracle';
import { MockTokenContract } from '../../contracts/MockToken';

interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  account: string | null;
  poolManager: PoolManagerContract | null;
  interestRate: InterestRateContract | null;
  oracle: OracleContract | null;
  mockToken: MockTokenContract | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider = ({ children }: Web3ProviderProps) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [poolManager, setPoolManager] = useState<PoolManagerContract | null>(
    null
  );
  const [interestRate, setInterestRate] = useState<InterestRateContract | null>(
    null
  );
  const [oracle, setOracle] = useState<OracleContract | null>(null);
  const [mockToken, setMockToken] = useState<MockTokenContract | null>(null);

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);

        const storedAccount = getStoredAccount();
        if (storedAccount) {
          setAccount(storedAccount);
        }

        try {
          const signers = await provider.listAccounts();
          if (signers.length > 0) {
            const signer = signers[0];
            // const address = await signer.getAddress();
            setSigner(signer);
            // setAccount(address); //TODO - figure out what this does
            // setStoredAccount(address);
          }
        } catch (error) {
          console.error('Could not get accounts', error);
        }
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (provider && signer) {
      setPoolManager(new PoolManagerContract(provider, signer));
      setInterestRate(new InterestRateContract(provider, signer));
      setOracle(new OracleContract(provider, signer));
      setMockToken(new MockTokenContract(signer));
    } else {
      setPoolManager(null);
      setInterestRate(null);
      setOracle(null);
      setMockToken(null);
    }
  }, [provider, signer]);

  const connectWallet = async () => {
    try {
      const walletData = await connectWalletUtil();
      if (walletData.provider && walletData.signer && walletData.account) {
        setProvider(walletData.provider);
        setSigner(walletData.signer);
        setAccount(walletData.account);
        setStoredAccount(walletData.account);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setPoolManager(null);
    setInterestRate(null);
    setOracle(null);
    setMockToken(null);
    setStoredAccount(null);
  };

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        account,
        poolManager,
        interestRate,
        oracle,
        mockToken,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
