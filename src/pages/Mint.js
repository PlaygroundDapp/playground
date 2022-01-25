import React, {useEffect} from "react";
import NameInput from "../components/misc/NameInput"
import { useContract } from "../hooks/useContract";
import { useWeb3Context } from "../hooks/useWeb3Context";
import address from "../abis/contract-address.json";
import projectFactoryAbi from "../abis/ProjectFactory.json"
import playgroundAbi from "../abis/Playground.json"
import { useNavigate } from 'react-router-dom';



export default function Mint() {
    const navigate = useNavigate();
    const {account, isPageLoaded, provider, contractAddress, setContractAddress} = useWeb3Context();
    const [shareTotal, setShareTotal] = React.useState(0)
    const [contractLoaded, setContractLoaded] = React.useState(false)
    // const [contractAddress, setContractAddress] = React.useState(null)
    
    // TODO: get contract address from user input
    // const contract = usePlaygroundProject();
    const contract = useContract({ address: address.FactoryContract, ABI: projectFactoryAbi.abi, signingEnabled: true })
    const playgroundContract = useContract({ address: contractAddress.address, ABI: playgroundAbi.abi, signingEnabled: true })


    const createProject = async () => {
        const addresses = shareholders.map((s) => s.tokenOwner);
        const shares = shareholders.map((s) => s.tokenShare)
        console.log({ addresses, shares})
        try {
           const txn =  await contract.createProject(fields.projectName, fields.symbol, addresses, shares)
           const res = await txn.wait()
           console.log({ txn, res })
           const event = res.events.filter((e) => e.event === "ProjectCreated")
           const args = event[0].args
           console.log({ event, args })
           setContractAddress({
               address: args[0],
               projectName: args[1],
               symbol: args[2]
           })
           navigate(`?contractAddress=${args[0]}`)
    

        } catch (error) {
            console.log({ error })
            // alert("Sorry there was an error with your request! Please try again")
            
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
                // tokenId: shareholders.length,
                tokenOwner: fields.publicKey,
                tokenShare: fields.amount,
            },
        ]
            setShareholders(newShareholders);

        setFields({...fields, amount: "", publicKey:""})

        } catch (error) {
            console.log({ error })
            // alert("Sorry there was an error with your request! Please try again")
            
        }
    };

    useEffect(() => {
        const updateShareTotal = () => {
            let total = 0;
            if (shareholders.length > 1) {
                total = shareholders.reduce((a, b) =>  a + Number(b.tokenShare),0)
            }

            if (shareholders.length === 1) total = Number(shareholders[0].tokenShare)
            
            console.log({ total })
            setShareTotal(total)
        }
        updateShareTotal()
    }, [shareholders])

    const deleteShareholder = (index) => {
        const remaining = shareholders.filter((s, i ) =>  i !== index)
        setShareholders(remaining)

    }

    const handleGetTokensAndShares = async () => {
        try {
            const name = await playgroundContract.name();
            const symbol = await playgroundContract.symbol();

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
              console.log({ shareholders, name, symbol})
              setFields({
                  ...fields,
                  projectName: name,
                  symbol
              })
              setContractLoaded(true)
              return setShareholders(shareholders)
        } catch (error) {
            console.log({ error })
            
        }
    }
   const handleNewProject = () => {
    setContractLoaded(false)
    setShareholders([])
    setFields({
        ...fields,
        projectName:"",
        symbol:""
    })
   }

    const initialise = () => {
        if(contractAddress.address) handleGetTokensAndShares()
    }
    useEffect(() => {
            if (!contract || !provider) {
              return;
            }
            initialise();
            provider.once("block", () => {
              contract.on("mint", () => {
                  window.alert("Successfully Minted");
              });
            });
        }, [contract, provider, contractAddress.address]);
    if (!isPageLoaded) return  <div>Loading.... </div>
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl mt-16"> Welcome to Playground</h1>
            <p className="text-sm mt-2 opacity-50"> Start by giving your projet name, symbol, add all your shareholders, then mint your new project</p>
            <div className="mt-8 flex gap-6">
                {!contractLoaded ? 
                <>
                 <NameInput displayName="Project Name" name="projectName"   value={fields.projectName}     placeholder={`Eg. "Project Makeover"`}  onChange={handleInputChange}/>
                <NameInput displayName="Symbol" name="symbol"  value={fields.symbol}   placeholder={`Eg. "PM"`}  onChange={handleInputChange}/>
           
                </>
                :
                <>
                 <div>
                    <p className="text-xs opacity-50">Project Name</p>
                    <p>{fields.projectName}</p>

                </div>
                <div>
                    <p className="text-xs opacity-50">Symbol</p>
                    <p>{fields.symbol}</p>

                </div>
                
                </>
            }
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
                                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left text-right">
                                            Share Percent
                                        </th>
                                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                            
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
                                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-right">
                                        {s.tokenShare}

                                            </td>
                                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                            <button className={`btn btn-circle btn-sm ${contractLoaded && "hidden"}`} onClick={() => deleteShareholder(i)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button> 

                                            </td>
                                        </tr>
                                    ))}
                                         <tr className="bg-white border-b">
                                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap" />
                                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap" />
                                            
                                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-right">
                                                Total: {shareTotal}
                                            </td>
                                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">

                                            </td>
                                        </tr>
                                </tbody>
                            </table>
                                {shareholders.length === 0 && <div className="text-center mt-2 text-sm"> You currently haven't added any shareholders. Add some below.</div>}
                        </div>
                    </div>
                </div>
                {shareTotal > 100 && (
                    <div className="flex text-sm text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                        <p> Your total shares currently exceed 100. Your total shares must be 100 too proceed.</p>
                    </div>
                )}
                <div className={`mt-4 flex gap-6 flex-col sm:flex-row ${contractLoaded && "hidden"}`}>
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
                {contractLoaded ?
                <>
                <p className="text-sm opacity-50"> Want to create a new project?</p>
                    <button 
                        className="btn btn-primary w-full rounded-full mt-2" 
                        disabled={fields.projectName.length < 1 || fields.symbol.length < 1 ||shareholders.length < 1 || shareTotal > 100} 
                        onClick={handleNewProject}>
                            New Project
                    </button>
                </>

                :
                <>
                <p className="text-sm opacity-50"> All set? Select the button below to mint your project</p>
                    <button 
                        className="btn btn-primary w-full rounded-full mt-2" 
                        disabled={fields.projectName.length < 1 || fields.symbol.length < 1 ||shareholders.length < 1 || shareTotal > 100} 
                        onClick={createProject}>
                            Mint
                    </button>
                    </>
            
            }
                    
                </div>
        

    </div>
    )
}