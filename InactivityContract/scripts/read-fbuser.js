const InactivityContract = artifacts.require('InactivityContract')

/*
  This script makes it easy to read a fbUser variable
  in the contract.
*/

module.exports = async callback => {
  console.log('Reading info from the first fb user:')
  const mc = await InactivityContract.deployed()
  const fbUserInfo = await mc.getFbUser.call(process.env.CLIENT_1_FB_ID)
  console.log(fbUserInfo[0].toString(), fbUserInfo[1].toString())
  callback(fbUserInfo)
}
