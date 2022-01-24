import React from "react";
import {Link, useLocation} from "react-router-dom"
import { useWeb3Context } from "../../hooks/useWeb3Context";
// import { checkIfWalletIsConnected, connectWallet } from "../../utils/common"

export default function NavBar(){
    const location = useLocation();
    // const [metaAccount, setMetaAccount] = React.useState(null);
    const { isActive, connectWallet, account } = useWeb3Context();
    const routes = [
        {
            name: "Mint",
            route: "/"
        }, {
            name: "Claim",
            route: "/claim"
        }, {
            name: "Deposit",
            route: "/deposit"
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
                            <Link to={route.route}>
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
        {!isActive ? 
         <div className="text-center mt-4">
         <button className="btn-primary btn" onClick={connectWallet}> Connect wallet</button> 

     </div>
        :
        <>
         <div className="text-center mt-4">
            Wallet Connected: {account}

        </div>
        </>
        }
       
        </div>
    )
}