export interface Currency {
  id: string;
  name: string;
  symbol: string;
  description?: string;
  icon: string;
}

export type CurrencyId = 'USDT' | 'ETH' | 'sepoliaETH';

import UsdtIcon from '../../assets/crypto/tether-usdt-logo.svg';
import EthIcon from '../../assets/crypto/ethereum-eth-logo.svg';
import SepoliaEthIcon from '../../assets/crypto/ethereum-pow-ethw-logo.svg';

export const CURRENCIES: Currency[] = [
  {
    id: 'USDT',
    name: 'USDT',
    symbol: 'USDT',
    description: 'Stablecoin',
    icon: UsdtIcon
  },
  {
    id: 'ETH',
    name: 'ETH',
    symbol: 'ETH',
    description: 'Ethereum',
    icon: EthIcon
  },
  {
    id: 'sepoliaETH',
    name: 'sepoliaETH',
    symbol: 'sepoliaETH',
    description: 'Ethereum PoW',
    icon: SepoliaEthIcon
  }
];

export const getCurrencyById = (id: CurrencyId): Currency | undefined => {
  return CURRENCIES.find(currency => currency.id === id);
}; 