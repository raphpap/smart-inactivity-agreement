const InactivityContract = artifacts.require('InactivityContract')
const CryptoJS = require('crypto-js');

// Inactivity Contract
const oracleAddress = process.env.ORACLE_ADDRESS;
const jobId = process.env.JOB_ID;
const payment = '1000000000000000000';

// Client variables
const clientAddress = process.env.CLIENT_1_ADDRESS;
const clientFbId = process.env.CLIENT_1_FB_ID;
const encryptedFbAccessToken = CryptoJS.AES.encrypt(process.env.CLIENT_1_FB_ACCESS_TOKEN, process.env.AES_KEY);

module.exports = async callback => {
  const mc = await InactivityContract.deployed();
  console.log('Creating request on contract:', mc.address);

  const accounts = await web3.eth.getAccounts();

  const tx = await mc.requestUptime(
    oracleAddress,
    web3.utils.toHex(jobId),
    payment,
    clientAddress,
    clientFbId.toString(),
    encryptedFbAccessToken.toString(),
    {
      from: accounts[1],
      value: 100000000000000000
    }
  );
  callback(tx.tx);
}
