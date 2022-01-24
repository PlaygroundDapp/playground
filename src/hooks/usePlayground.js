import { useContract } from "./useContract";
import abi from "../abis/Playground.json";

export function usePlayground(address) {
  return useContract({
    address: address,
    ABI: abi.abi,
    signingEnabled: true,
  });
}
