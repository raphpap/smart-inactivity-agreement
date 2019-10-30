const InactivityContract = artifacts.require('InactivityContract')

// Client variables
const clientFbId = process.env.CLIENT_2_FB_ID;

module.exports = async callback => {
  const mc = await InactivityContract.deployed();
  console.log('Creating request on contract:', mc.address);
  console.log(`Updating data for FbUser ${clientFbId}`)

  const tx = await mc.updateUser(clientFbId.toString());
  callback(tx.tx);
}
