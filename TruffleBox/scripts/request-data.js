const InactivityContract = artifacts.require('InactivityContract')
const CryptoJS = require('crypto-js');
/*
  This script allows for a Chainlink request to be created from
  the requesting contract. Defaults to the Chainlink oracle address
  on this page: https://docs.chain.link/docs/testnet-oracles
*/

const oracleAddress = process.env.TRUFFLE_CL_BOX_ORACLE_ADDRESS;
const jobId = process.env.TRUFFLE_CL_BOX_JOB_ID;
const payment = '1000000000000000000';
const url = process.env.TRUFFLE_CL_BOX_URL;
const clientAddress = process.env.TRUFFLE_CL_BOX_CLIENT_ADDRESS;
const serviceProviderAddress = process.env.TRUFFLE_CL_BOX_SERVICE_PROVIDER_ADDRESS;

const aesKey = process.env.AES_KEY;
const fbClientId = process.env.FB_CLIENT_ID;
const encryptedFbAccessToken = CryptoJS.AES.encrypt(process.env.FB_ACCESS_TOKEN, aesKey);

module.exports = async callback => {
  const mc = await InactivityContract.deployed();
  console.log('Creating request on contract:', mc.address);

  const tx = await mc.requestUptime(
    oracleAddress,
    web3.utils.toHex(jobId),
    payment,
    url,
    clientAddress,
    serviceProviderAddress,
    fbClientId.toString(),
    encryptedFbAccessToken.toString()
  );
  callback(tx.tx);
}
