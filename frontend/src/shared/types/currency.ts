export interface Currency {
  id: string;
  name: string;
  symbol: string;
  description?: string;
  icon: string;
}

export type CurrencyId = 'ETH' | 'USDT';

import EthIcon from '../../assets/crypto/ethereum-eth-logo.svg';
import UsdtIcon from '../../assets/crypto/tether-usdt-logo.svg';

export const CURRENCIES: Currency[] = [
  {
    id: 'ETH',
    name: 'ETH',
    symbol: 'ETH',
    description: 'Ethereum',
    icon: EthIcon
  },
  {
    id: 'USDT',
    name: 'USDT',
    symbol: 'USDT',
    description: 'Tether',
    icon: UsdtIcon
  }
];

export const getCurrencyById = (id: CurrencyId): Currency | undefined => {
  return CURRENCIES.find(currency => currency.id === id);
}; 