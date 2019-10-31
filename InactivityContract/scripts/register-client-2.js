const InactivityContract = artifacts.require('InactivityContract')
const CryptoJS = require('crypto-js');

// Client variables
const clientFbId = process.env.CLIENT_2_FB_ID;
const encryptedFbAccessToken = CryptoJS.AES.encrypt(process.env.CLIENT_2_FB_ACCESS_TOKEN, process.env.AES_KEY);

module.exports = async callback => {
  const mc = await InactivityContract.deployed();
  console.log('Creating request on contract:', mc.address);

  const accounts = await web3.eth.getAccounts();

  const tx = await mc.registerUser(
    clientFbId.toString(),
    encryptedFbAccessToken.toString(),
    {
      from: accounts[2],
      value: 100000000000000000
    }
  );
  callback(tx.tx);
}
