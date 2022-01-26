import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { useWeb3Context } from "../hooks/useWeb3Context";
import { useProjectContract } from "../hooks/useContract";
import SharesTable from "../components/misc/SharesTable";

export default function Deposit() {
  const { provider, contractAddress } = useWeb3Context();
  const [currentContractAddress, setCurrentContractAddress] = useState(
    contractAddress.address
  );
  const contract = useProjectContract(currentContractAddress);
  const [shareholders, setShareholders] = useState([]);

  useEffect(() => {
    if (!contract) return;

    const fetchShareholderInfo = async () => {
      const shareholders = [];
      try {
        const totalSupply = await contract.totalSupply();
        for (let i = 0; i < totalSupply.toNumber(); i++) {
          let tokenId = (await contract.tokenByIndex(i)).toString();
          let share = await contract.shares(tokenId);
          let owner = await contract.ownerOf(tokenId);
          shareholders.push({
            tokenId: tokenId,
            tokenOwner: owner.toString(),
            tokenShare: share.toString(),
          });
        }
      } catch (error) {
        console.log(error);
      }

      setShareholders(shareholders);
    };

    fetchShareholderInfo();
  }, [contract]);

  async function deposit() {
    const amountString = prompt("how much do you want to deposit?");
    const amount = ethers.utils.parseEther(amountString);
    console.log("amount in wei: ", amount);

    const response = await contract.deposit({ value: amount });
    console.log(response);
  }

  const handleAddressChange = (e) => {
    const input = e.target.value;
    setCurrentContractAddress(input && input.length ? input : null);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl mt-16"> Deposit</h1>
      <div className="mt-8 mb-4">
        <input
          type="text"
          placeholder="Contract address"
          className="input input-bordered w-full"
          value={contractAddress}
          onChange={handleAddressChange}
        />
      </div>
      <div className="border-2 p-6 mt-6">
        <h1 className="text-l font-bold"> Shareholders </h1>
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <SharesTable
                shares={shareholders}
                contractLoaded={contract !== null}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 mb-4">
        <button className="btn-primary btn" onClick={deposit}>
          Deposit
        </button>
      </div>
    </div>
  );
}
