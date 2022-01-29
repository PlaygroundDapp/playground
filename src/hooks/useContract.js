import { useMemo } from "react";
import { Contract } from "ethers";
import { useWeb3Context } from "./useWeb3Context";
import addressJson from "../abis/contract-address.json";
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

export const useFactoryContract = () => {
  const { chainId } = useWeb3Context();
  let address;
  switch (chainId) {
    case 4: // rinkeby
      address = "0x744813c66ceBD23a831B3D3e5A1C7dbB81AfA6d2";
      break;
    default:
      address = addressJson.FactoryContract;
      break;
  }

  return useContract({
    address: address,
    ABI: ProjectFactoryAbi.abi,
    signingEnabled: true,
  });
};

export const useProjectContract = (address) =>
  useContract({
    address,
    ABI: PlaygroundABI.abi,
    signingEnabled: true,
  });
