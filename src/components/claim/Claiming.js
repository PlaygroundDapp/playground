import { claim } from "../../utils/common"


export default function Claiming() {
    const claim = () => {
      claim();
    }

    return (
      <div className="container mx-auto">  
          <h1 className="text-xl mt-16"> Claim your earnings</h1>
          
          <div className="mt-8">
            <button className="btn-primary btn" onClick={() => claim()}> Claim</button>
          </div>
      </div>
    )
}