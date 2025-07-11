import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Currency, CurrencyId, getCurrencyById } from '../../types/currency';
import styles from './CurrencySelect.module.css';

export interface CurrencySelectProps {
  currencies: Currency[];
  selectedCurrency: CurrencyId;
  onCurrencyChange: (currencyId: CurrencyId) => void;
  disabled?: boolean;
  className?: string;
}

export const CurrencySelect: React.FC<CurrencySelectProps> = ({
  currencies,
  selectedCurrency,
  onCurrencyChange,
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Закрытие dropdown при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Закрытие dropdown при нажатии Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const selectedCurrencyData = getCurrencyById(selectedCurrency);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleCurrencySelect = (currencyId: CurrencyId) => {
    onCurrencyChange(currencyId);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  return (
    <div 
      ref={selectRef}
      className={`${styles.currencySelect} ${className}`}
    >
      <button
        type="button"
        className={`${styles.selectButton} ${isOpen ? styles.open : ''}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className={styles.selectedOption}>
          {selectedCurrencyData && (
            <>
              <img
                src={selectedCurrencyData.icon}
                alt={selectedCurrencyData.name}
                className={styles.currencyIcon}
              />
              <span className={styles.currencyName}>
                {selectedCurrencyData.name}
              </span>
            </>
          )}
        </div>
        <ChevronDown className={`${styles.chevronIcon} ${isOpen ? styles.open : ''}`} />
      </button>

      <div 
        className={`${styles.dropdown} ${isOpen ? '' : styles.hidden}`}
        role="listbox"
        aria-label="Currency options"
      >
        {currencies.map((currency) => (
          <div
            key={currency.id}
            className={`${styles.option} ${
              currency.id === selectedCurrency ? styles.selected : ''
            }`}
            onClick={() => handleCurrencySelect(currency.id as CurrencyId)}
            role="option"
            aria-selected={currency.id === selectedCurrency}
          >
            <img
              src={currency.icon}
              alt={currency.name}
              className={styles.currencyIcon}
            />
            <span className={styles.currencyName}>
              {currency.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}; 