import { ethers } from 'ethers';
import abi from "../abis/Playground.json";
import contractAddress from "../abis/contract-address.json";

export const getSignedContract = (address, contractABI) => {
    const { ethereum } = window;

    if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        return new ethers.Contract(address, contractABI, signer);
    }

    return null
}

export const updateProviderAndContract = (address, contractABI, setProvider, setContract) => {
    const { ethereum } = window;

    if (!ethereum) return

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, contractABI, signer);

    setProvider(provider);
    setContract(contract);
}

export const checkIfWalletIsConnected = async (setCurrentAccount) => {
    try {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have metamask!");
            return;
        } else {
            console.log("We have the ethereum object", ethereum);
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
            const account = accounts[0];
            setCurrentAccount(account.toLowerCase())
        }
    } catch (error) {
        console.log(error);
    }
}

export const connectWallet = async (setCurrentAccount) => {
    try {
        const { ethereum } = window;

        if (!ethereum) {
            alert("Get MetaMask!");
            return;
        }

        const accounts = await ethereum.request({ method: "eth_requestAccounts" });

        setCurrentAccount(accounts[0].toLowerCase());

    } catch (error) {
        console.log(error)
    }
}

export const mint = async (address, shareholderAddress, shareAmount) => {
    try {
        if (!address) {
            return;
        }
        const { ethereum } = window;

        if (!ethereum) return
    
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(address, abi.abi, signer);

        const txn = await contract.mint(shareholderAddress, shareAmount);
        console.log({ txn });
        await txn.wait();
    } catch (error) {
        console.log(error);
    }
};

export const deposit = async (contract, amount) => {
    try {
        if (!contract) {
            return;
        }

        const txn = await contract.deposit(amount);
        await txn.wait();
    } catch (error) {
        console.log(error);
    }
};


const getContract = () => {
    const { ethereum } = window;

    if (!ethereum) return

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress.PlaygroundContract, abi.abi, signer);
}

export const claim = async (tokenId) => {
    try {
        const contract = getContract();

        const txn = await contract.claim(tokenId);
        console.log(txn);
        await txn.wait();
    } catch (error) {
        console.log(error);
    }
};


export const getTokens = async (account) => {
    const tokens = [];
    try {
        const contract = getContract();

        for (let i = 0; true; i++) {
            let token = await contract.tokenOfOwnerByIndex(account, i);
            let share = await contract.shares(token.toString());
            tokens.push({
                tokenId: token.toString(),
                share: share.toString()
            });
        }
    } catch (error) {
        console.log(tokens);
        return tokens;
    }
};
