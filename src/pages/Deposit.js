import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { useWeb3Context } from "../hooks/useWeb3Context";
import { useProjectContract } from "../hooks/useContract";
import SharesTable from "../components/misc/SharesTable";

export default function Deposit() {
  const { provider, contractAddress, setContractAddress } = useWeb3Context();
  const contract = useProjectContract(contractAddress.address);
  const [shareholders, setShareholders] = useState([]);
  const [shareTotal, setShareTotal] = useState();
  const [projectName, setProjectName] = useState();
  const [projectSymbol, setProjectSymbol] = useState();

  useEffect(() => {
    if (!contract || !provider) {
      return;
    }
    provider.once("block", () => {
      contract.on("Deposit", () => {
        window.alert("Successfully Deposited");
      });
    });
  }, [contract, provider]);

  useEffect(() => {
    if (!contract) return;

    (async() => {

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

      const shareTotal = shareholders.map(s => s.tokenShare).reduce((a, b) => parseInt(a) + parseInt(b));

      setShareholders(shareholders);
      setShareTotal(shareTotal);
      setProjectSymbol(await contract.symbol());
      setProjectName(await contract.name())
    })();

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
    setContractAddress(input && input.length ? input : null);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl mt-16"> Deposit</h1>
      <div className="mt-8 mb-4 flex gap-6">
        {contract ?
        <>
        <div>
           <p className="text-xs opacity-50">Project Name</p>
           <p>{projectName}</p>

       </div>
       <div>
           <p className="text-xs opacity-50">Symbol</p>
           <p>{projectSymbol}</p>
       </div>
       
       </>
        :
        <input
          type="text"
          placeholder="Contract address"
          className="input input-bordered w-full"
          value={contractAddress}
          onChange={handleAddressChange}
        />
        }
        
      </div>
      <div className="border-2 p-6 mt-6">
        <h1 className="text-l font-bold"> Shareholders </h1>
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <SharesTable
                shares={shareholders}
                contractLoaded={contract !== null}
                shareTotal={shareTotal}
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
