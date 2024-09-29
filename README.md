# React Crypto ATM

This is a simple React component for a Crypto ATM application. It allows users to connect their MetaMask wallet, deposit or withdraw ETH, and change their account address using the wallet connection.

## Features

The Crypto ATM component provides the following features:

- Connect to MetaMask wallet
- Display user's account address
- Start user balance at 1 ETH
- Deposit ETH into the ATM (between 1 and 10 ETH)
- Withdraw ETH from the ATM
- Verify user to prevent automated actions
- user can give the amount of deposit and withdraw
- input and withdraw buttons  have specific range 

Please note that the component assumes you have set up and configured MetaMask in your browser.

## Customization

You can customize the UI elements, styles, and behavior of the Crypto ATM component according to your project's requirements. Modify the JSX structure, CSS styles, and event handlers to align with your application's design and functionality.

## Setup
After cloning the github, you will want to do the following to get the code running on your computer.

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. Typically at http://localhost:3000/
