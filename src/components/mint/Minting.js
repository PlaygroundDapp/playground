import React from "react";
import NameInput from "../misc/NameInput"
import { mint } from "../../utils/common";
import { useWeb3Context } from "../../hooks/useWeb3Context";
import contract from "../../abis/contract-address.json";
import { useContract } from "../../hooks/useContract";
import address from "../../abis/contract-address.json";
import abi from "../../abis/Playground.json";
import { ethers, providers } from "ethers";



export default function Minting() {
    const {account, isPageLoaded, connectWallet} = useWeb3Context();
    const contract = useContract({
        address: address.PlaygroundContract,
        ABI: abi.abi,
        signingEnabled: true,
      });

    const [fields, setFields] = React.useState({
        publicKey: "",
        amount: "",
    })

    const [shareholders, setShareholders] = React.useState([]);
    const handleInputChange = (e) => {
        console.log({ e, [e.target.name]:e.target.value })
        setFields({
            ...fields,
            [e.target.name]:e.target.value
        })
    }

    const handleAddShareholder = async (shareholderAddress, amount) => {
        try {
            await contract.mint(fields.publicKey, fields.amount )
            setShareholders([
            ...shareholders, 
            {
                tokenId: shareholders.length,
                tokenOwner: fields.publicKey,
                tokenShare: fields.amount,
            },
        ]);
        setFields({...fields, amount: "", publicKey:""})

        } catch (error) {
            console.log({ error })
            alert("Sorry there was an error with your request! Please try again")
            
        }
    };

    const handleGetTokensAndShares = async () => {
        try {
            const tokenResponse = await contract._tokenIds();
            const tokens = Number(tokenResponse.toString());
            if (tokens === 0) return null;
            let shareholders = [];
            for (let i = 0; i < tokens ; i++) {
                let tokenOwner = await contract.ownerOf(i)
                let ts = await contract.shares(i)
                let tokenShare = ts.toNumber()
                shareholders.push({ tokenId: i, tokenOwner, tokenShare})
                console.log({ tok: i + 1, tokenShare, tokenOwner })
              }
              console.log({ shareholders})
              return setShareholders(shareholders)
        } catch (error) {
            console.log({ error })
            
        }
    }
    const initialise = async () => {
        await handleGetTokensAndShares();
        }
        
    React.useEffect(() => {
       if (isPageLoaded && contract) initialise();
         
    },[isPageLoaded, contract])

    if (!isPageLoaded) return  <div>Loading.... </div>
    return (
        <div className="container mx-auto">
            <h1 className="text-xl mt-16"> Mint a new project </h1>
            <div className="mt-8">
                <NameInput displayName="Project Name" name="projectName"  onChange={handleInputChange}/>
        </div>
        <hr className="mt-4"></hr>
        <h1 className="text-xl mt-16"> Mint your shareholders </h1>
        <div className="mt-8 flex gap-6">
        <NameInput placeholder="Public Key" value={fields.publicKey} name="publicKey"  onChange={handleInputChange}/>
        <NameInput 
            placeholder="Amount"  
            value={fields.amount}  
            name="amount"  
            onChange={handleInputChange} 
            buttonName="Add" 
            buttonClick={handleAddShareholder}
            type="number"
            disabled={fields.publicKey.length < 2 || !fields.amount.length > 0}
        />
            </div>
        <div className="mt-8">
               
                <div className="mt-4">
                <div className="flex flex-col">
 <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
        <div className="overflow-hidden">
            <table className="min-w-full">
            <thead className="bg-white border-b">
                <tr>
                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    Token Id
                </th>
                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    Shareholder Address
                </th>
                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    Share Percent
                </th>
                </tr>
            </thead>
            <tbody>
                {shareholders && shareholders.map((s,i ) => (
                    <tr key={i} className="bg-white border-b">
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {s.tokenId}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {s.tokenOwner}
                            {(account === s.tokenOwner) && "(Your address)"}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {s.tokenShare}

                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
            {shareholders.length === 0 && <div className="text-center"> You currently haven't added any shareholders</div>}
        </div>
        </div>
</div>
</div>

                </div>
        </div>
</div>
    )
}