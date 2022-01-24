import { useState } from "react";
import { claim, getTokens } from "../utils/common"
import { useWeb3Context } from "../hooks/useWeb3Context";


export default function Claim() {
  const { account } = useWeb3Context();
  const [tokens, setTokens] = useState([]);

  const claimEarnings = (tokenId) => {
    claim(tokenId);
  }

  const getTokensForUser = async () => {
    setTokens(await getTokens(account));
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