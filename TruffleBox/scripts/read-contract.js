const InactivityContract = artifacts.require('InactivityContract')

/*
  This script makes it easy to read the clientLatestSaved variable
  of the requesting contract.
*/

module.exports = async callback => {
  const mc = await InactivityContract.deployed()
  const clientLatestSaved = await mc.clientLatestSaved.call()
  callback(clientLatestSaved)
}
