import { PiggyBank, TrendingUp, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './InvestTab.module.css';
import { PoolManagerContract } from '../../contracts/PoolManager';
import { MockTokenContract } from '../../contracts/MockToken';

type InvestTabProps = {
  poolManager: PoolManagerContract;
  mockToken: MockTokenContract | null;
};

type FormValues = {
  amount: string;
};

export const InvestTab: React.FC<InvestTabProps> = ({
  poolManager,
  mockToken,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<FormValues>();

  const invest = async (data: FormValues) => {
    if (!poolManager || !mockToken) return;
    setIsLoading(true);
    const amount = BigInt(data.amount) * BigInt('1000000000000000000');
    const amountAsString = amount.toString();

    try {
      await mockToken.approve(
        import.meta.env.VITE_POOL_MANAGER_CONTRACT_ADDRESS,
        amountAsString
      );
      await poolManager.deposit(
        import.meta.env.VITE_ASSEST_ADDRESS,
        amountAsString
      );
      alert('Инвестирование прошло успешно!');
    } catch (error) {
      console.error('Investment failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.investTab}>
      <form
        className={`${styles.investForm} card`}
        onSubmit={handleSubmit(invest)}
      >
        <h2 className={styles.formTitle}>
          <PiggyBank className={styles.titleIcon} />
          Инвестировать
        </h2>

        <div className={styles.amountInput}>
          <label>Сумма инвестиций</label>
          <input
            type='number'
            {...register('amount')}
            placeholder='Введите сумму'
            disabled={isLoading}
          />
        </div>

        <button
          className={styles.investButton}
          type='submit'
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className={`${styles.buttonIcon} ${styles.spinner}`} />
              Инвестирование...
            </>
          ) : (
            <>
              <TrendingUp className={styles.buttonIcon} />
              Инвестировать
            </>
          )}
        </button>
      </form>
    </div>
  );
};
