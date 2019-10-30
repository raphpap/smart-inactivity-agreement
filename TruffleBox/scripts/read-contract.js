const InactivityContract = artifacts.require('InactivityContract')

/*
  This script makes it easy to read the fbUserStructs variable
  of the requesting contract.
*/

module.exports = async callback => {
  const mc = await InactivityContract.deployed()
  const fbUserStructs = await mc.fbUserStructs.call()
  callback(fbUserStructs)
}
