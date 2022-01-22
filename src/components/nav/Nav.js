import React from "react";
import {Link} from "react-router-dom"
import { checkIfWalletIsConnected, connectWallet } from "../../utils/common"

export default function NavBar(){
    const hash = global.window && window.location.hash;
    const routes = [
        {
            name: "Mint",
            route: "/"
        }
    ]
    const handleConnectWallet = (account) => {
        // console.log({ account }) 

    }


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
                                hash === route.route.split("/")[1] &&
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
                <div className="btn-primary btn">
                <button onClick={() => checkIfWalletIsConnected(handleConnectWallet)}> Connect your wallet</button>
                </div>
            </div>
        </header>
        </div>
    )
}