import React from "react";
import NameInput from "../misc/NameInput"
import { mint } from "../../utils/common";
import { useWeb3Context } from "../../hooks/useWeb3Context";


export default function Minting() {
    const {account, isPageLoaded, connectWallet} = useWeb3Context();

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
        await mint("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",account, fields.amount  );
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