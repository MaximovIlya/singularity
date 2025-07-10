import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useWeb3 } from '../../shared/providers/Web3Context';
import styles from './MyLoansTab.module.css';
import { ethers } from 'ethers';
import { Loader2 } from 'lucide-react';

type Borrow = {
  amount: string;
  lastUpdated: string;
};

type FormValues = {
  amount: string;
};

export const MyLoansTab: React.FC = () => {
  const { account, poolManager, mockToken } = useWeb3();
  const [borrow, setBorrow] = useState<Borrow | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRepaying, setIsRepaying] = useState(false);
  const [showRepayForm, setShowRepayForm] = useState(false);
  const { register, handleSubmit } = useForm<FormValues>();

  const repay = async (data: FormValues) => {
    if (!poolManager || !mockToken) return;
    setIsRepaying(true);
    const amount = BigInt(data.amount) * BigInt('1000000000000000000');
    try {
      await mockToken.approve(
        import.meta.env.VITE_POOL_MANAGER_CONTRACT_ADDRESS,
        amount.toString()
      );
      await poolManager.repay(import.meta.env.VITE_ASSEST_ADDRESS, amount);
    } catch (error) {
      console.error('Error repaying loan:', error);
    } finally {
      setIsRepaying(false);
    }
  };

  useEffect(() => {
    const fetchBorrow = async () => {
      if (!poolManager || !account) {
        return;
      }
      try {
        setLoading(true);
        const result = await poolManager.borrows(
          account,
          import.meta.env.VITE_ASSEST_ADDRESS
        );

        if (result && result.amount.toString() !== '0') {
          setBorrow({
            amount: ethers.formatUnits(result.amount, 18),
            lastUpdated: new Date(
              Number(result.lastUpdated) * 1000
            ).toLocaleString(),
          });
        } else {
          setBorrow(null);
        }
      } catch (error) {
        console.error('Error fetching borrow:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrow();
  }, [poolManager, account]);

  return (
    <div className={styles.myLoansTab}>
      <div className={`${styles.loansList} card`}>
        <h2 className={styles.formTitle}>Мои займы</h2>
        {loading ? (
          <p>Loading...</p>
        ) : borrow ? (
          <div
            className={styles.loanItem}
            onClick={() => setShowRepayForm(!showRepayForm)}
          >
            <p>Amount: {borrow.amount}</p>
            <p>Last Updated: {borrow.lastUpdated}</p>
            {showRepayForm && (
              <form
                className={styles.repayForm}
                onSubmit={handleSubmit(repay)}
                onClick={e => e.stopPropagation()}
              >
                <div className={styles.amountInput}>
                  <label>Сумма для возмещения</label>
                  <input
                    type='number'
                    {...register('amount')}
                    placeholder='Введите сумму'
                  />
                </div>
                <button
                  className={styles.repayButton}
                  type='submit'
                  disabled={isRepaying}
                >
                  {isRepaying ? (
                    <>
                      <Loader2
                        className={`${styles.buttonIcon} ${styles.spinner}`}
                      />
                      Возмещение...
                    </>
                  ) : (
                    'Возместить'
                  )}
                </button>
              </form>
            )}
          </div>
        ) : (
          <p>No loans found.</p>
        )}
      </div>
    </div>
  );
};
