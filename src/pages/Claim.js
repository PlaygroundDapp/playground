import { useState, useEffect } from "react";

import { useWeb3Context } from "../hooks/useWeb3Context";
import { usePlaygroundProject } from "../hooks/usePlaygroundProject";
import address from "../abis/contract-address.json";
import { current } from "daisyui/colors";

export default function Claim() {
  const getContract = usePlaygroundProject();
  const { account, provider, contractAddress } = useWeb3Context();
  const [tokens, setTokens] = useState([]);
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
      // copied `export const claim = async (tokenId) => {` from utils.common.js
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
      // copied `export const getTokens = async (account) => {` from utils.common.js
      const tokens = [];
      try {
          // const contract = getContract();
          for (let i = 0; true; i++) {
              let token = await contract.tokenOfOwnerByIndex(account, i);
              let share = await contract.shares(token.toString());
              tokens.push({
                  tokenId: token.toString(),
                  share: share.toString()
              });
          }
      } catch (error) {
          console.log(tokens);
      }
      
      setTokens(tokens);
      console.log(tokens);
    }

    return (
      <div>
        <div>
          <button className="btn-primary btn" onClick={() => getTokensForUser()}> Get Tokens</button>
        </div>

        { tokens.length > 0 && (
          <div>
            <h2 className="mt-8">Tokens</h2>

            <table>
              <tr>
                <th scope="col" className="px-6">Token Id</th>
                <th scope="col" className="px-6">Share</th>
                <th scope="col" className="px-6">Claim</th>
              </tr>
              {tokens.map((token, idx) => (
                <tr key={idx} className="mt-4">
                  <td className="px-6 py-4">{token.tokenId}</td>
                  <td className="px-6 py-4">{token.share}%</td>
                  <td className="px-6 py-4"><button className="btn-primary btn" onClick={() => claimEarnings(token.tokenId)}> Claim</button></td>
                </tr> 
              ))}
            </table>
          </div>
        )}
        <div>

        </div>

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