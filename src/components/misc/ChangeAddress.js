
import React from "react";
import NameInput from "./NameInput"
import { useInputChange } from "../../hooks/useInputChange"
import { useNavigate } from 'react-router-dom';


export default function ChangeAddress(){
  const [input, handleInputChange, setInput] = useInputChange();
  const navigate = useNavigate();
  const [change, setChange] = React.useState(false);

  const handleChangeAddress = () => {
    navigate({
        search: `?contractAddress=${input.contractAddress}`,
    })
    setInput({
        ...input,
        contractAddress: "",
    })
    setChange(false)
  }


    return (
        <div className="p-3 border-2">
            <div className={`flex text-sm ${change && "hidden"}`}>
                <button className="link link-primary mr-1"  onClick={() => setChange(true)}> Click here </button>{" "}
                <p> to add or change your contract address</p>
            </div>
            <div className={`${!change && "hidden"}`}>
                <p className="mb-4 text-sm font-bold"> Add/Change your contract Address</p>
                <div className={`flex gap-6 flex-col sm:flex-row`}>
                    <NameInput placeholder="Contract Address" name="contractAddress" value={input.contractAddress} onChange={handleInputChange}/>
                    <div>
                        <button className="btn btn-link" onClick={() => setChange(false)}>Cancel </button>
                        <button className="btn btn-neutral" onClick={handleChangeAddress} disabled={input.contractAddress.length < 5 }>Add </button>
                    </div>
                </div>

            </div>
           
           
        </div>
    )
}