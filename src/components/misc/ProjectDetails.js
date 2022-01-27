export default function ProjectDetails({ projectName, projectSymbol, projectRevenue=false }) {
  return (
    <>
      <div>
        <p className="text-xs opacity-50">Project Name</p>
        <p>{projectName}</p>
      </div>
      <div>
        <p className="text-xs opacity-50">Symbol</p>
        <p>{projectSymbol}</p>
      </div>
      {
        projectRevenue && (
          <div>
            <p className="text-xs opacity-50">Revenue</p>
            <p>{projectRevenue} ETH</p>
          </div>
        )
      }
    </>
  )
}