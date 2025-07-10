import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useWeb3 } from '../../shared/providers/Web3Context';
import styles from './MyInvestmentsTab.module.css';
import { PoolManagerContract } from '../../contracts/PoolManager';

type Investment = {
  amount: string;
  lastUpdated: string;
};

type FormValues = {
  amount: string;
};

type MyInvestmentsTabProps = {
  poolManager: PoolManagerContract;
};

export const MyInvestmentsTab: React.FC<MyInvestmentsTabProps> = ({
  poolManager,
}) => {
  const { account } = useWeb3();
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const { register, handleSubmit } = useForm<FormValues>();

  const withdraw = (data: FormValues) => {
    if (!poolManager) return;
    const amount = BigInt(data.amount) * BigInt('1000000000000000000');
    poolManager.withdraw(
      import.meta.env.VITE_ASSEST_ADDRESS,
      amount.toString()
    );
  };

  useEffect(() => {
    const fetchInvestment = async () => {
      if (!poolManager || !account) {
        return;
      }
      try {
        setLoading(true);
        const result = await poolManager.deposits(
          account,
          import.meta.env.VITE_ASSEST_ADDRESS
        );

        if (result && result.amount.toString() !== '0') {
          setInvestment({
            amount: (result.amount / 10n ** 18n).toString(),
            lastUpdated: new Date(
              Number(result.lastUpdated) * 1000
            ).toLocaleString(),
          });
        } else {
          setInvestment(null);
        }
      } catch (error) {
        console.error('Error fetching investment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestment();
  }, [poolManager, account]);

  return (
    <div className={styles.myInvestmentsTab}>
      <div className={`${styles.investmentsList} card`}>
        <h2 className={styles.formTitle}>Мои вложения</h2>
        {loading ? (
          <p>Loading...</p>
        ) : investment ? (
          <div
            className={styles.investmentItem}
            onClick={() => setShowWithdrawForm(!showWithdrawForm)}
          >
            <p>Amount: {investment.amount}</p>
            <p>Last Updated: {investment.lastUpdated}</p>
            {showWithdrawForm && (
              <form
                className={styles.withdrawForm}
                onSubmit={handleSubmit(withdraw)}
                onClick={e => e.stopPropagation()}
              >
                <div className={styles.amountInput}>
                  <label>Сумма для вывода</label>
                  <input
                    type="number"
                    {...register('amount')}
                    placeholder="Введите сумму"
                  />
                </div>
                <button className={styles.withdrawButton} type="submit">
                  Вывести
                </button>
              </form>
            )}
          </div>
        ) : (
          <p>No investments found.</p>
        )}
      </div>
    </div>
  );
};
