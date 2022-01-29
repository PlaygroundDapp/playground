import React from "react";
import {Link, useLocation} from "react-router-dom"
import { useWeb3Context } from "../../hooks/useWeb3Context";
import queryString from "query-string";
import { useNavigate  } from "react-router-dom";
import { useIsSupportedNetwork } from "../../hooks/useIsSupportedNetwork";

// import { checkIfWalletIsConnected, connectWallet } from "../../utils/common"

export default function NavBar(){
//   const location = window.location;

    const location = useLocation();
    const parsed = queryString.parse(location.search);
    const navigate = useNavigate();
    // const [metaAccount, setMetaAccount] = React.useState(null);
    const { isActive, connectWallet, account, chainId } = useWeb3Context();
    const isSupportedNetwork = useIsSupportedNetwork()
    const routes = [
        {
            name: "Mint",
            route: "/"
        }, {
            name: "Deposit",
            route: "/deposit"
        }, {
            name: "Claim",
            route: "/claim"
        }
    ]


    return (
        <div>
            <header
            className="sticky top-0 bg-white border-b border-gray-200 z-30 shadow-md"
            data-testid="container"
        >
            <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                <div className="text-xl font-bold uppercase">
                    <span className="text-primary">Playground Contract </span>
                    
                </div>
                <div className="flex items-center space-x-6">
                    {routes.map((route) => (
                        <div
                            key={route.name}
                            className={`text-gray-500 ${
                                location.pathname === route.route &&
                                "border-b-2 border-primary text-primary"
                            } py-2 hover:text-primary`}
                        >
                            <Link to={{
                                pathname:`${route.route}`,
                                search: `${parsed.contractAddress? `?contractAddress=${parsed.contractAddress }`: "" }`,
                            }}>
                            {route.name} 
                                {/* <a className=""> {route.name} </a> */}
                            </Link>
                        </div>
                    ))}
                   
                </div>
                {/* <div >
                    {metaAccount ? <>
                    <div>Connected</div>
                    </>: <button className="btn-primary btn" onClick={() => checkIfWalletIsConnected(handleConnectWallet)}> Connect your wallet</button> }
                
                </div> */}
            </div>
        </header>
        {isSupportedNetwork ?
        (!isActive ? 
         <div className="text-center mt-4">
         <button className="btn-primary btn" onClick={connectWallet}> Connect wallet</button> 

     </div>
        :
        <>
         <div className="text-center mt-4">
            Wallet Connected: {account}

        </div>
        </>
        ) :
        <div className="text-center mt-4">
            The network you are on (ChainID: {chainId}) is not supported yet. Please connect to Rinkeby.
        </div>
        }
       
        </div>
    )
}