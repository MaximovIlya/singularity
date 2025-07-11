import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useWeb3 } from '../../shared/providers/Web3Context';
import styles from './MyLoansTab.module.css';
import { ethers } from 'ethers';
import { Loader2, Plus, Minus } from 'lucide-react';

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
  const [repayAmount, setRepayAmount] = useState('');
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>();

  // Refs для управления повторяющимися действиями
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

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
      setShowRepayForm(false);
      setRepayAmount('');
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
    setRepayAmount(prev => {
      const currentValue = parseFloat(prev) || 0;
      const maxAmount = parseFloat(borrow?.amount || '0');
      const newValue = Math.min(maxAmount, currentValue + 1).toString();
      setValue('amount', newValue, { shouldValidate: true });
      return newValue;
    });
  }, [setValue, borrow?.amount]);

  const decrementAmount = useCallback(() => {
    setRepayAmount(prev => {
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
    const maxAmount = parseFloat(borrow?.amount || '0');
    
    // Предотвращаем ввод отрицательных значений и значений больше доступной суммы
    if (value === '' || (parseFloat(value) >= 0 && !value.includes('-'))) {
      setRepayAmount(value);
      setValue('amount', value, { shouldValidate: true });
    }
  };

  const setMaxAmount = useCallback(() => {
    const maxAmount = borrow?.amount || '0';
    setRepayAmount(maxAmount);
    setValue('amount', maxAmount, { shouldValidate: true });
  }, [setValue, borrow?.amount]);

  // Очистка таймеров при размонтировании компонента
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

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
          <div className={styles.loadingState}>
            Загрузка...
          </div>
        ) : borrow ? (
          <div
            className={styles.loanItem}
            onClick={() => setShowRepayForm(!showRepayForm)}
          >
            <p>Сумма: {borrow.amount} ETH</p>
            <p>Последнее обновление: {borrow.lastUpdated}</p>
            {showRepayForm && (
              <form
                className={styles.repayForm}
                onSubmit={handleSubmit(repay)}
                onClick={e => e.stopPropagation()}
              >
                <div className={styles.amountInput}>
                  <label>Сумма для возмещения</label>
                  <div className={styles.inputWrapper}>
                    <button
                      type="button"
                      className={styles.decrementButton}
                      onMouseDown={handleDecrementStart}
                      onMouseUp={stopRepeating}
                      onMouseLeave={stopRepeating}
                      onTouchStart={handleDecrementStart}
                      onTouchEnd={stopRepeating}
                      disabled={isRepaying || !repayAmount || parseFloat(repayAmount) <= 0}
                      title="-1 (hold)"
                    >
                      <Minus className="icon" />
                    </button>
                    <input
                      type="number"
                      {...register('amount', {
                        required: 'Введите сумму для возмещения',
                        min: {
                          value: 0.01,
                          message: 'Минимальная сумма для возмещения: 0.01 ETH'
                        },
                        max: {
                          value: parseFloat(borrow?.amount || '0'),
                          message: `Максимальная сумма для возмещения: ${borrow?.amount} ETH`
                        },
                        validate: (value) => {
                          const numValue = parseFloat(value);
                          const maxAmount = parseFloat(borrow?.amount || '0');
                          if (numValue > maxAmount) {
                            return `Сумма не может превышать ${borrow?.amount} ETH`;
                          }
                          return true;
                        }
                      })}
                      value={repayAmount}
                      onChange={handleAmountChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={`${styles.amountField} ${errors.amount ? styles.inputError : ''}`}
                    />
                    <button
                      type="button"
                      className={styles.maxButton}
                      onClick={setMaxAmount}
                      disabled={isRepaying || parseFloat(repayAmount || '0') >= parseFloat(borrow?.amount || '0')}
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
                      disabled={isRepaying || parseFloat(repayAmount || '0') >= parseFloat(borrow?.amount || '0')}
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
                  className={styles.repayButton}
                  type="submit"
                  disabled={isRepaying || !!errors.amount || !repayAmount}
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
          <div className={styles.noLoans}>
            У вас пока нет активных займов.
            <br />
            Перейдите на вкладку "Займы" для создания нового займа.
          </div>
        )}
      </div>
    </div>
  );
};
