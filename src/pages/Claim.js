import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWeb3Context } from "../hooks/useWeb3Context";
import { useProjectContract } from "../hooks/useContract";
import SharesTable from "../components/misc/SharesTable";
import ProjectDetails from "../components/misc/ProjectDetails";
import ChangeAddress from "../components/misc/ChangeAddress";

export default function Claim() {
  const { account, provider, contractMetadata, setContractMetadata } = useWeb3Context();
  const [tokens, setTokens] = useState([]);
  const [contractAddress, setContractAddress] = useState(contractMetadata.address);
  const [shareTotal, setShareTotal] = useState(0);
  const [projectName, setProjectName] = useState();
  const [projectSymbol, setProjectSymbol] = useState();
  const [projectRevenue, setProjectRevenue] = useState();
  const [totalClaimed, setTotalClaimed] = useState();
  const [totalToClaim, setTotalToClaim] = useState();

  useEffect(() => {
    setContractAddress(contractMetadata.address);
  }, [contractMetadata.address]);

  const handleAddressChange = (e) => {
    setContractAddress(e.target.value);
    setContractMetadata(e.target.value);
  }

  const ClaimEarnings = (props) => {
    const contract = useProjectContract(props.address);

    useEffect(() => {
      if (!contract || !provider) {
        return;
      }
      provider.once("block", () => {
        contract.on("Claim", () => {
          window.alert("Successfully Claimed");
        });
      });
    }, [contract, provider]);

    if (!contract) {
      return null;
    }

    const claimEarnings = async (tokenId) => {
      try {
        // const contract = getContract();
        const txn = await contract.claim(tokenId);
        console.log(txn);
        await txn.wait();
      } catch (error) {
        console.log(error);
      }
    }
  
    const getTokensForUser = async () => {
      const tokens = [];
      let total = 0;
      let totalClaimed = 0;
      let totalToClaim = 0;
      try {
        const projectRevenue = ethers.utils.formatEther(await contract.totalDepositedAmount())
        setProjectRevenue(projectRevenue);

        const numberOfTokens = await contract.balanceOf(account);
        for (let i = 0; i < numberOfTokens; i++) {
          let token = await contract.tokenOfOwnerByIndex(account, i);
          const tokenId = token.toString();
          let share = await contract.shares(tokenId);
          let amountClaimed = ethers.utils.formatEther(await contract.claimedAmount(tokenId));
          
          let amountDeserved = (projectRevenue * share) / 100;
          let amountToClaim = amountDeserved - amountClaimed;

                    
          total += parseFloat(share);
          totalClaimed += parseFloat(amountClaimed);
          totalToClaim += parseFloat(amountToClaim);

          tokens.push({
            tokenId: tokenId,
            tokenShare: share.toString(),
            amountClaimed: amountClaimed,
            amountToClaim: amountToClaim
          });
        }
      } catch (error) {
        console.log(error)
        console.log(tokens);
      }

      setProjectSymbol(await contract.symbol());
      setProjectName(await contract.name())
      setTokens(tokens);
      setShareTotal(total);
      setTotalClaimed(totalClaimed);
      setTotalToClaim(totalToClaim);
    }


    getTokensForUser();

    return (
      <div>
        { projectName && (
          <div className="flex gap-6"><ProjectDetails projectName={projectName} projectSymbol={projectSymbol} projectRevenue={projectRevenue} /></div>
        )}

        { tokens.length > 0 && (
          <div className="border-2 p-6 mt-6">
            <h1 className="text-l font-bold"> Tokens </h1>
            <SharesTable shares={tokens} account={account} contractLoaded={true} shareTotal={shareTotal} totalClaimed={totalClaimed} totalToClaim={totalToClaim} claim={claimEarnings} />
          </div>
        )}
      </div>
    )
  }



  return (
    <div className="container mx-auto">  
      <h1 className="text-4xl mt-16">Claim</h1>

      <div className="mt-8 mb-4">
      <ChangeAddress />
        {/* <input type="text" placeholder="Contract address" className="input input-bordered w-full" value={contractAddress} onChange={handleAddressChange}/> */}
      </div>

      <ClaimEarnings address={contractAddress} />
    </div>
  )
}