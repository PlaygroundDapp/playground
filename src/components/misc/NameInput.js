export default function NameInput({inputs = [], type= "text",disabled, displayName, name, value, placeholder, onChange, buttonName, buttonClick}) {
    return (
        <div className="flex items-center gap-6">
               {displayName && <div className=""> {displayName}</div>} 
                <input type={type} placeholder={placeholder} className="input input-bordered"  value={value} name={name} onChange={onChange}/>
                {buttonName && <button disabled={disabled} className="btn btn-neutral rounded-full btn-medium" onClick={buttonClick}> Add </button>}
        </div>
    )
}