import { useMemo } from 'react';
import { Contract } from 'ethers';
import { useWeb3Context } from './useWeb3Context';

export function useContract({address, ABI, signingEnabled = false}) {
  const { provider, isActive } = useWeb3Context();
  
  return useMemo(() => {
    if (!isActive || !provider || !address) return null;

    return new Contract(
      address, 
      ABI, 
      signingEnabled ? provider.getSigner() : provider
    );
  }, [address, ABI, signingEnabled, provider, isActive]);
}
