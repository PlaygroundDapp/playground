import { useContract } from "../../hooks/useContract";
import address from "../../abis/contract-address.json";
import abi from "../../abis/Playground.json";
import { useState } from "react/cjs/react.development";
import { useWeb3Context } from "../../hooks/useWeb3Context";
import { useEffect } from "react";
import { ethers } from "ethers";

export default function Depositing() {
  const { account, provider, isActive, connectWallet } = useWeb3Context();

  const [myETHBalance, setMyETHBalance] = useState(0);
  const [totalDepositedAmount, setTotalDepositedAmount] = useState("--");

  const contract = useContract({
    address: address.SampleContract,
    ABI: abi.abi,
    signingEnabled: true,
  });

  useEffect(() => {
    async function fetchETHBalance() {
      const balanceBN = await provider.getBalance(account);
      const balance = ethers.utils.formatEther(balanceBN);
      setMyETHBalance(balance);
    }
    fetchETHBalance();
  }, [account, provider]);

  async function deposit() {
    const amountString = prompt("how much do you want to deposit?");
    const amount = ethers.utils.parseEther(amountString);
    console.log("amount in wei: ", amount);

    const response = await contract.deposit(amount, { value: amount });
    console.log(response);
  }

  async function reloadTotalDepositAmount() {
    const totalBN = await contract.totalDepositedAmount();
    const total = ethers.utils.formatEther(totalBN);
    setTotalDepositedAmount(total);
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-xl mt-16">Deposit </h1>
      {!isActive ? (
        <button className="btn-primary btn" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <div className="flex flex-col">
          <label>My address: {account}</label>
          <label>My ETH balance: {myETHBalance}</label>
          <label>contract.totalDepositedAmount: {totalDepositedAmount}</label>
          <button className="btn-primary btn" onClick={deposit}>
            Deposit
          </button>
          (might take some time for the deposit tx to get mined)
          <button
            className="btn-primary btn"
            onClick={reloadTotalDepositAmount}
          >
            Check total deposit
          </button>
        </div>
      )}
    </div>
  );
}
