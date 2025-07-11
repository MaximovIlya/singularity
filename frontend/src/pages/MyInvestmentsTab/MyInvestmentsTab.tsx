import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useWeb3 } from '../../shared/providers/Web3Context';
import styles from './MyInvestmentsTab.module.css';
import { PoolManagerContract } from '../../contracts/PoolManager';
import { Plus, Minus } from 'lucide-react';
import { ethers } from 'ethers';

type Investment = {
  amount: string;
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
  const { account, pToken } = useWeb3();
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  // Refs для управления повторяющимися действиями
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const fetchInvestment = useCallback(async () => {
    if (!account || !pToken) {
      setInvestment(null);
      return;
    }
    try {
      setLoading(true);
      const balance = await pToken.balanceOf(account);

      if (balance > 0n) {
        setInvestment({
          amount: ethers.formatUnits(balance, 6),
        });
      } else {
        setInvestment(null);
      }
    } catch (error) {
      console.error('Error fetching pToken balance:', error);
      setInvestment(null);
    } finally {
      setLoading(false);
    }
  }, [account, pToken]);

  const withdraw = async (data: FormValues) => {
    if (!poolManager) return;

    setLoading(true);
    try {
      const amount = ethers.parseUnits(data.amount, 6);
      await poolManager.withdraw(amount);
      await fetchInvestment();
      setWithdrawAmount('');
      setShowWithdrawForm(false);
    } catch (error) {
      console.error('Failed to withdraw:', error);
    } finally {
      setLoading(false);
    }
  };

  // Очистка таймеров
  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Функции для кнопок с ускорением при удержании
  const incrementAmount = useCallback(() => {
    setWithdrawAmount(prev => {
      const currentValue = parseFloat(prev) || 0;
      const maxAmount = parseFloat(investment?.amount || '0');
      const newValue = Math.min(maxAmount, currentValue + 1).toString();
      setValue('amount', newValue, { shouldValidate: true });
      return newValue;
    });
  }, [setValue, investment?.amount]);

  const decrementAmount = useCallback(() => {
    setWithdrawAmount(prev => {
      const currentValue = parseFloat(prev) || 0;
      const newValue = Math.max(0, currentValue - 1).toString();
      setValue('amount', newValue, { shouldValidate: true });
      return newValue;
    });
  }, [setValue]);

  const startRepeating = useCallback(
    (action: () => void) => {
      clearTimers(); // Очищаем предыдущие таймеры
      action(); // Первое выполнение сразу

      timeoutRef.current = window.setTimeout(() => {
        intervalRef.current = window.setInterval(action, 100);
      }, 500);
    },
    [clearTimers]
  );

  const stopRepeating = useCallback(() => {
    clearTimers();
  }, [clearTimers]);

  const handleIncrementStart = useCallback(() => {
    startRepeating(incrementAmount);
  }, [startRepeating, incrementAmount]);

  const handleDecrementStart = useCallback(() => {
    startRepeating(decrementAmount);
  }, [startRepeating, decrementAmount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Предотвращаем ввод отрицательных значений и значений больше доступной суммы
    if (value === '' || (parseFloat(value) >= 0 && !value.includes('-'))) {
      setWithdrawAmount(value);
      setValue('amount', value, { shouldValidate: true });
    }
  };

  const setMaxAmount = useCallback(() => {
    const maxAmount = investment?.amount || '0';
    setWithdrawAmount(maxAmount);
    setValue('amount', maxAmount, { shouldValidate: true });
  }, [setValue, investment?.amount]);

  // Очистка таймеров при размонтировании компонента
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  useEffect(() => {
    fetchInvestment();
  }, [fetchInvestment]);

  return (
    <div className={styles.myInvestmentsTab}>
      <div className={`${styles.investmentsList} card`}>
        <h2 className={styles.formTitle}>Мои вложения</h2>
        {loading ? (
          <div className={styles.loadingState}>Загрузка...</div>
        ) : investment ? (
          <div
            className={styles.investmentItem}
            onClick={() => setShowWithdrawForm(!showWithdrawForm)}
          >
            <p>Сумма: {investment.amount} PToken</p>
            {showWithdrawForm && (
              <form
                className={styles.withdrawForm}
                onSubmit={handleSubmit(withdraw)}
                onClick={e => e.stopPropagation()}
              >
                <div className={styles.amountInput}>
                  <label>Сумма для вывода</label>
                  <div className={styles.inputWrapper}>
                    <button
                      type='button'
                      className={styles.decrementButton}
                      onMouseDown={handleDecrementStart}
                      onMouseUp={stopRepeating}
                      onMouseLeave={stopRepeating}
                      onTouchStart={handleDecrementStart}
                      onTouchEnd={stopRepeating}
                      disabled={
                        loading ||
                        !withdrawAmount ||
                        parseFloat(withdrawAmount) <= 0
                      }
                      title='-1 (hold)'
                    >
                      <Minus className='icon' />
                    </button>
                    <input
                      type='number'
                      {...register('amount', {
                        required: 'Введите сумму для вывода',
                        min: {
                          value: 0.01,
                          message: 'Минимальная сумма для вывода: 0.01',
                        },
                        max: {
                          value: parseFloat(investment?.amount || '0'),
                          message: `Максимальная сумма для вывода: ${investment?.amount}`,
                        },
                        validate: value => {
                          const numValue = parseFloat(value);
                          const maxAmount = parseFloat(
                            investment?.amount || '0'
                          );
                          if (numValue > maxAmount) {
                            return `Сумма не может превышать ${investment?.amount}`;
                          }
                          return true;
                        },
                      })}
                      value={withdrawAmount}
                      onChange={handleAmountChange}
                      placeholder='0.00'
                      step='0.01'
                      min='0'
                      className={`${styles.amountField} ${errors.amount ? styles.inputError : ''}`}
                    />
                    <button
                      type="button"
                      className={styles.maxButton}
                      onClick={setMaxAmount}
                      disabled={loading || parseFloat(withdrawAmount || '0') >= parseFloat(investment?.amount || '0')}
                      title="Установить максимальную сумму"
                    >
                      MAX
                    </button>
                    <button
                      type="button"
                      className={styles.incrementButton}
                      onMouseDown={handleIncrementStart}
                      onMouseUp={stopRepeating}
                      onMouseLeave={stopRepeating}
                      onTouchStart={handleIncrementStart}
                      onTouchEnd={stopRepeating}
                      disabled={
                        loading ||
                        parseFloat(withdrawAmount || '0') >=
                          parseFloat(investment?.amount || '0')
                      }
                      title='+1 (hold)'
                    >
                      <Plus className='icon' />
                    </button>
                  </div>
                  {errors.amount && (
                    <div className={styles.errorMessage}>
                      {errors.amount.message}
                    </div>
                  )}
                </div>
                <button
                  className={styles.withdrawButton}
                  type='submit'
                  disabled={loading || !withdrawAmount}
                >
                  {loading ? 'Вывод...' : 'Вывести'}
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className={styles.noInvestments}>Нет активных вложений</div>
        )}
      </div>
    </div>
  );
};
