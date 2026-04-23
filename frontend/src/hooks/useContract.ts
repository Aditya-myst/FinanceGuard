import { useState, useEffect } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import ABI from '../abi/DoubleFinancingAlert.json';

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Replace with your deployed address

export const useContract = () => {
  const [contract, setContract] = useState<Contract | null>(null);
  const [signer, setSigner] = useState<any>(null);
  const [account, setAccount] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connect = async () => {
      try {
        if (typeof window !== 'undefined' && (window as any).ethereum) {
          const provider = new BrowserProvider((window as any).ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            const contractInstance = new Contract(CONTRACT_ADDRESS, ABI, signer);
            
            setSigner(signer);
            setContract(contractInstance);
            setAccount(accounts[0].address);
            setIsConnected(true);
          }
        }
      } catch (error) {
        console.error('Failed to connect:', error);
      }
    };

    connect();
  }, []);

  const connectWallet = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });

        const provider = new BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new Contract(CONTRACT_ADDRESS, ABI, signer);

        setSigner(signer);
        setContract(contractInstance);
        setAccount(accounts[0]);
        setIsConnected(true);

        return true;
      } else {
        alert('Please install MetaMask');
        return false;
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return false;
    }
  };

  const disconnectWallet = () => {
    setContract(null);
    setSigner(null);
    setAccount('');
    setIsConnected(false);
  };

  return {
    contract,
    signer,
    account,
    isConnected,
    connectWallet,
    disconnectWallet,
  };
};