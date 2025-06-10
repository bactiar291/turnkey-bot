import { ethers } from "ethers";
import readline from "readline";
import chalk from "chalk";
import figlet from "figlet";


figlet('bactiar 291', (err, data) => {
  if (err) {
    console.log('Error generating banner:', err);
    return;
  }

  console.log(chalk.greenBright(data));
  console.log(chalk.yellowBright("\nPlease enter your private key below:\n"));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Private key: ', (privateKey) => {
    rl.close();

    
    const rpcUrl = 'https://ethereum-sepolia-rpc.publicnode.com';
    const network = {
      name: "sepolia",
      chainId: 11155111,
    };

    const provider = new ethers.JsonRpcProvider(rpcUrl, network);
    const wallet = new ethers.Wallet(privateKey, provider);

    
    const generateRandomAddress = () => {
      const randomWallet = ethers.Wallet.createRandom();
      return randomWallet.address;
    };

    
    const getRandomAmount = () => {
      const min = ethers.parseUnits("0.00000001", "ether");
      const max = ethers.parseUnits("0.0000008", "ether");
      const range = max - min;
      const rand = BigInt(Math.floor(Math.random() * Number(range)));
      return min + rand;
    };

    
    const sendTransaction = async () => {
      const randomAddress = generateRandomAddress();
      const amount = getRandomAmount();

      const tx = {
        to: randomAddress,
        value: amount
      };

      try {
        const transaction = await wallet.sendTransaction(tx);
        console.log(`Transaction sent: ${transaction.hash}`);
        await transaction.wait();
        console.log(`✅ Confirmed: ${transaction.hash}`);
      } catch (error) {
        console.error("❌ Error sending transaction:", error);
      }
    };

    
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    
    const autoSend = async () => {
      while (true) {
        await sendTransaction();
        const delay = Math.floor(Math.random() * (6000 - 3000 + 1)) + 3000; 
        console.log(chalk.cyan(`⏳ Delay ${delay / 1000} detik...\n`));
        await sleep(delay);
      }
    };

    autoSend();
  });
});
