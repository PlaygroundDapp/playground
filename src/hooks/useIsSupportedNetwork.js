import { useWeb3Context } from "./useWeb3Context";

const supportedNetwork = [4, 31337]; // rinkeby and localhost

export function useIsSupportedNetwork() {
  const { chainId } = useWeb3Context();
  if (!chainId) return false;
  
  return supportedNetwork.includes(chainId);
}
