import { ethers, BrowserProvider, Signer } from 'ethers';

// TODO: move ABI to a dedicated file
export const poolManagerABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_oracle',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_interestModel',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'borrow',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'borrows',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lastUpdated',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'deposits',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lastUpdated',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'getBorrowRate',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'getUtilization',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'interestModel',
    outputs: [
      {
        internalType: 'contract IInterestRateModel',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'oracle',
    outputs: [
      {
        internalType: 'contract IOracleAggregator',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'repay',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'totalBorrows',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'totalDeposits',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export class PoolManagerContract {
  public readonly readOnly: ethers.Contract;
  public readonly writable: ethers.Contract;

  constructor(provider: BrowserProvider, signer: Signer) {
    const contractAddress = import.meta.env
      .VITE_POOL_MANAGER_CONTRACT_ADDRESS as string;
    this.readOnly = new ethers.Contract(
      contractAddress,
      poolManagerABI,
      provider
    );
    this.writable = new ethers.Contract(
      contractAddress,
      poolManagerABI,
      signer
    );
  }

  // Write methods
  async borrow(token: string, amount: ethers.BigNumberish) {
    return this.writable.borrow(token, amount);
  }

  async deposit(token: string, amount: ethers.BigNumberish) {
    return this.writable.deposit(token, amount);
  }

  async repay(token: string, amount: ethers.BigNumberish) {
    return this.writable.repay(token, amount);
  }

  async withdraw(token: string, amount: ethers.BigNumberish) {
    return this.writable.withdraw(token, amount);
  }

  // Read methods
  async borrows(userAddress: string, tokenAddress: string) {
    return this.readOnly.borrows(userAddress, tokenAddress);
  }

  async deposits(userAddress: string, tokenAddress: string) {
    console.log(userAddress, tokenAddress);
    return this.readOnly.deposits(userAddress, tokenAddress);
  }

  async getBorrowRate(token: string): Promise<bigint> {
    return this.readOnly.getBorrowRate(token);
  }

  async getUtilization(token: string): Promise<bigint> {
    return this.readOnly.getUtilization(token);
  }

  async interestModel(): Promise<string> {
    return this.readOnly.interestModel();
  }

  async oracle(): Promise<string> {
    return this.readOnly.oracle();
  }

  async totalBorrows(tokenAddress: string): Promise<bigint> {
    return this.readOnly.totalBorrows(tokenAddress);
  }

  async totalDeposits(tokenAddress: string): Promise<bigint> {
    return this.readOnly.totalDeposits(tokenAddress);
  }
}
