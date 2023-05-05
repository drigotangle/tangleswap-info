import { IPoolData, IToken } from "../interfaces";

export const isValidEthereumAddress = (address: string | undefined) => {
    const pattern = /^0x[a-fA-F0-9]{40}$/;
    //@ts-ignore
    return pattern.test(address);
};

export const containsTokenAddressInTokens = (arr: IToken[] | any, address: string): boolean => {
    return arr.some((token: IToken) => token.tokenAddress === address);
  };

  export const containsTokenAddressInPools = (arr: IPoolData[], address: string): boolean => {
    return arr.some((pool) => pool.pool === address);
  };