import NameInput from "../misc/NameInput"

export default function Minting() {
    const handleInputChange = (e) => {
        console.log({ e, [e.target.name]:e.target.value })
    }
    const shareholderTest = [
        {
            address: "0xsos0s",
            share: 10,
        },
        {
            address: "0x2sos0s",
            share: 30,
        },
    ]
    return (
        <div className="container mx-auto">
            <h1 className="text-xl mt-16"> Mint a new project </h1>
            <div className="mt-8">
                <NameInput displayName="Project Name" name="projectName"  onChange={handleInputChange}/>
        </div>
        <hr className="mt-4"></hr>
        <h1 className="text-xl mt-16"> Mint your shareholders </h1>
        <div className="mt-8">
                <NameInput displayName="Shareholder Address" name="address"  onChange={handleInputChange} buttonName={"Add"}/>
                <div className="mt-4">
                <div class="flex flex-col">
  <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
      <div className="overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-white border-b">
            <tr>
              <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Shareholder Address
              </th>
              <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Share Percent
              </th>
            </tr>
          </thead>
          <tbody>
              {shareholderTest.map((s, ) => (
                  <>
                  <tr className="bg-white border-b">
                  <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {s.address}
              </td>
              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              {s.share}

              </td>
                  </tr>

                  </>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

                </div>
        </div>
</div>
    )
}