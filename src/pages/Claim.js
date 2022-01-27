import { useState, useEffect } from "react";
import { useWeb3Context } from "../hooks/useWeb3Context";
import { useProjectContract } from "../hooks/useContract";
import SharesTable from "../components/misc/SharesTable";
import ProjectDetails from "../components/misc/ProjectDetails";

export default function Claim() {
  const { account, provider, contractMetadata } = useWeb3Context();
  const [tokens, setTokens] = useState([]);
  const [shareTotal, setShareTotal] = useState(0);
  const [currentContractAddress, setCurrentContractAddress] = useState(contractMetadata.address);
  const [projectName, setProjectName] = useState();
  const [projectSymbol, setProjectSymbol] = useState();

  // TODO: get contract address from user input
  let contract;

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

  const handleAddressChange = (e) => {
    setCurrentContractAddress(e.target.value);
  }

  const ClaimEarnings = (props) => {
    let contract = useProjectContract(props.address);

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
      try {
        // const contract = getContract();
        const numberOfTokens = await contract.balanceOf(account);
        for (let i = 0; i < numberOfTokens; i++) {
          let token = await contract.tokenOfOwnerByIndex(account, i);
          let share = await contract.shares(token.toString());
          total += parseInt(share);
          tokens.push({
              tokenId: token.toString(),
              tokenShare: share.toString()

          });
        }
      } catch (error) {
          console.log(tokens);
      }

      setProjectSymbol(await contract.symbol());
      setProjectName(await contract.name())
      setTokens(tokens);
      setShareTotal(total);
    }

    return (
      <div>
        <div className="mb-8">
          <button className="btn btn-primary w-full rounded-full" onClick={() => getTokensForUser()}> Get Tokens</button>
        </div>

        { projectName && (
          <div className="flex gap-6"><ProjectDetails projectName={projectName} projectSymbol={projectSymbol} /></div>
        )}

        { tokens.length > 0 && (
          <div className="border-2 p-6 mt-6">
            <h1 className="text-l font-bold"> Tokens </h1>
            <SharesTable shares={tokens} account={account} contractLoaded={true} shareTotal={shareTotal} claim={claimEarnings}/>
          </div>
        )}
      </div>
    )
  }



  return (
    <div className="container mx-auto">  
      <h1 className="text-4xl mt-16">Claim</h1>

      <div className="mt-8 mb-4">
        <input type="text" placeholder="Contract address" className="input input-bordered w-full" value={currentContractAddress} onChange={handleAddressChange}/>
      </div>

      <ClaimEarnings address={currentContractAddress} />
    </div>
  )
}