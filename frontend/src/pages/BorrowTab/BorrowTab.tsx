import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../../shared/providers/Web3Context';
import styles from './BorrowTab.module.css';
import { Calculator } from 'lucide-react';

const MOCK_TOKEN_ADDRESS_ERROR =
  'Mock token address not found in environment variables.';

export const BorrowTab: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<string | null>(null);
  const { poolManager } = useWeb3();

  const handleBorrow = async () => {
    if (!poolManager) {
      setError('PoolManager not available. Please connect your wallet.');
      return;
    }
    if (!amount) {
      setError('Please enter an amount.');
      return;
    }

    setLoading(true);
    setError(null);
    setTransaction(null);

    try {
      const tokenAddress = import.meta.env.VITE_ASSEST_ADDRESS as string;
      if (!tokenAddress) {
        throw new Error(MOCK_TOKEN_ADDRESS_ERROR);
      }

      const parsedAmount = ethers.parseUnits(amount, 18);
      const tx = await poolManager.borrow(tokenAddress, parsedAmount);
      setTransaction('Transaction sent! Waiting for confirmation...');

      await tx.wait();

      setTransaction(`Transaction successful! Hash: ${tx.hash}`);
      setAmount('');
    } catch (e: any) {
      console.error('Borrow failed:', e);
      setError(`Failed to borrow: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.borrowTab}>
      <div className={styles.amountInput}>
        <label>Сумма для получения</label>
        <input
          type='number'
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder='Введите сумму'
          disabled={loading}
        />
      </div>

      <button
        className={styles.getQuotesButton}
        onClick={handleBorrow}
        disabled={!amount || loading}
      >
        <Calculator className={styles.buttonIcon} />
        {loading ? 'Processing...' : 'Borrow'}
      </button>

      {transaction && (
        <div className={styles.successMessage}>{transaction}</div>
      )}
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};
