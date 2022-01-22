export default function NameInput({ displayName, name, value, placeholder, onChange, buttonName}) {
    return (
        <div className="flex items-center gap-6">
                <div className=""> {displayName}</div>
                <input type="text" placeholder={placeholder} className="input input-bordered"  value={value} name={name} onChange={onChange}/>
                {buttonName && <button className="btn btn-primary rounded-full btn-medium"> Add </button>}
        </div>
    )
}