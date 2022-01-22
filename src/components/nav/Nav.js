import React from "react";

export default function NavBar(){
    const hash = global.window && window.location.hash;
    const routes = [
        {
            name: "mint",
            route: "/"
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
                    <span className="text-primary">Playground </span>
                    
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
                            {/* <Link href={route.route}>
                                <a className=""> {route.name} </a>
                            </Link> */}
                        </div>
                    ))}
                </div>
            </div>
        </header>
        </div>
    )
}