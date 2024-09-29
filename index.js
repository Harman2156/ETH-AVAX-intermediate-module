import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
    const [ethWallet, setEthWallet] = useState(undefined);
    const [account, setAccount] = useState(undefined);
    const [atm, setATM] = useState(undefined);
    const [userBalance, setUserBalance] = useState(1); // Start from 1 ETH
    const [depositAmount, setDepositAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [verificationInput, setVerificationInput] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [verificationError, setVerificationError] = useState('');

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const atmABI = atm_abi.abi;

    const getWallet = async () => {
        if (window.ethereum) {
            setEthWallet(window.ethereum);
        }
    };

    useEffect(() => {
        const checkWalletAndAccount = async () => {
            if (ethWallet) {
                const accounts = await ethWallet.request({ method: "eth_accounts" });
                handleAccount(accounts);
            }
        };
        getWallet().then(() => checkWalletAndAccount());
    }, [ethWallet]);

    const handleAccount = (accounts) => {
        if (accounts && accounts.length > 0) {
            console.log("Account connected: ", accounts[0]);
            setAccount(accounts[0]);
            getBalance();
        } else {
            console.log("No account found");
        }
    };

    const connectAccount = async () => {
        if (!ethWallet) {
            alert("MetaMask wallet is required to connect");
            return;
        }

        const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
        handleAccount(accounts);
    };

    const getATMContract = () => {
        const provider = new ethers.providers.Web3Provider(ethWallet);
        const signer = provider.getSigner();
        const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
        setATM(atmContract);
    };

    useEffect(() => {
        if (ethWallet) {
            getATMContract();
        }
    }, [ethWallet]);

    const getBalance = async () => {
        if (ethWallet && account) {
            try {
                const provider = new ethers.providers.Web3Provider(ethWallet);
                setUserBalance(1); // Set to 1 ETH on connection
            } catch (error) {
                console.error("Error fetching balance: ", error);
            }
        }
    };

    const deposit = async () => {
        if (atm) {
            const depositValue = parseInt(depositAmount);
            if (depositValue < 1) {
                alert("Please enter a value greater than 0 ETH.");
                return;
            }

            try {
                let tx = await atm.deposit({
                    value: ethers.utils.parseUnits(depositValue.toString(), 'ether') // Use 'ether'
                });
                await tx.wait();
                setDepositAmount(""); // Clear the deposit input

                // Increment user balance after deposit
                setUserBalance(prevBalance => prevBalance + depositValue);
                
            } catch (error) {
                console.error("Error during deposit: ", error);
            }
        }
    };

    const withdraw = async () => {
        if (atm && withdrawAmount) {
            const withdrawValue = parseInt(withdrawAmount);
            if (withdrawValue > userBalance) {
                alert("Insufficient balance for withdrawal.");
                return;
            }

            try {
                let tx = await atm.withdraw(ethers.utils.parseUnits(withdrawValue.toString(), 'ether')); // Use 'ether'
                await tx.wait();
                setWithdrawAmount(""); // Clear the withdraw input

                // Decrement user balance after withdrawal
                setUserBalance(prevBalance => prevBalance - withdrawValue);
                
            } catch (error) {
                console.error("Error during withdraw: ", error);
            }
        }
    };

    const verifyHuman = () => {
        const inputNum = parseInt(verificationInput);
        if (!isNaN(inputNum) && inputNum > 10 && inputNum <= 99) {
            setVerificationError('');
            setIsVerified(true);
        } else {
            setVerificationError('Verification failed. Please enter a number greater than 10 and up to 99.');
        }
    };

    const initUser = () => {
        if (!ethWallet) {
            return <p>Please install MetaMask to use this ATM.</p>;
        }

        if (!account) {
            return <button onClick={connectAccount}>Open Wallet</button>;
        }

        return (
            <div>
                <p>Your Account: {account}</p>
                <p>Receiver Address: {contractAddress}</p>
                <p>Your Balance: {userBalance} ETH</p>

                {!isVerified ? (
                    <div>
                        <label htmlFor="verificationInput">Verify you are not a robot: </label>
                        <input
                            type="number"
                            id="verificationInput"
                            value={verificationInput}
                            onChange={(e) => setVerificationInput(e.target.value)}
                            placeholder="Enter a number greater than 10 and up to 99"
                            min="11"
                            max="99"
                            step="1"
                        />
                        <button onClick={verifyHuman}>Verify</button>
                        {verificationError && <p style={{ color: 'red' }}>{verificationError}</p>}
                    </div>
                ) : (
                    <>
                        <div>
                            <input
                                type="number"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                                placeholder="Amount to Deposit (ETH)"
                                min="1"
                            />
                            <button onClick={deposit}>Deposit ETH</button>
                        </div>

                        <div>
                            <input
                                type="number"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                placeholder="Amount to Withdraw (ETH)"
                                min="1"
                            />
                            <button onClick={withdraw}>Withdraw ETH</button>
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <main className="container">
            <header>
                <h1>Welcome to the Metacrafters ATM!</h1>
            </header>
            <div className="balance-container">
                {initUser()}
            </div>
            <style jsx>{`
                .container {
                    text-align: center;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    font-family: 'Arial', sans-serif;
                }

                header h1 {
                    font-size: 2.5rem;
                    margin-bottom: 20px;
                }

                p {
                    font-size: 1.2rem;
                    margin: 10px 0;
                }

                input {
                    padding: 10px;
                    margin: 10px;
                    border-radius: 5px;
                    border: 1px solid #ccc;
                }

                button {
                    background-color: #4caf50;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    font-size: 1.1rem;
                    border-radius: 10px;
                    cursor: pointer;
                    margin: 10px;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                }

                button:hover {
                    background-color: #45a049;
                    transform: translateY(-2px);
                    box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.2);
                }

                button:active {
                    transform: translateY(1px);
                }

                .balance-container {
                    background-color: rgba(255, 255, 255, 0.2);
                    padding: 30px;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    margin-bottom: 20px;
                    width: 400px;
                }

                .balance-container p {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin: 0;
                }
            `}</style>
        </main>
    );
}
