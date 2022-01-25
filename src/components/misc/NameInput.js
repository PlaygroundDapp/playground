export default function NameInput({inputs = [], type= "text",disabled, displayName, name, value, placeholder, onChange, buttonName, buttonClick}) {
    return (
        <div className=" items-center gap-6">
               {/* {displayName && <div className="text-sm"> {displayName}</div>}  */}
               {displayName &&
                    <label class="label">
                        <span class="label-text">{displayName}</span>
                    </label> 
               }
               
                <input type={type} placeholder={placeholder} className="input input-bordered w-full"  value={value} name={name} onChange={onChange}/>
                {buttonName && <button disabled={disabled} className="btn btn-neutral btn-medium ml-4" onClick={buttonClick}> Add </button>}
        </div>
    )
}