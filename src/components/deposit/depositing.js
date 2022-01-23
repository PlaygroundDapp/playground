export default function Depositing() {
  const deposit = () => {
    console.log("deposit");
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-xl mt-16">Deposit </h1>

      <div className="mt-8">
        <button onClick={() => deposit()}> Depoist</button>
      </div>
    </div>
  );
}
