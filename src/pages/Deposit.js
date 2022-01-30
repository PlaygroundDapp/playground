import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ChangeAddress from "../components/misc/ChangeAddress";
import { useWeb3Context } from "../hooks/useWeb3Context";
import { useProjectContract } from "../hooks/useContract";
import SharesTable from "../components/misc/SharesTable";
import ProjectDetails from "../components/misc/ProjectDetails";
import { useModal } from "../components/modal/Modal";

export default function Deposit() {
  const { provider, contractMetadata, setContractMetadata } = useWeb3Context();
  const contract = useProjectContract(contractMetadata.address);
  const [shareholders, setShareholders] = useState([]);
  const [shareTotal, setShareTotal] = useState();
  const [projectName, setProjectName] = useState();
  const [projectSymbol, setProjectSymbol] = useState();
  const modal = useModal();

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
    modal.showPendingTx(response);
  }

  const handleAddressChange = (e) => {
    setContractMetadata({
      address: e.target.value
    })
  };
  // 0x65f278D13e2EC98440d8eAde6FA8A08685089071

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl mt-16 mb-4"> Deposit</h1>
      <ChangeAddress />
      <div className="mt-8 mb-4 flex gap-6">
        {contract &&
          <ProjectDetails projectName={projectName} projectSymbol={projectSymbol} />
        }
        
      </div>
      <div className="border-2 p-6 mt-6">
        <h1 className="text-l font-bold"> Shareholders </h1>
        <SharesTable
          shares={shareholders}
          contractLoaded={contract !== null}
          shareTotal={shareTotal}
          showSplitBtn={false}
        />
      </div>
      <div className="mt-8 mb-4">
        <button className="btn-primary btn" onClick={deposit}>
          Deposit
        </button>
      </div>
    </div>
  );
}
