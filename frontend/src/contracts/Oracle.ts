import { ethers, BrowserProvider, Signer } from 'ethers';

// TODO: move ABI to a dedicated file
export const oracleABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'getPrice',
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
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
    ],
    name: 'setPrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export class OracleContract {
  public readonly readOnly: ethers.Contract;
  public readonly writable: ethers.Contract;

  constructor(provider: BrowserProvider, signer: Signer) {
    const contractAddress = import.meta.env
      .VITE_ORACLE_CONTRACT_ADDRESS as string;
    this.readOnly = new ethers.Contract(contractAddress, oracleABI, provider);
    this.writable = new ethers.Contract(contractAddress, oracleABI, signer);
  }

  // Write methods
  async renounceOwnership() {
    return this.writable.renounceOwnership();
  }

  async setPrice(asset: string, price: ethers.BigNumberish) {
    return this.writable.setPrice(asset, price);
  }

  async transferOwnership(newOwner: string) {
    return this.writable.transferOwnership(newOwner);
  }

  // Read methods
  async getPrice(asset: string): Promise<bigint> {
    return this.readOnly.getPrice(asset);
  }

  async owner(): Promise<string> {
    return this.readOnly.owner();
  }
} 