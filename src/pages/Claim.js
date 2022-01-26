import { useState, useEffect } from "react";
import { useWeb3Context } from "../hooks/useWeb3Context";
import { usePlaygroundProject } from "../hooks/usePlaygroundProject";
import ShareTable from "../components/misc/SharesTable";

export default function Claim() {
  const { account, provider, contractAddress } = useWeb3Context();
  const [tokens, setTokens] = useState([]);
  const [shareTotal, setShareTotal] = useState(0);
  const [currentContractAddress, setCurrentContractAddress] = useState(contractAddress.address);
  
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
    let contract = usePlaygroundProject(props.address);

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

      setTokens(tokens);
      setShareTotal(total);
    }

    return (
      <div>
        <div className="mb-8">
          <button className="btn btn-primary w-full rounded-full" onClick={() => getTokensForUser()}> Get Tokens</button>
        </div>

        { tokens.length > 0 && (
          <ShareTable shares={tokens} account={account} contractLoaded={true} shareTotal={shareTotal} claim={claimEarnings}/>
        )}
      </div>
    )
  }



  return (
    <div className="container mx-auto">  
        <h1 className="text-xl mt-16"> Claim your earnings</h1>


        <div className="mt-8 mb-4">
          <input type="text" placeholder="Contract address" className="input input-bordered w-full" value={currentContractAddress} onChange={handleAddressChange}/>
        </div>

        <ClaimEarnings address={currentContractAddress} />
    </div>
  )
}