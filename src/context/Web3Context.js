import { createContext, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

export const Web3Context = createContext({
  provider: null,
  account: null,
  isActive: false,
  isPageLoaded: false,
  connectWallet: () => {},
});

export function Web3ContextProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  async function checkIfWalletIsConnected() {
    const { ethereum } = window;
    if (!ethereum) return;

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length) {
      setAccount(accounts[0]);
      setProvider(new ethers.providers.Web3Provider(ethereum));
      setIsActive(true);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    setIsPageLoaded(true);
  }, []);

  const contextValue = useMemo(
    () => ({
      provider,
      account,
      isActive,
      isPageLoaded,
      connectWallet: async () => {
        const { ethereum } = window;

        // request account
        await ethereum.request({ method: "eth_requestAccounts" });

        checkIfWalletIsConnected();
      },
    }),
    [provider, account, isActive, isPageLoaded]
  );

  return (
    <Web3Context.Provider value={contextValue}>{children}</Web3Context.Provider>
  );
}
