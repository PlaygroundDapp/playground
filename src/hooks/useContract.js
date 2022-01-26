import { useMemo } from "react";
import { Contract } from "ethers";
import { useWeb3Context } from "./useWeb3Context";
import address from "../abis/contract-address.json";
import ProjectFactoryAbi from "../abis/ProjectFactory.json";
import PlaygroundABI from "../abis/Playground.json";

function useContract({ address, ABI, signingEnabled = false }) {
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

export const useFactoryContract = () =>
  useContract({
    address: address.FactoryContract,
    ABI: ProjectFactoryAbi.abi,
    signingEnabled: true,
  });

export const useProjectContract = (address) =>
  useContract({
    address: address,
    ABI: PlaygroundABI.abi,
    signingEnabled: true,
  });
