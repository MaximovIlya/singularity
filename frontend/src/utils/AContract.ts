import { ethers } from 'ethers';

export abstract class AContract {
  protected readonly contractAddress: string;
  protected readonly abi: any;

  constructor(contractAddress: string, abi: any) {
    this.contractAddress = contractAddress;
    this.abi = abi;
  }

  public getReadOnlyContract(
    provider: ethers.BrowserProvider
  ): ethers.Contract {
    return new ethers.Contract(this.contractAddress, this.abi, provider);
  }

  public getSigningContract(signer: ethers.Signer): ethers.Contract {
    console.log(this.contractAddress, this.abi);
    return new ethers.Contract(this.contractAddress, this.abi, signer);
  }
}
