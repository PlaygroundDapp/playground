import { useState } from "react";

import { useWeb3Context } from "../hooks/useWeb3Context";
import { usePlayground } from "../hooks/usePlayground";
import address from "../abis/contract-address.json";

export default function Claim() {
  const { account } = useWeb3Context();
  const [tokens, setTokens] = useState([]);
  
  // TODO: get contract address from user input
  const contract = usePlayground(address.PlaygroundContract);

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
    <div className="container mx-auto">  
        <h1 className="text-xl mt-16"> Claim your earnings</h1>

        <div className="mt-8">
          <button className="btn-primary btn" onClick={() => getTokensForUser()}> Get Tokens</button>
        </div>

        <div>
          <h2 className="mt-8">Tokens</h2>
          {tokens.map((token, idx) => (
            <div key={idx} className="mt-4">
              <span className="mr-4">{token.tokenId} - {token.share}%</span>
              <button className="btn-primary btn" onClick={() => claimEarnings(token.tokenId)}> Claim</button>
            </div> 
          ))}
        </div>

    </div>
  )
}