import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ethers } from 'ethers';
import {
  connectWallet as connectWalletUtil,
  contractABI,
  contractAddress,
} from '../../utils/contract';
import { getStoredAccount, setStoredAccount } from '../../utils/localStorage';

interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  account: string | null;
  contract: ethers.Contract | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  // Contract interaction methods
  approve: (
    spender: string,
    amount: string
  ) => Promise<ethers.TransactionResponse | null>;
  transfer: (
    to: string,
    amount: string
  ) => Promise<ethers.TransactionResponse | null>;
  transferFrom: (
    from: string,
    to: string,
    amount: string
  ) => Promise<ethers.TransactionResponse | null>;
  allowance: (owner: string, spender: string) => Promise<string | null>;
  balanceOf: (address: string) => Promise<string | null>;
  getDecimals: () => Promise<number | null>;
  getName: () => Promise<string | null>;
  getSymbol: () => Promise<string | null>;
  getTotalSupply: () => Promise<string | null>;
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
  const [contract, setContract] = useState<ethers.Contract | null>(null);

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
            const address = await signer.getAddress();
            setSigner(signer);
            setAccount(address);
            setStoredAccount(address);
          }
        } catch (error) {
          console.error('Could not get accounts', error);
        }
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (provider) {
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractABI,
        signer || provider
      );
      setContract(contractInstance);
    } else {
      setContract(null);
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
    setContract(null);
    setStoredAccount(null);
  };

  const approve = async (spender: string, amount: string) => {
    if (!contract) return null;
    try {
      const tx = await contract.approve(spender, ethers.parseEther(amount));
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error approving token:', error);
      return null;
    }
  };

  const transfer = async (to: string, amount: string) => {
    if (!contract) return null;
    try {
      const tx = await contract.transfer(to, ethers.parseEther(amount));
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error transferring token:', error);
      return null;
    }
  };

  const transferFrom = async (from: string, to: string, amount: string) => {
    if (!contract) return null;
    try {
      const tx = await contract.transferFrom(
        from,
        to,
        ethers.parseEther(amount)
      );
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error transferring token from:', error);
      return null;
    }
  };

  const allowance = async (owner: string, spender: string) => {
    if (!contract) return null;
    try {
      const value = await contract.allowance(owner, spender);
      return ethers.formatEther(value);
    } catch (error) {
      console.error('Error getting allowance:', error);
      return null;
    }
  };

  const balanceOf = async (address: string) => {
    if (!contract) return null;
    try {
      const balance = await contract.balanceOf(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      return null;
    }
  };

  const getDecimals = async () => {
    if (!contract) return null;
    try {
      return await contract.decimals();
    } catch (error) {
      console.error('Error getting decimals:', error);
      return null;
    }
  };

  const getName = async () => {
    if (!contract) return null;
    try {
      return await contract.name();
    } catch (error) {
      console.error('Error getting name:', error);
      return null;
    }
  };

  const getSymbol = async () => {
    if (!contract) return null;
    try {
      return await contract.symbol();
    } catch (error) {
      console.error('Error getting symbol:', error);
      return null;
    }
  };

  const getTotalSupply = async () => {
    if (!contract) return null;
    try {
      const totalSupply = await contract.totalSupply();
      return ethers.formatEther(totalSupply);
    } catch (error) {
      console.error('Error getting total supply:', error);
      return null;
    }
  };

  const value = {
    provider,
    signer,
    account,
    contract,
    connectWallet,
    disconnectWallet,
    approve,
    transfer,
    transferFrom,
    allowance,
    balanceOf,
    getDecimals,
    getName,
    getSymbol,
    getTotalSupply,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
