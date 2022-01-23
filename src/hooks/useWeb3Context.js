import { useContext } from "react";
import { Web3Context } from "../context/Web3Context";

export const useWeb3Context = () => useContext(Web3Context);
