import React, {useEffect} from "react";
import NameInput from "../components/misc/NameInput"
import { useContract } from "../hooks/useContract";
import { useWeb3Context } from "../hooks/useWeb3Context";
import { usePlaygroundProject, } from "../hooks/usePlaygroundProject";
import address from "../abis/contract-address.json";
import projectFactoryAbi from "../abis/ProjectFactory.json"
import playgroundAbi from "../abis/Playground.json"



export default function Mint() {
    const {account, isPageLoaded, connectWallet, provider} = useWeb3Context();
    let sharetotal = 0;
    
    // TODO: get contract address from user input
    // const contract = usePlaygroundProject();
    const contract = useContract({ address: address.FactoryContract, ABI: projectFactoryAbi.abi, signingEnabled: true })
    const playgroundContract = useContract({ address: address.PlaygroundContract, ABI: playgroundAbi.abi, signingEnabled: true })



    const createProject = async () => {
        const addresses = shareholders.map((s) => s.tokenOwner);
        const shares = shareholders.map((s) => s.tokenShare)
        console.log({ addresses, shares})
        try {
           const txn =  await contract.createProject(fields.projectName, fields.symbol, addresses, shares)
           const res = await txn.wait()
           console.log({ txn, res })
    

        } catch (error) {
            console.log({ error })
            alert("Sorry there was an error with your request! Please try again")
            
        }
    }


    const [fields, setFields] = React.useState({
        publicKey: "",
        amount: "",
        projectName:"",
        symbol: "",
    })
    const [shareholders, setShareholders] = React.useState([]);
    const handleInputChange = (e) => {
        console.log({ e, [e.target.name]:e.target.value })
        setFields({
            ...fields,
            [e.target.name]:e.target.value
        })
    }
    
    const handleAddShareholder = async () => {
        try {
            // await contract.mint(fields.publicKey, fields.amount )
            // const newTotal = sharetotal + fields.amount
            // if (newTotal >100) {
            //     return false
            // }
            const newShareholders = [
            ...shareholders, 
            {
                tokenId: shareholders.length,
                tokenOwner: fields.publicKey,
                tokenShare: fields.amount,
            },
        ]
            setShareholders(newShareholders);
            sharetotal += fields.amount

        setFields({...fields, amount: "", publicKey:""})

        } catch (error) {
            console.log({ error })
            alert("Sorry there was an error with your request! Please try again")
            
        }
    };

    const handleGetTokensAndShares = async () => {
        try {
            const tokenResponse = await playgroundContract._tokenIds();
            const tokens = Number(tokenResponse.toString());
            if (tokens === 0) return null;
            let shareholders = [];
            for (let i = 0; i < tokens ; i++) {
                let tokenOwner = await playgroundContract.ownerOf(i)
                let ts = await playgroundContract.shares(i)
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

    useEffect(() => {
            if (!contract || !provider) {
              return;
            }
            // initialise();
            provider.once("block", () => {
              contract.on("mint", () => {
                  window.alert("Successfully Minted");
              });
            });
        }, [contract, provider]);
    if (!isPageLoaded) return  <div>Loading.... </div>
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl mt-16"> Welcome to Playground</h1>
            <p className="text-sm mt-2 opacity-50"> Start by giving your projet name, symbol, add all your shareholders, then mint your new project</p>
            <div className="mt-8 flex gap-6">
                <NameInput displayName="Project Name" name="projectName"   value={fields.projectName}     placeholder={`Eg. "Project Makeover"`}  onChange={handleInputChange}/>
                <NameInput displayName="Symbol" name="symbol"  value={fields.symbol}   placeholder={`Eg. "PM"`}  onChange={handleInputChange} />

                {/* <NameInput displayName="Project Name" name="projectName"  onChange={handleInputChange} buttonName={"Add"} buttonClick={createProject}/> */}
            </div>
            <div className="border-2 p-6 mt-6">
                <h1 className="text-l font-bold"> Shareholders </h1>
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
                                {shareholders.length === 0 && <div className="text-center mt-2 text-sm"> You currently haven't added any shareholders. Add some below.</div>}
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex gap-6 flex-col sm:flex-row">
                    <NameInput placeholder="Shareholder Public Key" value={fields.publicKey} name="publicKey"  onChange={handleInputChange}/>
                    <NameInput 
                        placeholder="Share Amount"  
                        value={fields.amount}  
                        name="amount"  
                        onChange={handleInputChange} 
                        // buttonName="Add" 
                        buttonClick={handleAddShareholder}
                        type="number"
                        disabled={fields.publicKey.length < 2 || !fields.amount.length > 0}
                    />
                    <button className="btn btn-neutral" onClick={handleAddShareholder} disabled={fields.publicKey.length < 2 || !fields.amount.length > 0} >Add </button>
                </div>
                
            </div>
            <div className="mt-10 text-center">
                    <p className="text-sm opacity-50"> All set? Select the button below to mint your project</p>
                    <button className="btn btn-primary w-full rounded-full mt-2" disabled={fields.projectName.length < 1 || fields.symbol.length < 1 ||shareholders.length < 1} onClick={createProject}>Mint</button>
                </div>

        <hr className="mt-4"></hr>
        
        <div className="mt-8">
               
                <div className="mt-4">
                {/* <div className="flex flex-col"> */}
                   
                {/* </div> */}

                </div>
        </div>

    </div>
    )
}