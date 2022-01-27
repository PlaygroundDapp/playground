export default function ShareTable({ shares, account, contractLoaded, shareTotal, deleteShareholder=false, totalClaimed=0, claim=false}) {
  return (
    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
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
                          Amount Claimed
                        </th>

                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-right">
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
                    </td>
                  ) || (
                    <>
                      <td className="px-6 py-4 text-gray-900 font-light whitespace-nowrap text-right">{s.amountClaimed}</td>
                      <td className="px-6 py-4"><button className="btn-primary btn float-right" onClick={() => claim(s.tokenId)}> Claim</button></td>
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
                  claim && (
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-right">
                    Total Claimed: {totalClaimed}
                    </td>
                  )
                }
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">

                </td>
              </tr>
            </tbody>
        </table>
      </div>
    </div>
  </div>
  )
}