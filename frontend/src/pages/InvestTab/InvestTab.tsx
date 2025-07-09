import { PiggyBank, TrendingUp } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Contract } from '../../utils/contract';
import styles from './InvestTab.module.css';

type InvestTabProps = {
  writeContract: Contract | null;
};

type FormValues = {
  amount: string;
};

export const InvestTab: React.FC<InvestTabProps> = ({ writeContract }) => {
  const { register, handleSubmit } = useForm<FormValues>();

  const invest = (data: FormValues) => {
    if (!writeContract) return;
    const amount = BigInt(data.amount) * BigInt('1000000000000000000');
    writeContract.deposit(
      import.meta.env.VITE_ASSEST_ADDRESS,
      amount.toString()
    );
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
          />
        </div>

        <button className={styles.investButton} type='submit'>
          <TrendingUp className={styles.buttonIcon} />
          Инвестировать
        </button>
      </form>
    </div>
  );
};
