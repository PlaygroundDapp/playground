import { useContract } from "./useContract";
import abi from "../abis/Playground.json";

export function usePlaygroundProject(address) {
  return useContract({
    address: address,
    ABI: abi.abi,
    signingEnabled: true,
  });
}
