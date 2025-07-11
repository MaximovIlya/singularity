import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useWeb3 } from '../../shared/providers/Web3Context';
import styles from './MyInvestmentsTab.module.css';
import { PoolManagerContract } from '../../contracts/PoolManager';
import { Plus, Minus } from 'lucide-react';

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
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>();

  // Refs для управления повторяющимися действиями
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const withdraw = (data: FormValues) => {
    if (!poolManager) return;
    const amount = BigInt(data.amount) * BigInt('1000000000000000000');
    poolManager.withdraw(
      import.meta.env.VITE_ASSEST_ADDRESS,
      amount.toString()
    );
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

  const startRepeating = useCallback((action: () => void) => {
    clearTimers(); // Очищаем предыдущие таймеры
    action(); // Первое выполнение сразу
    
    timeoutRef.current = window.setTimeout(() => {
      intervalRef.current = window.setInterval(action, 100);
    }, 500);
  }, [clearTimers]);

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
    const maxAmount = parseFloat(investment?.amount || '0');
    
    // Предотвращаем ввод отрицательных значений и значений больше доступной суммы
    if (value === '' || (parseFloat(value) >= 0 && !value.includes('-'))) {
      setWithdrawAmount(value);
      setValue('amount', value, { shouldValidate: true });
    }
  };

  // Очистка таймеров при размонтировании компонента
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

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
          <div className={styles.loadingState}>
            Загрузка...
          </div>
        ) : investment ? (
          <div
            className={styles.investmentItem}
            onClick={() => setShowWithdrawForm(!showWithdrawForm)}
          >
            <p>Сумма: {investment.amount} ETH</p>
            <p>Последнее обновление: {investment.lastUpdated}</p>
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
                      type="button"
                      className={styles.decrementButton}
                      onMouseDown={handleDecrementStart}
                      onMouseUp={stopRepeating}
                      onMouseLeave={stopRepeating}
                      onTouchStart={handleDecrementStart}
                      onTouchEnd={stopRepeating}
                      disabled={loading || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
                      title="-1 (hold)"
                    >
                      <Minus className="icon" />
                    </button>
                    <input
                      type="number"
                      {...register('amount', {
                        required: 'Введите сумму для вывода',
                        min: {
                          value: 0.01,
                          message: 'Минимальная сумма для вывода: 0.01 ETH'
                        },
                        max: {
                          value: parseFloat(investment?.amount || '0'),
                          message: `Максимальная сумма для вывода: ${investment?.amount} ETH`
                        },
                        validate: (value) => {
                          const numValue = parseFloat(value);
                          const maxAmount = parseFloat(investment?.amount || '0');
                          if (numValue > maxAmount) {
                            return `Сумма не может превышать ${investment?.amount} ETH`;
                          }
                          return true;
                        }
                      })}
                      value={withdrawAmount}
                      onChange={handleAmountChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={`${styles.amountField} ${errors.amount ? styles.inputError : ''}`}
                    />
                    <button
                      type="button"
                      className={styles.incrementButton}
                      onMouseDown={handleIncrementStart}
                      onMouseUp={stopRepeating}
                      onMouseLeave={stopRepeating}
                      onTouchStart={handleIncrementStart}
                      onTouchEnd={stopRepeating}
                      disabled={loading || parseFloat(withdrawAmount || '0') >= parseFloat(investment?.amount || '0')}
                      title="+1 (hold)"
                    >
                      <Plus className="icon" />
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
                  type="submit"
                  disabled={loading || !!errors.amount || !withdrawAmount}
                >
                  Вывести средства
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className={styles.noInvestments}>
            У вас пока нет активных инвестиций.
            <br />
            Перейдите на вкладку "Инвестиции" для создания нового вложения.
          </div>
        )}
      </div>
    </div>
  );
};
