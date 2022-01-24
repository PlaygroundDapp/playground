import React from "react";
import NameInput from "../components/misc/NameInput"
import { useWeb3Context } from "../hooks/useWeb3Context";

import { useContract } from "../hooks/useContract";
import address from "../abis/contract-address.json";
import abi from "../abis/Playground.json";


export default function Mint() {
    const {account, isPageLoaded, connectWallet} = useWeb3Context();
    // TODO: get contract address from user input
    const contract = useContract({
      address: address.PlaygroundContract,
      ABI: abi.abi,
      signingEnabled: true,
    });

    const [fields, setFields] = React.useState({
        publicKey: "",
        amount: "",
    })
    const handleInputChange = (e) => {
        console.log({ e, [e.target.name]:e.target.value })
        setFields({
            ...fields,
            [e.target.name]:e.target.value
        })
    }
    // const [pageLoaded, setPageLoaded] = React.useState(false);

    // const [metaAccount, setMetaAccount] = React.useState(null);
    // const handleConnectWallet = (account) => {
    //     console.log({ account })
    //     if (account) setMetaAccount(account)

    // }

    const handleAddShareholder = async (shareholderAddress, amount) => {
        // const results = a
        console.log({ fields})
        // console.log(contract.PlaygroundContract);
        // await mint(contract.PlaygroundContract,account, fields.amount  );
        // copied `export const mint = async (address, shareholderAddress, shareAmount) => {` from utils.common.js
        try {
            // if (!address) {
            //     return;
            // }
            // const { ethereum } = window;
    
            // if (!ethereum) return
        
            // const provider = new ethers.providers.Web3Provider(ethereum);
            // const signer = provider.getSigner();
            // const contract = new ethers.Contract(address, abi.abi, signer);
    
            const txn = await contract.mint(shareholderAddress, amount);
            console.log({ txn });
            await txn.wait();
        } catch (error) {
            console.log(error);
        }
    };

    // React.useEffect(() => {
    //     const initialise = async () => {
    //        await checkIfWalletIsConnected(handleConnectWallet)
    //        setPageLoaded(true)
    //     }
    //     initialise();
         
    // },[])
    const shareholderTest = [
        {
            address: "0xsos0s",
            share: 10,
        },
        {
            address: "0x2sos0s",
            share: 30,
        },
    ]
    if (!isPageLoaded) return  <div>Loading.... </div>
    return (
        <div className="container mx-auto">
            <div className="mt-16">
                    {account ? <>
                    <div>Meta Mast Connected: {account}</div>
                    </>: <button className="btn-primary btn" onClick={connectWallet}> Connect your wallet</button> }
                
                

            </div>
            <h1 className="text-xl mt-16"> Mint a new project </h1>
            <div className="mt-8">
                <NameInput displayName="Project Name" name="projectName"  onChange={handleInputChange}/>
        </div>
        <hr className="mt-4"></hr>
        <h1 className="text-xl mt-16"> Mint your shareholders </h1>
        <div className="mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4">
       <div className="col-span-1">
            <label className="label">
                <span className="label-text">Shareholder Public Key</span> 
            </label> 
            <input type="text" name="publicKey" onChange={handleInputChange} placeholder="Public Key" className="input input-bordered" /> 
       </div>
       <div>
            <label className="label">
                <span className="label-text">Shareholder Amount </span> 
            </label> 
            <input type="text" name="amount" onChange={handleInputChange} placeholder="Amount" className="input input-bordered" /> 
       </div>
      

</div>
<div className="mt-4"> <button className="btn btn-neutral" onClick={handleAddShareholder}> Add Shareholders </button></div>
               
                <div className="mt-4">
                <div className="flex flex-col">
 <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
        <div className="overflow-hidden">
            <table className="min-w-full">
            <thead className="bg-white border-b">
                <tr>
                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    Shareholder Address
                </th>
                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    Share Percent
                </th>
                </tr>
            </thead>
            <tbody>
                {shareholderTest.map((s,i ) => (
                    <tr key={i} className="bg-white border-b">
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {s.address}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {s.share}

                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
</div>
</div>

                </div>
        </div>
</div>
    )
}