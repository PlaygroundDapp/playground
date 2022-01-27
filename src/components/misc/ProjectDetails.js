export default function ProjectDetails({ projectName, projectSymbol }) {
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
      
    </>
  )
}