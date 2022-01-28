import React from "react";
import { useInputChange } from "../../hooks/useInputChange";
import NameInput from "../misc/NameInput"


export default function ShareTable({ shares, account, contractLoaded, shareTotal, deleteShareholder=false, totalClaimed=0, totalToClaim=0, claim=false, contract = null, refresh }) {
  const [openModal, setOpenModal] = React.useState(false)
  const [selectedShareHolder, setSelctedShareHolder] = React.useState(null)
  const [input, handleInputChange, setInput] = useInputChange();
  const [isLoading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false)
  const handleSplitShares = (selected) => {
    setSelctedShareHolder(selected)
      setOpenModal(true)
  }

  const confirmSplit = async () => {
    setLoading(true)
    setError(false)
    console.log({ selectedShareHolder })
    try {
       const txn = await contract.splitToken(input.publicKey, selectedShareHolder.tokenId, input.amount);
       const res = await txn.wait();
       console.log({ txn, res })
       await refresh();
       setInput({
         ...input,
         publicKey: "",
         amount:"",
       })
       setOpenModal(false)
       setLoading(false)
    } catch (error) {
      console.log({ error })
      setLoading(false)
      setError(true)
      
    }

  }
  return (
    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="modal-open">
        <div className={`modal ${openModal && "modal-open"}`}>
          <div className="modal-box">
            <p className="text-lg font-bold">Split your shares </p> 
            <p className="text-sm">Enter the address of the shareholder you want to split with. (You cannot split more than {selectedShareHolder && selectedShareHolder.tokenShare}) </p> 
            <p className="text-sm"> DO NOT USE DECIMAL POINTS </p> 
            <div className="mt-6 grid gap-6">
                <NameInput placeholder={"Public Address"} value={input.publicKey} onChange={handleInputChange} name="publicKey" />
                <NameInput placeholder="Share" value={input.amount} onChange={handleInputChange} name="amount"  type="number"/>

              </div>
            <div className={`text-xs mt-4 flex ${!error && "hidden"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
              There was an error please try again later
            </div>
            <div className="modal-action">
              <label htmlFor="my-modal-2" className={`btn btn-primary ${isLoading && "loading"}`} onClick={confirmSplit} disabled={selectedShareHolder &&((Number(input.amount) >= selectedShareHolder.tokenShare) || input.publicKey.length < 3)}>Confirm</label> 
              <label htmlFor="my-modal-2" className="btn" onClick={()=> setOpenModal(false)}>Cancel</label>
            </div>
          </div>
        </div>
      </div>
      <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
        <div className="overflow-hidden">

          <table className="min-w-full">
            <thead className="bg-white border-b">
                <tr>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                        Token Id
                    </th>
                    {
                      !claim && (
                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                          Shareholder Address
                        </th>
                      )
                    }

                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-right">
                        Share Percent
                    </th>
                    
                    {
                      !claim && (
                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                      
                        </th>
                      ) || (
                        <>
                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-right">
                          Claimed Revenue
                        </th>

                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-right">
                          Unclaimed Revenue
                        </th>

                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-center">
                          Claim
                        </th>
                        </>
                      )
                    }
                </tr>
            </thead>
            <tbody>
              {shares && shares.map((s,i ) => (
                <tr key={i} className="bg-white border-b">
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {s.tokenId}
                  </td>

                  { !claim && (
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {s.tokenOwner}
                      {(account === s.tokenOwner) && "(Your address)"}
                    </td>
                  )}

                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-right">
                    {s.tokenShare}%
                  </td>

                  { !claim && (
                     <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                     <button className={`btn btn-circle btn-sm ${contractLoaded && "hidden"}`} onClick={() => deleteShareholder(i)}>
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                         <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                       </svg>
                     </button> 
                     <button className={`btn btn-circle btn-sm modal-button ${!contractLoaded &&  "hidden"}`} onClick={() => handleSplitShares(s)} disabled={account && !(account.toLowerCase() === s.tokenOwner.toLowerCase())}>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                     </svg>
                     </button> 
                   </td>
                  ) || (
                    <>
                      <td className="px-6 py-4 text-gray-900 font-light whitespace-nowrap text-right">{s.amountClaimed} ETH</td>
                      <td className="px-6 py-4 text-gray-900 font-light whitespace-nowrap text-right">{s.amountToClaim} ETH</td>
                      <td className="px-6 py-4 text-center">
                        <button className="btn-primary btn" disabled={s.amountToClaim <= 0} onClick={() => claim(s.tokenId)}> Claim</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}

              <tr className="bg-white border-b">
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap" />
                
                { !claim && (
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap" />
                )}
                
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-right">
                    Total: {shareTotal}%
                </td>

                {
                  !claim && (
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">

                    </td>
                  ) || (
                    <>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-right">Total Claimed: {totalClaimed} ETH</td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-right">Total Unclaimed: {totalToClaim} ETH</td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">

                    </td>
                    </>
                )}
              </tr>
            </tbody>
        </table>
      </div>
    </div>
  </div>
  )
}